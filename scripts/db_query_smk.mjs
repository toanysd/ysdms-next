import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  console.log("Searching product_master for 'SMK-228' or 'B-Size 56p'...");

  const { data: productByCode, error: err1 } = await supabase
    .from("product_master")
    .select("*")
    .ilike("code", "%SMK-228%")
    .limit(5);
  
  if (err1) console.error("Error fetching by code:", err1);
  console.log("Products matching code '%SMK-228%':", productByCode);

  const { data: productByName, error: err2 } = await supabase
    .from("product_master")
    .select("*")
    .ilike("name", "%SMK-228%")
    .limit(5);

  if (err2) console.error("Error fetching by name:", err2);
  console.log("Products matching name '%SMK-228%':", productByName);

  const { data: productByBsize, error: err3 } = await supabase
    .from("product_master")
    .select("*")
    .ilike("name", "%B-Size 56p%")
    .limit(5);

  if (err3) console.error("Error fetching by name '%B-Size%':", err3);
  console.log("Products matching name '%B-Size 56p%':", productByBsize);

  // Check order items that might have the string SMK-228 in raw PN
  const { data: orders, error: err4 } = await supabase
    .from("order_items")
    .select("id, product_pn_raw, product_id, product_master(id, name, code)")
    .ilike("product_pn_raw", "%SMK-228%")
    .limit(5);

  if (err4) console.error("Error fetching orders:", err4);
  console.log("Orders with raw product '%SMK-228%':", JSON.stringify(orders, null, 2));
}

main();
