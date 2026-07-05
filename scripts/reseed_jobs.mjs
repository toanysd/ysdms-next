import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

const envContent = fs.readFileSync('.env.local', 'utf-8');
const envVars = Object.fromEntries(envContent.split('\n').filter(l=>l.includes('=')).map(l=>{const [k,...v]=l.split('=');return [k.trim(),v.join('=').trim()]}));
const supabase = createClient(envVars['NEXT_PUBLIC_SUPABASE_URL'], envVars['SUPABASE_SERVICE_ROLE_KEY']);

function parseCSV(filePath) {
  if(!fs.existsSync(filePath)) return [];
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n').filter(l => l.trim().length > 0);
  if (lines.length < 2) return [];
  const headers = lines[0].split(',').map(h => h.trim().replace(/^\uFEFF/, ''));
  const data = [];
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    let row = [];
    let cur = '';
    let inQuotes = false;
    for(let j = 0; j < line.length; j++) {
      if(line[j] === '"') {
        inQuotes = !inQuotes;
      } else if (line[j] === ',' && !inQuotes) {
        row.push(cur);
        cur = '';
      } else {
        cur += line[j];
      }
    }
    row.push(cur);
    let obj = {};
    headers.forEach((h, idx) => obj[h] = row[idx] ? row[idx].trim().replace(/^"|"$/g, '') : null);
    data.push(obj);
  }
  return data;
}

function hex12(numStr) {
  if (!numStr || numStr.toLowerCase() === 'nan') return '000000000000';
  const num = parseInt(numStr, 10);
  if (isNaN(num)) return '000000000000';
  return num.toString(16).padStart(12, '0');
}

function uuid(num, prefix) {
  return `00000000-${prefix}-0000-0000-${hex12(num)}`;
}

