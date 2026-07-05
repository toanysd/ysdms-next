const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const dotenv = require('dotenv');

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const sortMap = {
  'BACK_CAM': 10,
  'BACK_CNC': 20,
  'FRONT_CAM': 30,
  'FRONT_CNC': 40,
  'VACUUM_DRILL': 50,
  'POLISH': 60,
  'ULTRASONIC': 65,
  'PLUG_CAM': 70,
  'PLUG_CNC': 80,
  'PLUG_BASE': 90,
  'PLUG_FELT': 100,
  'FINISH': 110
};

async function updateSort() {
  for (const [code, order] of Object.entries(sortMap)) {
    const { error } = await supabase
      .from('standard_process_times')
      .update({ sort_order: order })
      .eq('process_code', code);
    
    if (error) {
      console.error(`Error updating ${code}:`, error);
    } else {
      console.log(`Updated ${code} -> ${order}`);
    }
  }
}

updateSort().then(() => console.log('Done'));
