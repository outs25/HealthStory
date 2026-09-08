import { supabase } from "../lib/supabaseClient";

export async function testSupabaseConnection() {
    if (!supabase || process.env.NODE_ENV === 'test') return;

    try {
        const { data, error } = await supabase
            .from("patients")
            .select("health_id, name")
            .limit(5);

        if (error) {
            console.warn("SUPABASE NOTICE:", error.message || error);
            return;
        }

        console.log("SUPABASE CONNECTED!", data);
    } catch (err) {
        console.warn("SUPABASE CONNECTION NOTICE:", err.message || err);
    }
}
