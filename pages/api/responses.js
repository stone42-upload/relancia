import { getSupabaseAdmin } from "../../lib/supabaseAdmin";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const pwd = req.headers["x-admin-password"];
  if (!pwd || pwd !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("responses")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      console.error("Supabase select error:", error);
      return res.status(500).json({ error: "Erreur de lecture" });
    }
    return res.status(200).json({ data: data || [] });
  } catch (e) {
    console.error("responses error:", e);
    return res.status(500).json({ error: e.message || "Erreur serveur" });
  }
}
