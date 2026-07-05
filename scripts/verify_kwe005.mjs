import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function check() {
  const { count: c1 } = await supabase.from('cutter_master').select('*', { count: 'exact', head: true }).eq('code', 'CUT-KWE-005');
  console.log(`Cutter Master 'CUT-KWE-005' count: ${c1}`);

  const { data: rev } = await supabase.from('mold_design_revision').select('id').eq('revision_code', 'KWE-005-R1').single();
  const { data: prod } = await supabase.from('product_master').select('id').eq('code', 'KWE-005').single();

  if (rev && prod) {
    const { count: c2 } = await supabase.from('product_mold_map').select('*', { count: 'exact', head: true }).eq('product_id', prod.id).eq('revision_id', rev.id);
    console.log(`Product Mold Map count: ${c2}`);
  }

  const { data: phys } = await supabase.from('mold_physical').select('id, teflon_count, last_teflon_date').eq('physical_code', 'PHYS-KWE-005').single();
  console.log(`Mold Physical teflon_count: ${phys.teflon_count}, last_teflon_date: ${phys.last_teflon_date}`);

  const { count: c3 } = await supabase.from('mold_teflon_logs').select('*', { count: 'exact', head: true }).eq('mold_physical_id', phys?.id || '');
  console.log(`Mold Teflon Logs count: ${c3}`);
  
  const { count: c4 } = await supabase.from('mold_cutter_config').select('*', { count: 'exact', head: true }).eq('revision_id', rev?.id || '');
  console.log(`Mold Cutter Config count: ${c4}`);
  
  const { count: c5 } = await supabase.from('mold_plastic_bom').select('*', { count: 'exact', head: true }).eq('revision_id', rev?.id || '');
  console.log(`Mold Plastic BOM count: ${c5}`);
}

check().catch(console.error);
