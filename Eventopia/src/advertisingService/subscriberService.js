import { supabase } from "../Client.js";

export async function fetchSubscribers() {
  const { data, error } = await supabase.from("subscribers").select("email");

  if (error) {
    console.error("❌ Error fetching subscribers:", error);
    return [];
  }

  return data.map((row) => row.email);
}