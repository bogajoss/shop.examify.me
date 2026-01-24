import { supabaseAdmin } from "./src/lib/supabase-admin";

async function checkColumn() {
  const { data, error } = await supabaseAdmin
    .from("batches")
    .select("default_approval_message")
    .limit(1);

  if (error) {
    console.error("Error:", error.message);
  } else {
    console.log("Column exists!");
  }
}

checkColumn();
