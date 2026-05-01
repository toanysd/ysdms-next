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
  console.log("Fixing mock data for SMK-227 and SMK-228 based on excel...");

  const { error: err1 } = await supabase
    .from("product_master")
    .update({ name: "365x245 サイズ 30個入", remarks: "PP ナチュラル 0.6mm" })
    .eq("id", "11111111-1111-1111-1111-111111111102");
  
  if (err1) {
      console.error("Error updating SMK-227:", err1);
  } else {
      console.log("✅ Updated SMK-227");
  }

  const { error: err2 } = await supabase
    .from("product_master")
    .update({ name: "365x245 サイズ 30個入", remarks: "PP ナチュラル 0.6mm" })
    .eq("id", "11111111-1111-1111-1111-111111111103");

  if (err2) {
      console.error("Error updating SMK-228:", err2);
  } else {
      console.log("✅ Updated SMK-228");
  }
}

main();
