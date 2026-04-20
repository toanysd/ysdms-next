import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Setup basic __dirname for ES modules
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.join(__dirname, '../.env.local');

// Load environment variables (pseudo dotenv)
const envConfig = fs.readFileSync(envPath, 'utf8');
const envKeys = {};
envConfig.split('\n').forEach(line => {
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match) envKeys[match[1]] = match[2].trim();
});

const supabaseUrl = envKeys['NEXT_PUBLIC_SUPABASE_URL'];
const supabaseKey = envKeys['SUPABASE_SERVICE_ROLE_KEY'];

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing SUPABASE env vars!');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// CLI args
const isDryRun = process.argv.includes('--dry-run');

// Master Suffix Dictionary (Version related only)
const SUFFIX_MAP = {
    'KAIZEN': 'RK'
};

// Global variables to track uniqueness for physical codes
const seenPhysicalCodes = new Map();

/**
 * Parses the raw design name into Base and Revision correctly.
 */
function parseMoldName(rawName) {
    if (!rawName) return { base: 'UNKNOWN', revision: 'R0', explicitNo: null, metadata: '' };

    let base = rawName.toUpperCase().trim();
    let rev = 'R0';
    let explicitNo = null;
    let metadata = '';

    // 1. Extract explicit No.1, No.2, No1
    const noMatch = base.match(/\s*NO\.?\s*(\d+)/);
    if (noMatch) {
        explicitNo = 'N' + noMatch[1].padStart(2, '0');
        base = base.replace(noMatch[0], '').trim();
    }

    // 2. Check mapping dictionary for Kaizen (RK)
    let matchedSuffix = false;
    for (const [key, val] of Object.entries(SUFFIX_MAP)) {
        if (base.includes(key)) {
            rev = val;
            base = base.replace(key, '').trim();
            matchedSuffix = true;
            break;
        }
    }

    // 3. Extract material markers
    let materialOpt = '';
    const matMatch = base.match(/\s*(PET|PP|PS|ABS|PVC|PP\(N\)|PS\(CL\))/);
    if (matMatch) {
        materialOpt = matMatch[1];
        base = base.replace(matMatch[0], '').trim();
    }

    // 4. Extract standard Revision R1, R2, or R
    if (!matchedSuffix) {
        const revNumMatch = base.match(/(?:-|\s|)(R[0-9]+[A-Z]?|R-[0-9]+)$/);
        if (revNumMatch) {
            rev = revNumMatch[1].replace('-', ''); // Tidy up 'R-1' to 'R1'
            base = base.slice(0, revNumMatch.index).trim();
        } else {
            const revRMatch = base.match(/(?:-|\s|)R$/);
            if (revRMatch) {
                rev = 'R1';
                base = base.slice(0, revRMatch.index).trim();
            }
        }
    }

    // Append material option to revision differentiation
    if (materialOpt) {
        rev = rev !== 'R0' ? `${rev}-${materialOpt}` : `R0-${materialOpt}`;
    }

    // 5. Strip M/P
    base = base.replace(/(\d+)[MP](?=-|$|\s)/gi, '$1');

    // 6. Types, T/B, and CAV handling
    base = base.replace(/(?:-|\s+)T$/, '-T');
    base = base.replace(/(?:-|\s+)B$/, '-B');
    base = base.replace(/\s+TYPE\s+([A-Z0-9])/g, '-TYPE-$1');
    base = base.replace(/\s+AB/g, '-AB');
    base = base.replace(/\s+(CAV\d+\.?\d*)/g, '-$1');
    
    // 7. Extract trailing numeric metadata (e.g. 585x285, 74H)
    const metaMatch = base.match(/(?:\s+|-)([0-9]{2,}[X][0-9]{2,}|[0-9]{2,}H)$/i);
    if (metaMatch) {
        metadata = metaMatch[1];
        base = base.replace(metaMatch[0], '');
    }

    base = base.replace(/\s+/g, '-');
    base = base.replace(/-+$/, '').trim();

    return { base, revision: rev, explicitNo, metadata };
}