async function run() {
  console.log('Clearing old data...');
  await supabase.from('work_logs').delete().neq('log_id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('job_steps').delete().neq('step_id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('jobs').delete().neq('job_id', '00000000-0000-0000-0000-000000000000');
  
  console.log('Reading CSVs...');
  const jobsData = parseCSV('source_data/csv-access-data/jobs.csv');
  const deadlinesData = parseCSV('source_data/csv-access-data/processingdeadline.csv');
  const worklogsData = parseCSV('source_data/csv-access-data/worklog.csv');

  console.log(`Jobs: ${jobsData.length}, Deadlines: ${deadlinesData.length}, Logs: ${worklogsData.length}`);

  const empsData = parseCSV('source_data/csv-access-data/employees.csv');
  const { data: dbEmps } = await supabase.from('employees').select('employee_id, employee_code');
  const { data: pItems } = await supabase.from('processing_items').select('processing_item_id');
  const validPItemIds = new Set(pItems.map(p => p.processing_item_id));
  const { data: pStatus } = await supabase.from('processing_statuses').select('status_id');
  const validPStatusIds = new Set(pStatus.map(p => p.status_id));
  const { data: pCodes } = await supabase.from('processing_codes').select('processing_code_id');
  const validPCodeIds = new Set(pCodes.map(p => p.processing_code_id));
  const empMap = {};
  if(dbEmps && empsData.length) {
    dbEmps.forEach(e => {
      const accessEmp = empsData.find(x => x.EmployeeCode === e.employee_code);
      if(accessEmp) empMap[accessEmp.EmployeeID] = e.employee_id;
    });
  }

  const deadlineToJob = {};
  deadlinesData.forEach(d => {
    deadlineToJob[d.ProcessingDeadlineID] = d.JobID;
  });

  const jobCodes = new Set();
  const jobsToInsert = jobsData.filter(j => j.JobID && !isNaN(parseInt(j.JobID, 10))).map(j => {
    const pItemId = parseInt(j.ProcessingItemID, 10);
    const pItemVal = (isNaN(pItemId) || !validPItemIds.has(pItemId)) ? null : pItemId;

    let dl = null;
    if (j.DeliveryDeadline) {
      const d = new Date(j.DeliveryDeadline);
      if(!isNaN(d.valueOf())) dl = d.toISOString();
    }
    
    let baseCode = j.JobCode || `JOB-${j.JobID}`;
    let finalCode = baseCode;
    let counter = 1;
    while(jobCodes.has(finalCode)) {
      finalCode = `${baseCode}-${counter}`;
      counter++;
    }
    jobCodes.add(finalCode);

    return {
      job_id: uuid(j.JobID, '5555'),
      job_code: finalCode,
      job_name: j.JobName || `Unnamed Job ${j.JobID}`,
      processing_item_id: pItemVal,
      job_type_id: 'NEW_MOLD',
      mold_deadline: dl,
      created_at: new Date().toISOString()
    };
  });

  console.log('Inserting jobs...');
  for(let i=0; i<jobsToInsert.length; i+=100) {
    const chunk = jobsToInsert.slice(i, i+100);
    const { error } = await supabase.from('jobs').upsert(chunk);
    if(error) console.error('Job error chunk', i, error.message);
  }

  const validJobIds = new Set(jobsData.map(j => j.JobID));
  const validDeadlineIds = new Set(deadlinesData.filter(d => validJobIds.has(d.JobID)).map(d => d.ProcessingDeadlineID));

  const stepsToInsert = deadlinesData.filter(d => d.ProcessingDeadlineID && !isNaN(parseInt(d.ProcessingDeadlineID, 10))).map((d, index) => {
    let dl = null;
    if(d.ProcessingDeadline) {
      const dd = new Date(d.ProcessingDeadline);
      if(!isNaN(dd.valueOf())) dl = dd.toISOString();
    }
    
    let stepName = 'Hạng mục';
    const typeId = parseInt(d.ItemTypeID, 10);
    if(typeId===1) stepName='ALUMI';
    if(typeId===2) stepName='MOLD';
    if(typeId===3) stepName='PLUG';
    if(typeId===4) stepName='CUTTER';
    
    return {
      step_id: uuid(d.ProcessingDeadlineID, '6666'),
      job_id: uuid(d.JobID, '5555'),
      step_no: index + 1,
      item_type_id: isNaN(typeId) ? null : typeId,
      step_name: stepName,
      deadline: dl,
      estimated_hours: d.EstimatedHours ? parseFloat(d.EstimatedHours) : null,
      processing_status_id: (d.ProcessingStatusID && validPStatusIds.has(parseInt(d.ProcessingStatusID, 10))) ? parseInt(d.ProcessingStatusID, 10) : null,
      notes: d.ProcessingNotes || null,
      _valid: validJobIds.has(d.JobID)
    };
  }).filter(s => s._valid).map(s => { delete s._valid; return s; });

  console.log('Inserting job_steps (phases)...');
  for(let i=0; i<stepsToInsert.length; i+=100) {
    const chunk = stepsToInsert.slice(i, i+100);
    const { error } = await supabase.from('job_steps').upsert(chunk);
    if(error) console.error('Step error chunk', i, error.message);
  }

  const logsToInsertReal = worklogsData.filter(w => w.WorkLogID && !isNaN(parseInt(w.WorkLogID, 10))).map(w => {
    let wd = new Date();
    if(w.ProcessingDate) {
      const d = new Date(w.ProcessingDate);
      if(!isNaN(d.valueOf())) wd = d;
    }
    const dId = w.ProcessingDeadlineID;
    const jId = deadlineToJob[dId];
    const mappedEmp = empMap[w.EmployeeID] || (dbEmps && dbEmps.length > 0 ? dbEmps[0].employee_id : null);

    return {
      log_id: uuid(w.WorkLogID, '7777'),
      job_id: jId ? uuid(jId, '5555') : null,
      job_step_id: dId ? uuid(dId, '6666') : null,
      employee_id: mappedEmp,
      processing_code_id: (w.ProcessingCodeID && validPCodeIds.has(parseInt(w.ProcessingCodeID, 10))) ? parseInt(w.ProcessingCodeID, 10) : null,
      hours_spent: w.ProcessingTime ? parseFloat(w.ProcessingTime) : null,
      work_date: wd.toISOString(),
      notes: w.ProcessingNotes || null,
      _valid: validDeadlineIds.has(dId) && validJobIds.has(jId)
    };
  }).filter(l => l._valid).map(l => { delete l._valid; return l; });

  console.log('Inserting work_logs...');
  for(let i=0; i<logsToInsertReal.length; i+=100) {
    const chunk = logsToInsertReal.slice(i, i+100);
    const { error } = await supabase.from('work_logs').upsert(chunk);
    if(error) console.error('Log error chunk', i, error.message);
  }
  console.log('Done.');
}
run();
