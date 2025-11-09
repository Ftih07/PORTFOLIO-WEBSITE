import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";

// ✅ Load variabel dari .env.local
dotenv.config({ path: ".env.local" });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // service key khusus server
);

async function createAdmin() {
  const { data, error } = await supabase.auth.admin.createUser({
    email: "kepo",
    password: "kepolah",
    email_confirm: true,
    user_metadata: { role: "admin" },
  });

  if (error) console.error("❌ Error creating admin:", error);
  else console.log("✅ Admin user created:", data);
}

createAdmin();
