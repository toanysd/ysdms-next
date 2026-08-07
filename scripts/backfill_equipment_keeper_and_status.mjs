import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';
import { createClient } from '@supabase/supabase-js';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read .env.local manually (no dotenv dependency needed)
const envFile = fs.readFileSync(path.resolve(__dirname, '../.env.local'), 'utf8');
let supabaseUrl, supabaseKey;
envFile.split('\n').forEach(l => {
  if (l.startsWith('NEXT_PUBLIC_SUPABASE_URL=')) supabaseUrl = l.split('=').slice(1).join('=').trim();
  if (l.startsWith('SUPABASE_SERVICE_ROLE_KEY=')) supabaseKey = l.split('=').slice(1).join('=').trim();
});

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

function loadCSV(filename) {
  const filePath = path.resolve(__dirname, '../source_data/csv-access-data', filename);
  if (!fs.existsSync(filePath)) {
    console.warn(`File not found: ${filePath}`);
    return [];
  }
  // Simply reading with utf8 for now, some Japanese chars might be garbled but columns are readable
  const fileContent = fs.readFileSync(filePath, 'utf8');
  return parse(fileContent, {
    columns: true,
    skip_empty_lines: true,
    bom: true,
    relax_column_count: true
  });
}

// Global cache
let companyCache = {}; // legacy_id -> uuid
let equipmentCache = {}; // legacy_mold_id -> uuid
let employeeCache = {}; // legacy_id -> uuid
let destinationCache = {}; // legacy_id -> uuid
let ysdCompanyId = null; // YSD company UUID (global)

async function fetchAll(table, columns) {
  const PAGE = 1000;
  let allData = [];
  let from = 0;
  while (true) {
    const { data, error } = await supabase.from(table).select(columns).range(from, from + PAGE - 1);
    if (error) { console.error(`Error fetching ${table}:`, error.message); break; }
    if (!data || data.length === 0) break;
    allData = allData.concat(data);
    if (data.length < PAGE) break;
    from += PAGE;
  }
  return allData;
}

async function fetchCaches() {
  console.log("Fetching lookup caches (paginated)...");
  
  const companies = await fetchAll('companies', 'company_id, legacy_id, company_code');
  companies.forEach(c => {
    if (c.legacy_id) companyCache[c.legacy_id] = c.company_id;
    if (c.company_code) companyCache['CODE-' + c.company_code] = c.company_id;
    if (c.company_code === 'YSD') ysdCompanyId = c.company_id;
  });
  console.log('  YSD company_id:', ysdCompanyId);

  const employees = await fetchAll('employees', 'employee_id, legacy_id');
  employees.forEach(e => {
    if (e.legacy_id) employeeCache[e.legacy_id] = e.employee_id;
  });

  // physical_molds → equipment mapping (paginated)
  const physMolds = await fetchAll('physical_molds', 'physical_mold_id, legacy_id');
  const pmIdToLegacy = {};
  physMolds.forEach(pm => {
    if (pm.legacy_id) {
      pmIdToLegacy[pm.physical_mold_id] = pm.legacy_id;
    }
  });
  
  const equip = await fetchAll('equipment', 'equipment_id, legacy_physical_mold_id, equipment_code, legacy_id');
  equip.forEach(e => {
    if (e.legacy_physical_mold_id && pmIdToLegacy[e.legacy_physical_mold_id]) {
      equipmentCache[pmIdToLegacy[e.legacy_physical_mold_id]] = e.equipment_id;
    }
    if (e.legacy_id) {
      equipmentCache[e.legacy_id] = e.equipment_id;
    }
    if (e.equipment_code) {
      equipmentCache['CODE-' + e.equipment_code] = e.equipment_id;
    }
  });
  
  console.log('  Companies:', Object.keys(companyCache).length, 'Employees:', Object.keys(employeeCache).length, 'Equipment:', Object.keys(equipmentCache).length);
  console.log('  PhysMolds loaded:', physMolds.length, 'Equipment loaded:', equip.length);
  // Note: Destinations will be fetched after Step A
}

