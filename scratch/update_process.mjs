import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';

const env = fs.readFileSync('.env.local', 'utf8');
const getEnv = (key) => env.split('\n').find(l => l.startsWith(key))?.split('=')[1]?.trim()?.replace(/['"]/g, '');

const SUPABASE_URL = getEnv('NEXT_PUBLIC_SUPABASE_URL');
const SUPABASE_KEY = getEnv('SUPABASE_SERVICE_ROLE_KEY') || getEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY');

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function run() {
  console.log('Disabling unused...');
  await supabase.from('standard_process_times').update({ is_active: false }).in('process_code', ['ULTRASONIC', 'FINISH']);

  console.log('Updating BACK_CAM...');
  await supabase.from('standard_process_times').update({ process_name_ja: '裏面演算＆加工', process_name_vi: 'Lập trình và gia công mặt sau', machine_type_required: 'MANUAL', sort_order: 1 }).eq('process_code', 'BACK_CAM');

  console.log('Updating BACK_CNC...');
  await supabase.from('standard_process_times').update({ process_name_ja: '裏面機械加工', process_name_vi: 'Gia công máy mặt sau', machine_type_required: 'CNC_MOLD', sort_order: 2 }).eq('process_code', 'BACK_CNC');

  console.log('Updating FRONT_CAM...');
  await supabase.from('standard_process_times').update({ process_name_ja: '表面演算＆加工', process_name_vi: 'Lập trình và gia công mặt trước', machine_type_required: 'MANUAL', sort_order: 3 }).eq('process_code', 'FRONT_CAM');

  console.log('Updating FRONT_CNC...');
  await supabase.from('standard_process_times').update({ process_name_ja: '表面機械加工', process_name_vi: 'Gia công máy mặt trước', machine_type_required: 'CNC_MOLD', sort_order: 4 }).eq('process_code', 'FRONT_CNC');

  console.log('Updating VACUUM_DRILL...');
  await supabase.from('standard_process_times').update({ process_name_ja: '金型穴あけ', process_name_vi: 'Khoan lỗ hút chân không', sort_order: 5 }).eq('process_code', 'VACUUM_DRILL');

  console.log('Updating POLISH...');
  await supabase.from('standard_process_times').update({ process_name_ja: '金型ミガキ&仕上げ', process_name_vi: 'Đánh bóng và hoàn thiện khuôn', sort_order: 6 }).eq('process_code', 'POLISH');

  console.log('Updating PLUG_CAM...');
  await supabase.from('standard_process_times').update({ process_code: 'PLUG_CAM', process_name_ja: 'プラグ演算＆加工', process_name_vi: 'Lập trình và gia công Plug', machine_type_required: 'MANUAL', sort_order: 1 }).eq('process_code', 'PLUG_CNC');

  console.log('Inserting PLUG_CNC...');
  const { data } = await supabase.from('standard_process_times').select('id').eq('process_code', 'PLUG_CNC');
  if (!data || data.length === 0) {
    await supabase.from('standard_process_times').insert({
      process_code: 'PLUG_CNC',
      process_name_ja: 'プラグ機械加工',
      process_name_vi: 'Gia công máy Plug',
      default_hours: 2,
      default_hours_trial: 1,
      machine_type_required: 'CNC_PLUG',
      track: 'PLUG',
      sort_order: 2,
      is_active: true
    });
  } else {
    // If we renamed PLUG_CNC to PLUG_CAM above, there shouldn't be a PLUG_CNC unless it already inserted. 
  }

  console.log('Updating PLUG_BASE...');
  await supabase.from('standard_process_times').update({ process_name_ja: '台座製作＆プラグ穴あけ', process_name_vi: 'Chế tạo đế và khoan lỗ cho plug', sort_order: 3 }).eq('process_code', 'PLUG_BASE');

  console.log('Updating PLUG_FELT...');
  await supabase.from('standard_process_times').update({ process_name_ja: 'ネル貼り＆仕上げ', process_name_vi: 'Dán vải và hoàn thiện khuôn gỗ plug', sort_order: 4 }).eq('process_code', 'PLUG_FELT');

  console.log('Done.');
}
run();