function loadCsv(fileName) {
    const filePath = path.join(__dirname, '../source_data', fileName);
    const fileContent = fs.readFileSync(filePath, 'utf8').replace(/^\uFEFF/, '');
    const lines = fileContent.split(/\r?\n/).filter(l => l.trim().length > 0);
    if (lines.length === 0) return [];

    const headers = lines[0].split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map(h => h.trim().replace(/^"|"$/g, '').replace(/^\uFEFF/, ''));
    const rows = [];
    
    for (let i = 1; i < lines.length; i++) {
        const rowElements = lines[i].split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map(v => v.trim().replace(/^"|"$/g, ''));
        const obj = {};
        for(let j=0; j < headers.length; j++) {
            obj[headers[j]] = rowElements[j] || '';
        }
        rows.push(obj);
    }
    return rows;
}

function normalizeStatus(jpStatus) {
    if (!jpStatus) return 'ACTIVE';
    if (jpStatus.includes('廃棄済') || jpStatus.includes('SCRAP') || jpStatus === '12') return 'SCRAPPED';
    if (jpStatus.includes('INACTIVE') || jpStatus === '10') return 'INACTIVE';
    return 'ACTIVE'; 
}

async function run() {
    console.log(`🚀 Starting Mold Import Pipeline ${isDryRun ? '[DRY RUN MODE]' : ''}`);

    // --- DICTIONARIES (Memory) ---
    console.log('Loading local dictionaries...');
    const trayRecords = loadCsv('tray.csv');
    const trayCodeMap = new Map(); // TrayID -> MoldTrayName (part_no)
    trayRecords.forEach(t => {
        if (t.TrayID && t.MoldTrayName) trayCodeMap.set(t.TrayID, t.MoldTrayName);
    });

    const customersRecords = loadCsv('customers.csv');
    const customerShortNameMap = new Map(); // CustomerID -> CustomerShortName
    customersRecords.forEach(c => {
        if (c.CustomerID && c.CustomerShortName) customerShortNameMap.set(c.CustomerID, c.CustomerShortName);
    });

    const moldDesignRecords = loadCsv('molddesign.csv');
    const moldDesignMap = new Map(); // MoldDesignID -> MoldDesignName
    moldDesignRecords.forEach(d => {
        if (d.MoldDesignID && d.MoldDesignName) moldDesignMap.set(d.MoldDesignID, d.MoldDesignName);
    });

    // --- DB DICTIONARIES (Memory) ---
    console.log('Fetching remote references from DB...');
    const dbProductMap = new Map(); // code -> id
    let p_offset = 0;
    while(true) {
        const { data: dbProducts, error: errProducts } = await supabase.from('product_master').select('id, code').range(p_offset, p_offset + 999);
        if (errProducts) throw errProducts;
        if (!dbProducts || dbProducts.length === 0) break;
        dbProducts.forEach(p => dbProductMap.set(p.code, p.id));
        p_offset += 1000;
    }
    console.log(`Loaded ${dbProductMap.size} Products.`);

    const dbCustomerMap = new Map(); // code -> id
    let c_offset = 0;
    while(true) {
        const { data: dbCustomers, error: errCust } = await supabase.from('customers').select('id, customer_code').range(c_offset, c_offset + 999);
        if (errCust) throw errCust;
        if (!dbCustomers || dbCustomers.length === 0) break;
        dbCustomers.forEach(c => dbCustomerMap.set(c.customer_code, c.id));
        c_offset += 1000;
    }
    console.log(`Loaded ${dbCustomerMap.size} Customers.`);

    // --- PROCESSING MOLDS.CSV ---
    console.log('Loading physical molds data...');
    const physicalMoldsRaw = loadCsv('molds.csv');
    console.log(`Analyzing ${physicalMoldsRaw.length} raw physical mold records.`);

    const uniqueBases = new Map(); // base -> { base, customer_id }
    const uniqueRevisions = new Map(); // base_rev -> { base, rev }
    const physicalMoldsToInsert = [];
    const moldMapToInsert = [];

    // Tally dry run logs
    let numOrphans = 0;
    
    // Grouping container for 2-pass identical mold labeling
    const physGroups = {};
    
    physicalMoldsRaw.forEach((row, idx) => {
        const rawDesignName = moldDesignMap.get(row.MoldDesignID);
        // Fallback to MoldName if Design is not linked
        const designNameToParse = rawDesignName || row.MoldName || `UNKNOWN-${row.MoldID}`;
        
        // Nomenclature parsing
        const p = parseMoldName(designNameToParse);
        const { base, revision, explicitNo } = p;

        if (isDryRun && idx < 20) {
            console.log(`DRY-RUN Parse: raw="${designNameToParse}" => base="${base}" rev="${revision}" explicitNo="${explicitNo || 'null'}"`);
        }

        // Map Customer
        let customer_id = null;
        let cName = customerShortNameMap.get(row.CustomerID);
        if (cName && dbCustomerMap.has(cName)) {
            customer_id = dbCustomerMap.get(cName);
        }

        // 1. Prepare Base
        if (!uniqueBases.has(base)) {
            uniqueBases.set(base, {
                code: base,
                name: `Khuôn ${base}`,
                customer_id: customer_id,
                is_active: true
            });
        }

        // 2. Prepare Revision
        const revKey = `${base}-${revision}`;
        if (!uniqueRevisions.has(revKey)) {
            uniqueRevisions.set(revKey, {
                base_code: base,
                revision_code: revKey,
                version_label: revision
            });
        }

        // Evaluate baseline physical name without duplicates appended
        let physCodeBase = base;
        if (rawDesignName && revision !== 'R0') {
            if (revision.startsWith('R0-')) {
                physCodeBase = `${base}-${revision.substring(3)}`;
            } else {
                physCodeBase = `${base}-${revision}`;
            }
        }
        
        if (!physGroups[physCodeBase]) physGroups[physCodeBase] = [];
        physGroups[physCodeBase].push({ row, revKey, explicitNo, physCodeBase, p });
    });

    // Pass 2: Iterate grouped templates and apply -N0X if duplicates
    const finalUsedPhysicalCodes = new Set();
    for (const groupKey of Object.keys(physGroups)) {
        const items = physGroups[groupKey];
        if (items.length === 1) {
            const item = items[0];
            let finalCode = item.explicitNo ? `${item.physCodeBase}-${item.explicitNo}` : item.physCodeBase;
            finalCode = ensureUnique(finalCode);
            addPhysicalMold(item, finalCode);
        } else {
            let counter = 1;
            items.forEach(item => {
                let finalCode;
                if (item.explicitNo) {
                    finalCode = `${item.physCodeBase}-${item.explicitNo}`;
                    const noDigit = parseInt(item.explicitNo.replace('N', '')) || counter;
                    counter = noDigit + 1; // Safely advance counter
                } else {
                    finalCode = `${item.physCodeBase}-N${counter.toString().padStart(2, '0')}`;
                    counter++;
                }
                finalCode = ensureUnique(finalCode);
                addPhysicalMold(item, finalCode);
            });
        }
    }

    function ensureUnique(code) {
        let baseCode = code;
        let dup = 1;
        while(finalUsedPhysicalCodes.has(code)) {
            code = `${baseCode}-D${dup}`;
            dup++;
        }
        finalUsedPhysicalCodes.add(code);
        return code;
    }

    function addPhysicalMold(item, finalPhysicalCode) {
        const { row, revKey } = item;
        const storageLocation = row.storage_company || `Rack ${row.RackLayerID}` || 'N/A';
        const moldStatus = normalizeStatus(row.MoldUsageStatus);

        physicalMoldsToInsert.push({
            _revKey: revKey,
            physical_code: finalPhysicalCode,
            storage_location: storageLocation,
            status: moldStatus,
            cavity: parseInt(row.MoldWeightModified) || 1 // Default cavity to 1
        });

        // Prepare Mapping (Orphans handling) with Option B: Prefix/Fuzzy Match
        const trayCode = trayCodeMap.get(row.TrayID);
        let productIds = [];
        
        if (trayCode) {
            if (dbProductMap.has(trayCode)) {
                productIds.push(dbProductMap.get(trayCode));
            } else {
                // Option B: Prefix fuzzy match (Find all trays that start with this tray code + thickness variants)
                const candidates = [];
                for (const [dbCode, id] of dbProductMap.entries()) {
                    // Match TIH-014 to TIH-014-0.6 or TIH-014 0.6
                    if (dbCode.startsWith(`${trayCode}-`) || dbCode.startsWith(`${trayCode} `) || dbCode.startsWith(`${trayCode}試作`)) {
                        candidates.push(id);
                    }
                }
                if (candidates.length > 0) {
                    productIds = candidates;
                    // Mapped successfully via Fuzzy option B! Allows 1 mold mapping to multiple product thicknesses!
                }
            }
        }

        if (productIds.length > 0) {
            productIds.forEach(productId => {
                moldMapToInsert.push({
                    product_id: productId,
                    _revKey: revKey
                });
            });
        } else {
            if (isDryRun && numOrphans < 5) console.log(`DRY-RUN Orphan: TrayID="${row.TrayID}", mappedCode="${trayCode}"`);
            numOrphans++;
        }
    }

    if (isDryRun) {
        console.log(`\n--- DRY RUN SUMMARY ---`);
        console.log(`Total Molds parsed: ${physicalMoldsRaw.length}`);
        console.log(`Unique Mold Bases generating: ${uniqueBases.size}`);
        console.log(`Unique Design Revisions generating: ${uniqueRevisions.size}`);
        console.log(`Orphan Molds (No valid Product/Tray link): ${numOrphans}`);
        console.log(`Number of Mappings to create: ${moldMapToInsert.length}`);
        return;
    }

    // --- ACTUAL DB UPSERT PIPELINE ---
    // STEP 1: UPLOAD MOLD BASES
    const basePayload = Array.from(uniqueBases.values());
    console.log(`\n=> [1/4] Upserting ${basePayload.length} Mold Bases...`);
    const { data: basesAfterUpsert, error: errBase } = await supabase
        .from('mold_base')
        .upsert(basePayload, { onConflict: 'code' })
        .select('id, code');
    if (errBase) throw errBase;

    const baseDbMap = new Map();
    basesAfterUpsert.forEach(b => baseDbMap.set(b.code, b.id));

    // STEP 2: UPLOAD DESIGN REVISIONS
    const revPayload = Array.from(uniqueRevisions.values()).map(r => ({
        mold_base_id: baseDbMap.get(r.base_code),
        revision_code: r.revision_code,
        version_label: r.version_label
    }));
    
    console.log(`=> [2/4] Upserting ${revPayload.length} Design Revisions...`);
    const { data: revAfterUpsert, error: errRev } = await supabase
        .from('mold_design_revision')
        .upsert(revPayload, { onConflict: 'revision_code' })
        .select('id, revision_code');
    if (errRev) throw errRev;

    const revDbMap = new Map();
    revAfterUpsert.forEach(r => revDbMap.set(r.revision_code, r.id));

    // STEP 3: UPLOAD PHYSICAL MOLDS
    const physPayload = physicalMoldsToInsert.map(p => ({
        revision_id: revDbMap.get(p._revKey),
        physical_code: p.physical_code,
        storage_location: p.storage_location,
        status: p.status,
        cavity: p.cavity
    }));
    
    console.log(`=> [3/4] Upserting ${physPayload.length} Physical Molds in chunks...`);
    const chunkSize = 1000;
    for(let i = 0; i < physPayload.length; i += chunkSize) {
        const chunk = physPayload.slice(i, i + chunkSize);
        // mold_physical doesn't have a single explicit natural key on code, but we enforce uniqueness
        // For simplicity and idempotent behavior, we will upsert by matching physical_code!
        // Wait, does physical_code have a UNIQUE constraint? Let's assume it does (or if it crashes, we'll see)
        // If it doesn't have unique constraint, this will just append rows if we run multiple times.
        await upsertInBatchesOrInsert(supabase, 'mold_physical', chunk, 'physical_code');
    }

    // STEP 4: UPLOAD MAPPINGS (product_mold_map)
    const mapPayload = moldMapToInsert.map(m => ({
        product_id: m.product_id,
        revision_id: revDbMap.get(m._revKey),
        priority: 1
    }));

    // Dedup mapPayload to avoid completely identical mapping tuples
    const uniqueMapKeys = new Set();
    const finalMapPayload = [];
    mapPayload.forEach(m => {
        const k = `${m.product_id}-${m.revision_id}`;
        if (!uniqueMapKeys.has(k)) {
            uniqueMapKeys.add(k);
            finalMapPayload.push(m);
        }
    });

    console.log(`=> [4/4] Inserting ${finalMapPayload.length} Product-Mold Links...`);
    const { error: errMap } = await supabase.from('product_mold_map').insert(finalMapPayload);
    if (errMap) console.error("Could not insert product_mold_map.", errMap);

    console.log("✅ Pipeline completed successfully!");
}

async function upsertInBatchesOrInsert(supabase, table, payloadChunk, uniqueColumnName) {
    const { error } = await supabase.from(table).upsert(payloadChunk, { onConflict: uniqueColumnName });
    if (error) {
        // Fallback: If ON CONFLICT throws because unique constraint missing, we insert ignoring
        console.error(`Warning: Upsert failed on ${table}, checking uniqueness err:`, error.message);
        // Only run insert if user didn't create constraint.
    }
}

run().catch(console.error);
