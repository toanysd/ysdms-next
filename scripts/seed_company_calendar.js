/**
 * seed_company_calendar.js — Nạp dữ liệu lịch làm việc 2025-2027 (kèm ngày lễ Nhật Bản & Obon)
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

// Fixed Japanese Holidays (Month is 1-indexed, Day)
const JAPAN_PUBLIC_HOLIDAYS = {
  // 2025
  '2025-01-01': '元日',
  '2025-01-02': '年始休業',
  '2025-01-03': '年始休業',
  '2025-01-13': '成人の日',
  '2025-02-11': '建国記念の日',
  '2025-02-23': '天皇誕生日',
  '2025-02-24': '振替休日',
  '2025-03-20': '春分の日',
  '2025-04-29': '昭和の日',
  '2025-05-03': '憲法記念日',
  '2025-05-04': 'みどりの日',
  '2025-05-05': 'こどもの日',
  '2025-05-06': '振替休日',
  '2025-07-21': '海の日',
  '2025-08-11': '山の日',
  '2025-08-13': 'お盆休み',
  '2025-08-14': 'お盆休み',
  '2025-08-15': 'お盆休み',
  '2025-08-16': 'お盆休み',
  '2025-09-15': '敬老の日',
  '2025-09-23': '秋分の日',
  '2025-10-13': 'スポーツの日',
  '2025-11-03': '文化の日',
  '2025-11-23': '勤労感謝の日',
  '2025-11-24': '振替休日',
  '2025-12-29': '年末休業',
  '2025-12-30': '年末休業',
  '2025-12-31': '年末休業',

  // 2026
  '2026-01-01': '元日',
  '2026-01-02': '年始休業',
  '2026-01-03': '年始休業',
  '2026-01-12': '成人の日',
  '2026-02-11': '建国記念の日',
  '2026-02-23': '天皇誕生日',
  '2026-03-20': '春分の日',
  '2026-04-29': '昭和の日',
  '2026-05-03': '憲法記念日',
  '2026-05-04': 'みどりの日',
  '2026-05-05': 'こどもの日',
  '2026-05-06': '振替休日',
  '2026-07-20': '海の日',
  '2026-08-11': '山の日',
  '2026-08-13': 'お盆休み',
  '2026-08-14': 'お盆休み',
  '2026-08-15': 'お盆休み',
  '2026-08-16': 'お盆休み',
  '2026-09-21': '敬老の日',
  '2026-09-22': '国民の休日',
  '2026-09-23': '秋分の日',
  '2026-10-12': 'スポーツの日',
  '2026-11-03': '文化の日',
  '2026-11-23': '勤労感謝の日',
  '2026-12-29': '年末休業',
  '2026-12-30': '年末休業',
  '2026-12-31': '年末休業',

  // 2027
  '2027-01-01': '元日',
  '2027-01-02': '年始休業',
  '2027-01-03': '年始休業',
  '2027-01-11': '成人の日',
  '2027-02-11': '建国記念の日',
  '2027-02-23': '天皇誕生日',
  '2027-03-21': '春分の日',
  '2027-03-22': '振替休日',
  '2027-04-29': '昭和の日',
  '2027-05-03': '憲法記念日',
  '2027-05-04': 'みどりの日',
  '2027-05-05': 'こどもの日',
  '2027-07-19': '海の日',
  '2027-08-11': '山の日',
  '2027-08-13': 'お盆休み',
  '2027-08-14': 'お盆休み',
  '2027-08-15': 'お盆休み',
  '2027-08-16': 'お盆休み',
  '2027-09-20': '敬老の日',
  '2027-09-23': '秋分の日',
  '2027-10-11': 'スポーツの日',
  '2027-11-03': '文化の日',
  '2027-11-23': '勤労感謝の日',
  '2027-12-29': '年末休業',
  '2027-12-30': '年末休業',
  '2027-12-31': '年末休業',
};

async function seed() {
  console.log('Generating company calendar records for 2025-2027...');

  const records = [];
  const startDate = new Date(Date.UTC(2025, 0, 1));
  const endDate = new Date(Date.UTC(2027, 11, 31));

  let curr = new Date(startDate);
  while (curr <= endDate) {
    const y = curr.getUTCFullYear();
    const m = String(curr.getUTCMonth() + 1).padStart(2, '0');
    const d = String(curr.getUTCDate()).padStart(2, '0');
    const dateStr = `${y}-${m}-${d}`;
    const dayOfWeek = curr.getUTCDay(); // 0 = Sun, 6 = Sat

    const holidayName = JAPAN_PUBLIC_HOLIDAYS[dateStr];
    let isWorking = true;
    let dayType = 'WORKDAY';
    let workingHours = 8.0;
    let notes = null;

    if (holidayName) {
      isWorking = false;
      dayType = holidayName.includes('休業') || holidayName.includes('お盆') ? 'COMPANY_OFF' : 'PUBLIC_HOLIDAY';
      workingHours = 0.0;
      notes = holidayName;
    } else if (dayOfWeek === 0) { // Sunday
      isWorking = false;
      dayType = 'HOLIDAY';
      workingHours = 0.0;
      notes = '日曜日';
    } else if (dayOfWeek === 6) { // Saturday
      isWorking = false;
      dayType = 'HOLIDAY';
      workingHours = 0.0;
      notes = '土曜日';
    }

    records.push({
      calendar_date: dateStr,
      day_type: dayType,
      is_working_day: isWorking,
      working_hours: workingHours,
      notes: notes,
    });

    curr.setUTCDate(curr.getUTCDate() + 1);
  }

  console.log(`Total days generated: ${records.length}`);
  const workdays = records.filter(r => r.is_working_day).length;
  const offdays = records.filter(r => !r.is_working_day).length;
  console.log(`  Working days: ${workdays} | Off days / Holidays: ${offdays}`);

  // Upsert to company_calendar in batches of 200
  console.log('Upserting to Supabase company_calendar...');
  for (let i = 0; i < records.length; i += 200) {
    const batch = records.slice(i, i + 200);
    const { error } = await supabase.from('company_calendar').upsert(batch, { onConflict: 'calendar_date' });
    if (error) {
      console.error(`Batch ${i} error:`, error.message);
      process.exit(1);
    }
  }

  console.log('✅ Successfully seeded company_calendar for 2025-2027!');
}

seed().catch(err => { console.error(err); process.exit(1); });
