import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

// Load environment variables dynamically from .env.local without hardcoding secrets
let supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
let supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if ((!supabaseUrl || !supabaseKey) && fs.existsSync('.env.local')) {
  const envContent = fs.readFileSync('.env.local', 'utf8');
  const envMap = {};
  envContent.split('\n').forEach((line) => {
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match) envMap[match[1].trim()] = match[2].trim().replace(/^"|"$/g, '');
  });
  supabaseUrl = supabaseUrl || envMap['NEXT_PUBLIC_SUPABASE_URL'];
  supabaseKey = supabaseKey || envMap['SUPABASE_SERVICE_ROLE_KEY'] || envMap['NEXT_PUBLIC_SUPABASE_ANON_KEY'];
}

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase URL or Key in environment or .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function seedTraySchedules() {
  console.log('🚀 Bắt đầu seed lịch dập khay (Tray Production Schedules)...');

  // 1. Kiểm tra nếu đã có dữ liệu trong production_schedules
  const { count: existingCount } = await supabase
    .from('production_schedules')
    .select('*', { count: 'exact', head: true });

  if (existingCount && existingCount >= 25) {
    console.log(`ℹ️ production_schedules đã có ${existingCount} bản ghi. Không cần seed lại.`);
    return;
  }

  // 2. Fetch danh sách machines, work_orders, products, rolls, employees
  const [
    { data: machines },
    { data: wos },
    { data: prods },
    { data: rolls },
    { data: emps }
  ] = await Promise.all([
    supabase.from('machines').select('machine_id, machine_code, machine_name').eq('is_active', true).order('machine_code'),
    supabase.from('work_orders').select('wo_id, wo_code, wo_name, product_id').limit(30),
    supabase.from('products').select('product_id, product_code, product_name').limit(30),
    supabase.from('plastic_receipt_roll').select('id, roll_barcode, plastic_id').in('status', ['in_stock', 'in_use']).limit(30),
    supabase.from('employees').select('employee_id, employee_name, employee_name_short').limit(10)
  ]);

  if (!machines || machines.length === 0) {
    throw new Error('Không tìm thấy máy trong bảng machines!');
  }

  const baseDate = new Date('2026-09-04T00:00:00Z');
  const schedulesToInsert = [];

  // Tạo 30 lịch dập phân bổ trên 14 máy trong 14 ngày tới
  for (let i = 0; i < 30; i++) {
    const machine = machines[i % machines.length];
    const wo = wos && wos[i] ? wos[i] : null;
    const prod = prods && prods[i % prods.length] ? prods[i % prods.length] : null;
    const roll = rolls && rolls[i % rolls.length] ? rolls[i % rolls.length] : null;
    const emp = emps && emps[i % emps.length] ? emps[i % emps.length] : null;

    // Phân bổ ngày: từ day 0 đến day 13
    const dayOffset = Math.floor(i / 2.2); // ~2-3 ca mỗi ngày
    const targetDate = new Date(baseDate);
    targetDate.setUTCDate(baseDate.getUTCDate() + dayOffset);
    const dateStr = targetDate.toISOString().split('T')[0];

    // Shift: Xen kẽ DAY và NIGHT
    const isDay = i % 2 === 0;
    const shift = isDay ? 'DAY' : 'NIGHT';

    const startTime = new Date(targetDate);
    startTime.setUTCHours(isDay ? 8 : 20, 0, 0, 0);

    const endTime = new Date(startTime);
    endTime.setUTCHours(startTime.getUTCHours() + 8, 0, 0, 0);

    // Status: Một số ca hôm nay hoặc quá khứ là IN_PROGRESS / DONE, còn lại PLANNED
    let status = 'PLANNED';
    let actualQty = 0;
    if (dayOffset === 0) {
      status = isDay ? 'IN_PROGRESS' : 'PLANNED';
      actualQty = isDay ? 2400 : 0;
    } else if (dayOffset < 0) {
      status = 'DONE';
      actualQty = 5000;
    }

    const plannedQty = [3000, 5000, 8000, 10000, 12000][i % 5];

    schedulesToInsert.push({
      machine_id: machine.machine_id,
      schedule_date: dateStr,
      scheduled_start: startTime.toISOString(),
      scheduled_end: endTime.toISOString(),
      shift,
      status,
      planned_quantity: plannedQty,
      actual_quantity: actualQty,
      product_id: wo?.product_id || prod?.product_id || null,
      work_order_id: wo?.wo_id || null,
      roll_id: roll?.id || null,
      operator_id: emp?.employee_id || null,
      notes: `M13 Seed — ${machine.machine_name} ${shift} ca dập khay ${prod?.product_code || ''}`
    });
  }

  console.log(`Đang insert ${schedulesToInsert.length} bản ghi lịch dập...`);
  const { data, error } = await supabase.from('production_schedules').insert(schedulesToInsert).select('schedule_id');

  if (error) {
    console.error('Lỗi khi seed production_schedules:', error);
    throw error;
  }

  console.log(`✅ Seed thành công ${data.length} bản ghi production_schedules!`);
}

seedTraySchedules().catch(console.error);