async function stepA_seedDestinations(records) {
  console.log(`\n--- Step A: Seeding Destinations (${records.length} records) ---`);
  let updated = 0;
  let inserted = 0;
  
  for (const record of records) {
    if (!record.DestinationID) continue;
    const legacyId = parseInt(record.DestinationID, 10);
    const name = record.DestinationName || 'Unknown';
    
    // Try to find existing by destination_name match
    const { data: existing } = await supabase.from('destinations')
      .select('destination_id')
      .eq('destination_name', name)
      .limit(1)
      .maybeSingle();
    
    if (existing) {
      // Update existing with legacy_id
      const { error } = await supabase.from('destinations')
        .update({ legacy_id: legacyId })
        .eq('destination_id', existing.destination_id);
      if (!error) updated++;
      else console.error(`  Error updating destination ${name}:`, error.message);
    } else {
      // Insert new
      const { error } = await supabase.from('destinations').insert({
        legacy_id: legacyId,
        destination_name: name
      });
      if (error && error.code !== '23505') {
        console.error(`  Error inserting destination ${name}:`, error.message);
      } else if (!error) {
        inserted++;
      }
    }
  }
  
  // Refresh destination cache
  const { data: dests } = await supabase.from('destinations').select('destination_id, legacy_id');
  if (dests) {
    dests.forEach(d => {
      if (d.legacy_id) destinationCache[d.legacy_id] = d.destination_id;
    });
  }
  console.log(`Step A Complete: ${updated} updated, ${inserted} inserted.`);
  return updated + inserted;
}

async function stepB_backfillEquipmentKeeper(records) {
  console.log(`\n--- Step B: Backfilling equipment.keeper_company_id (${records.length} records) ---`);
  // Default keeper = YSD (when KeeperCompany is empty or not mapped)
  const defaultCompanyUuid = ysdCompanyId || companyCache['CODE-YSD'];
  if (!defaultCompanyUuid) {
    console.error('  ⚠️ Cannot find YSD company! Skipping keeper backfill.');
    return 0;
  }
  console.log('  Default keeper (YSD):', defaultCompanyUuid);
  let updated = 0;
  
  for (let i = 0; i < records.length; i++) {
    const record = records[i];
    if (!record.MoldID) continue;
    
    const moldLegacyId = `MOLD-${record.MoldID}`;
    const keeperCompanyLegacyId = record.KeeperCompany ? `COMP-${record.KeeperCompany}` : null;
    
    let companyUuid = defaultCompanyUuid;
    if (keeperCompanyLegacyId && companyCache[keeperCompanyLegacyId]) {
      companyUuid = companyCache[keeperCompanyLegacyId];
    }
    
    const equipmentUuid = equipmentCache[moldLegacyId] || (record.MoldCode ? equipmentCache[`CODE-${record.MoldCode.trim()}`] : null);
    if (equipmentUuid && companyUuid) {
      const { error } = await supabase.from('equipment')
        .update({ keeper_company_id: companyUuid })
        .eq('equipment_id', equipmentUuid);
      
      if (error) {
        console.error(`Error updating equipment ${equipmentUuid}:`, error.message);
      } else {
        updated++;
      }
    }
    
    if (i > 0 && i % 100 === 0) {
      console.log(`  Progress: ${i}/${records.length} processed`);
    }
  }
  console.log(`Step B Complete: ${updated} equipment records updated.`);
  return updated;
}

