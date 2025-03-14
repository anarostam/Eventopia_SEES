import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://fkbflmyfughlgxnzuazy.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZrYmZsbXlmdWdobGd4bnp1YXp5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzkyOTk0MTQsImV4cCI6MjA1NDg3NTQxNH0.GQCJ-XBiyZAD2tVXVwY_RWFaF6dHejPGKW5jy6p0deA";

export const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
        persistSession: true,
        detectSessionInUrl: true,
    },
});