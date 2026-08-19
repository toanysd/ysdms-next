/**
 * backfill_target_completion_date.js — Tính toán và điền target_completion_date cho tất cả các Job hiện có
 */

const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '..', '.env.local');
const env = {};
fs.readFileSync(envPath, 'utf8').split('\n').forEach(line => {
  const m = line.match(/^([^=]+)=(.*)$/);
  if (m) env[m[1].trim()] = m[2].trim().replace(/^['"]|['"]$/g, '');
});

const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY || env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

function subtractWorkingDays(baseDateStr, daysToSubtract, calendarMap) {
  if (!baseDateStr || daysToSubtract <= 0) return baseDateStr;
  const [y, m, d] = baseDateStr.slice(0, 10).split('-').map(Number);
  let curr = new Date(Date.UTC(y, m - 1, d));
  let remaining = daysToSubtract;

  while (remaining > 0) {
    curr.setUTCDate(curr.getUTCDate() - 1);
    const dateStr = curr.toISOString().slice(0, 10);
    const dayOfWeek = curr.getUTCDay();
    const isWorkday = calendarMap.has(dateStr) ? calendarMap.get(dateStr) : (dayOfWeek !== 0 && dayOfWeek !== 6);
    if (isWorkday) remaining--;
  }
  return curr.toISOString().slice(0, 10);
}

function calculateTargetCompletionDate(shipDate, moldDeadline, manualOverride, calendarMap) {
  if (manualOverride) return manualOverride.slice(0, 10);
  const cleanShip = shipDate ? shipDate.slice(0, 10) : null;
  const cleanMold = moldDeadline ? moldDeadline.slice(0, 10) : null;

  let targetFromShip = null;
  let targetFromMold = null;

  if (cleanShip) targetFromShip = subtractWorkingDays(cleanShip, 3, calendarMap);
  if (cleanMold) targetFromMold = subtractWorkingDays(cleanMold, 1, calendarMap);

  if (targetFromShip && targetFromMold) {
    return targetFromShip < targetFromMold ? targetFromShip : targetFromMold;
  }
  return targetFromShip || targetFromMold || null;
}

async function backfill() {
  console.log('Loading company calendar from DB...');
  let allCal = [], from = 0;
  while (true) {
    const { data } = await supabase.from('company_calendar').select('calendar_date, is_working_day').range(from, from + 999);
    if (!data || data.length === 0) break;
    allCal = allCal.concat(data);
    if (data.length < 1000) break;
    from += 1000;
  }

  const calendarMap = new Map();
  allCal.forEach(c => calendarMap.set(c.calendar_date, c.is_working_day));
  console.log(`Loaded ${calendarMap.size} calendar days.`);

  console.log('Fetching all jobs from DB...');
  let allJobs = [], jFrom = 0;
  while (true) {
    const { data } = await supabase.from('jobs').select('job_id, job_code, job_name, ship_date, mold_deadline, deadline, target_completion_date').range(jFrom, jFrom + 999);
    if (!data || data.length === 0) break;
    allJobs = allJobs.concat(data);
    if (data.length < 1000) break;
    jFrom += 1000;
  }
  console.log(`Loaded ${allJobs.length} jobs.`);

  const updates = [];
  for (const j of allJobs) {
    const target = calculateTargetCompletionDate(j.ship_date, j.mold_deadline || j.deadline, null, calendarMap);
    if (target) {
      updates.push({
        job_id: j.job_id,
        target_completion_date: target,
        job_code: j.job_code,
        ship_date: j.ship_date ? j.ship_date.slice(0, 10) : null,
        mold_deadline: j.mold_deadline ? j.mold_deadline.slice(0, 10) : null
      });
    }
  }

  console.log(`Jobs with calculated target_completion_date: ${updates.length}`);
  console.log('\nSample calculations:');
  updates.slice(0, 15).forEach(u => {
    console.log(`  Job: ${u.job_code} | ShipDate: ${u.ship_date || '—'} | MoldDeadline: ${u.mold_deadline || '—'} ➔ Target: ${u.target_completion_date}`);
  });

  console.log('\nUpdating jobs in Supabase...');
  for (let i = 0; i < updates.length; i += 50) {
    const batch = updates.slice(i, i + 50);
    for (const item of batch) {
      await supabase.from('jobs').update({ target_completion_date: item.target_completion_date }).eq('job_id', item.job_id);
    }
    process.stdout.write(`\rProgress: ${Math.min(i + 50, updates.length)} / ${updates.length}`);
  }
  console.log('\n✅ Backfill completed successfully!');
}

backfill().catch(err => { console.error(err); process.exit(1); });
