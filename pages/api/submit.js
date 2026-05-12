import { getSupabaseAdmin } from "../../lib/supabaseAdmin";

const ALLOWED_FIELDS = {
  factures_retard: ["0", "1-3", "4-10", "10+"],
  temps_relances: ["Moins de 2h", "2-5h", "5-10h", "Plus de 10h"],
  pret_a_payer: ["Oui", "Peut-être", "Non"],
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const body = req.body || {};

    // Whitelist + validation
    const payload = {};
    for (const [field, allowed] of Object.entries(ALLOWED_FIELDS)) {
      if (body[field] === undefined) continue;
      if (!allowed.includes(body[field])) {
        return res.status(400).json({ error: `Valeur invalide pour ${field}` });
      }
      payload[field] = body[field];
    }

    // Champs texte libres avec longueur max
    if (typeof body.methode_actuelle === "string") {
      payload.methode_actuelle = body.methode_actuelle.slice(0, 2000);
    }
    if (typeof body.email === "string" && body.email.length <= 200) {
      // Validation simple : présence de @ et .
      if (body.email && /.+@.+\..+/.test(body.email)) {
        payload.email = body.email.trim().toLowerCase();
      }
    }

    if (Object.keys(payload).length === 0) {
      return res.status(400).json({ error: "Aucune donnée valide" });
    }

    // Métadonnées non-identifiantes
    payload.user_agent = (req.headers["user-agent"] || "").slice(0, 300);
    payload.referer = (req.headers["referer"] || "").slice(0, 300);

    const supabase = getSupabaseAdmin();
    const { error } = await supabase.from("responses").insert(payload);
    if (error) {
      console.error("Supabase insert error:", error);
      return res.status(500).json({ error: "Erreur d'enregistrement" });
    }

    return res.status(200).json({ ok: true });
  } catch (e) {
    console.error("submit error:", e);
    return res.status(500).json({ error: e.message || "Erreur serveur" });
  }
}