async function stepC_backfillEquipmentStatus(records) {
  console.log(`\n--- Step C: Backfilling equipment.usage_status (${records.length} logs) ---`);
  
  // Group by MoldID, find latest
  const latestLogs = {};
  records.forEach(r => {
    if (!r.MoldID) return;
    if (!latestLogs[r.MoldID]) {
      latestLogs[r.MoldID] = r;
    } else {
      const currTime = new Date(r.Timestamp || 0).getTime();
      const prevTime = new Date(latestLogs[r.MoldID].Timestamp || 0).getTime();
      // Alternatively use StatusLogID if timestamp is missing or equal
      if (currTime > prevTime || (currTime === prevTime && parseInt(r.StatusLogID || 0) > parseInt(latestLogs[r.MoldID].StatusLogID || 0))) {
        latestLogs[r.MoldID] = r;
      }
    }
  });
  
  let updated = 0;
  for (const moldId of Object.keys(latestLogs)) {
    const record = latestLogs[moldId];
    const equipmentUuid = equipmentCache[`MOLD-${moldId}`];
    
    if (equipmentUuid) {
      // Map status
      let newStatus = 'IN';
      const rawStatus = (record.Status || '').trim().toUpperCase();
      if (rawStatus === 'OUT') newStatus = 'OUT';
      else if (rawStatus === 'DISPOSED') newStatus = 'DISPOSED';
      else if (rawStatus === 'RETURNED') newStatus = 'IN';
      
      const updateData = { usage_status: newStatus };
      if (newStatus === 'OUT' && record.Timestamp) {
        updateData.returned_date = record.Timestamp;
      }
      
      const { error } = await supabase.from('equipment')
        .update(updateData)
        .eq('equipment_id', equipmentUuid);
        
      if (error) {
        console.error(`Error updating status for equipment ${equipmentUuid}:`, error.message);
      } else {
        updated++;
      }
    }
  }
  console.log(`Step C Complete: ${updated} equipment statuses updated.`);
  return updated;
}

async function stepD_importStatusLogs(records) {
  console.log(`\n--- Step D: Importing equipment_status_logs (${records.length} records) ---`);
  let inserted = 0;
  for (let i = 0; i < records.length; i++) {
    const r = records[i];
    if (!r.StatusLogID) continue;
    
    const equipmentUuid = equipmentCache[`MOLD-${r.MoldID}`];
    if (!equipmentUuid) continue; // Requires equipment mapping
    
    const empUuid = employeeCache[`EMP-${r.EmployeeID}`] || null;
    const destUuid = destinationCache[parseInt(r.DestinationID)] || null;
    
    let mappedStatus = 'IN';
    const rawStatus = (r.Status || '').trim().toUpperCase();
    if (rawStatus === 'OUT') mappedStatus = 'OUT';
    else if (rawStatus === 'DISPOSED') mappedStatus = 'DISPOSED';
    else if (rawStatus === 'RETURNED') mappedStatus = 'RETURNED';
    else if (rawStatus === 'AUDIT') mappedStatus = 'AUDIT';
    
    const { error } = await supabase.from('equipment_status_logs').insert({
      legacy_status_log_id: parseInt(r.StatusLogID, 10),
      equipment_id: equipmentUuid,
      status: mappedStatus,
      action_date: r.Timestamp || new Date().toISOString(),
      employee_id: empUuid,
      destination_id: destUuid,
      to_location: r.ToLocation || null,
      notes: r.Notes || null,
      legacy_mold_id: parseInt(r.MoldID, 10) || null
    });
    
    if (error && error.code !== '23505') {
      console.error(`Error inserting status log ${r.StatusLogID}:`, error.message);
    } else if (!error) {
      inserted++;
    }
    
    if (i > 0 && i % 100 === 0) {
      console.log(`  Progress: ${i}/${records.length} processed`);
    }
  }
  console.log(`Step D Complete: ${inserted} status logs inserted.`);
  return inserted;
}

