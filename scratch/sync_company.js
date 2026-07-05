const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function syncProducts() {
  console.log("Fetching mold_masters...");
  // Fetch all mold_masters. We need to handle pagination if > 1000
  let allMoldMasters = [];
  let from = 0;
  const size = 1000;
  while(true) {
    const { data, error } = await supabase.from('mold_masters').select('product_id, company_id').range(from, from + size - 1);
    if (error) {
      console.error(error);
      return;
    }
    allMoldMasters = allMoldMasters.concat(data);
    if (data.length < size) break;
    from += size;
  }
  
  console.log(`Fetched ${allMoldMasters.length} mold_masters.`);

  console.log("Fetching products...");
  let allProducts = [];
  from = 0;
  while(true) {
    const { data, error } = await supabase.from('products').select('product_id, company_id').range(from, from + size - 1);
    if (error) {
      console.error(error);
      return;
    }
    allProducts = allProducts.concat(data);
    if (data.length < size) break;
    from += size;
  }
  
  console.log(`Fetched ${allProducts.length} products.`);

  const pMap = new Map();
  allProducts.forEach(p => pMap.set(p.product_id, p.company_id));

  const updates = [];
  for (const m of allMoldMasters) {
    if (m.product_id && pMap.has(m.product_id) && pMap.get(m.product_id) !== m.company_id) {
      updates.push({ product_id: m.product_id, company_id: m.company_id });
    }
  }

  console.log(`Found ${updates.length} products to update.`);

  let successCount = 0;
  let batch = [];
  for (let i = 0; i < updates.length; i++) {
    batch.push(updates[i]);
    if (batch.length === 500 || i === updates.length - 1) {
      const { error } = await supabase.from('products').upsert(batch, { onConflict: 'product_id' });
      if (error) {
        console.error("Batch update error:", error);
      } else {
        successCount += batch.length;
        console.log(`Updated ${successCount} products...`);
      }
      batch = [];
    }
  }
  
  console.log(`Successfully updated ${successCount} products!`);
}

syncProducts();
