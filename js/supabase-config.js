/**
 * Z Collective Pvt Ltd - Supabase Cloud Integration Config
 * Configured for Z Collective NewsAgency project.
 */

const SUPABASE_URL = "https://vggffkajvoyzbbhqzihw.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_vIkGo033SfJkOBfJyY0KJg_XITnkup0";

let isSupabaseEnabled = false;
let supabaseClient = null;

try {
    if (typeof supabase !== 'undefined' && SUPABASE_URL && SUPABASE_URL !== "YOUR_SUPABASE_URL") {
        supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        isSupabaseEnabled = true;
        console.log("✅ Supabase Cloud Database & Storage Initialized Successfully for Z Collective NewsAgency!");
    } else {
        console.log("ℹ️ Supabase credentials not set. Running in browser LocalStorage fallback mode.");
    }
} catch (e) {
    console.warn("⚠️ Supabase initialization notice:", e.message);
    isSupabaseEnabled = false;
}