async function stepE_importShipLogs(records) {
  console.log(`\n--- Step E: Importing equipment_ship_logs (${records.length} records) ---`);
  let inserted = 0;
  for (let i = 0; i < records.length; i++) {
    const r = records[i];
    if (!r.ShipID) continue;
    
    const equipmentUuid = r.MoldID ? equipmentCache[`MOLD-${r.MoldID}`] : null;
    const fromCompUuid = r.FromCompanyID ? companyCache[`COMP-${r.FromCompanyID}`] : null;
    const toCompUuid = r.ToCompanyID ? companyCache[`COMP-${r.ToCompanyID}`] : null;
    // Emp mapping not strictly provided but can map
    
    const { error } = await supabase.from('equipment_ship_logs').insert({
      legacy_ship_id: parseInt(r.ShipID, 10),
      equipment_id: equipmentUuid,
      equipment_type: r.ItemTypeID || null,
      ship_item_name: r.ShipItemName || null,
      ship_date: r.ShipDate || new Date().toISOString().split('T')[0],
      from_company_id: fromCompUuid,
      to_company_id: toCompUuid,
      notes: r.Notes || null,
      legacy_mold_id: parseInt(r.MoldID, 10) || null
    });
    
    if (error && error.code !== '23505') {
      console.error(`Error inserting ship log ${r.ShipID}:`, error.message);
    } else if (!error) {
      inserted++;
    }
    
    if (i > 0 && i % 100 === 0) {
      console.log(`  Progress: ${i}/${records.length} processed`);
    }
  }
  console.log(`Step E Complete: ${inserted} ship logs inserted.`);
  return inserted;
}

async function stepF_importLocationLogs(records) {
  console.log(`\n--- Step F: Importing equipment_history from locationlog (${records.length} records) ---`);
  let inserted = 0;
  for (let i = 0; i < records.length; i++) {
    const r = records[i];
    if (!r.MoldID) continue;
    
    const equipmentUuid = equipmentCache[`MOLD-${r.MoldID}`];
    if (!equipmentUuid) continue;
    
    const { error } = await supabase.from('equipment_history').insert({
      equipment_id: equipmentUuid,
      action_type: 'RACK_MOVE',
      from_location: r.OldRackLayer || null,
      to_location: r.NewRackLayer || null,
      action_date: r.DateEntry || new Date().toISOString()
    });
    
    // We don't have a unique ID for locationlog, so can't easily prevent duplicates on re-run unless we check existing
    // But as per instructions, just insert.
    if (error) {
      console.error(`Error inserting location log for mold ${r.MoldID}:`, error.message);
    } else {
      inserted++;
    }
    
    if (i > 0 && i % 100 === 0) {
      console.log(`  Progress: ${i}/${records.length} processed`);
    }
  }
  console.log(`Step F Complete: ${inserted} location logs inserted.`);
  return inserted;
}

async function main() {
  console.log("Starting backfill script...");
  await fetchCaches();
  
  const destCsv = loadCSV('destinations.csv');
  const moldsCsv = loadCSV('molds.csv');
  const statusCsv = loadCSV('statuslogs.csv');
  const shipCsv = loadCSV('shiplog.csv');
  const locationCsv = loadCSV('locationlog.csv');
  
  const results = {};
  
  if (destCsv.length > 0) results.stepA = await stepA_seedDestinations(destCsv);
  if (moldsCsv.length > 0) results.stepB = await stepB_backfillEquipmentKeeper(moldsCsv);
  if (statusCsv.length > 0) results.stepC = await stepC_backfillEquipmentStatus(statusCsv);
  if (statusCsv.length > 0) results.stepD = await stepD_importStatusLogs(statusCsv);
  if (shipCsv.length > 0) results.stepE = await stepE_importShipLogs(shipCsv);
  if (locationCsv.length > 0) results.stepF = await stepF_importLocationLogs(locationCsv);
  
  console.log("\n================ SUMMARY ================");
  console.log(`Step A (Destinations Inserted): ${results.stepA ?? 0}`);
  console.log(`Step B (Equipment Keeper Updated): ${results.stepB ?? 0}`);
  console.log(`Step C (Equipment Status Updated): ${results.stepC ?? 0}`);
  console.log(`Step D (Status Logs Inserted): ${results.stepD ?? 0}`);
  console.log(`Step E (Ship Logs Inserted): ${results.stepE ?? 0}`);
  console.log(`Step F (Location Logs Inserted): ${results.stepF ?? 0}`);
  console.log("=========================================\n");
  
  console.log("Backfill complete!");
}

main().catch(console.error);
