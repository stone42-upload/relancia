import { getSupabaseAdmin } from "../../lib/supabaseAdmin";

const ALLOWED_FIELDS = {
  micro_entrepreneur: ["Oui", "Non"],
  factures_retard: ["Aucune", "1 a 3", "4 a 10", "Plus de 10"],
  pret_a_payer: ["Oui", "Peut-etre", "Non"],
};

function clean(s) { return String(s || "").replace(/[*_~`]/g, ""); }

async function notifyWhatsApp(payload) {
  const url = process.env.WHATSAPP_NOTIFY_URL;
  if (!url) return;
  const message = [
    "Nouvelle reponse RelanceIA",
    "Prenom: " + (clean(payload.prenom) || "(non renseigne)"),
    "Email: " + (clean(payload.email) || "(non renseigne)"),
    "Micro-entrepreneur: " + (clean(payload.micro_entrepreneur) || "?"),
    "Factures > 30j: " + (clean(payload.factures_retard) || "?"),
    "Pret a payer 9-19 EUR: " + (clean(payload.pret_a_payer) || "?"),
  ].join("\n");

  try {
    if (/callmebot\.com/i.test(url) || /api\.telegram\.org/i.test(url)) {
      const sep = url.includes("?") ? "&" : "?";
      const target = url + sep + "text=" + encodeURIComponent(message);
      await fetch(target, { method: "GET" });
      return;
    }
    await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ event: "new_response", message, payload }),
    });
  } catch (e) {
    console.error("WhatsApp notify failed:", e && e.message ? e.message : e);
  }
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  try {
    const body = req.body || {};
    const payload = {};

    for (const field of Object.keys(ALLOWED_FIELDS)) {
      if (body[field] === undefined) continue;
      if (!ALLOWED_FIELDS[field].includes(body[field])) return res.status(400).json({ error: "Valeur invalide pour " + field });
      payload[field] = body[field];
    }

    if (typeof body.prenom === "string" && body.prenom.trim()) {
      payload.prenom = body.prenom.trim().slice(0, 80);
    }
    if (typeof body.email === "string" && body.email.length <= 200) {
      if (body.email && /.+@.+\..+/.test(body.email)) payload.email = body.email.trim().toLowerCase();
    }

    if (Object.keys(payload).length === 0) return res.status(400).json({ error: "Aucune donnee valide" });

    payload.user_agent = (req.headers["user-agent"] || "").slice(0, 300);
    payload.referer = (req.headers["referer"] || "").slice(0, 300);

    const supabase = getSupabaseAdmin();
    const { error } = await supabase.from("responses").insert(payload);
    if (error) {
      console.error("Supabase insert error:", error);
      return res.status(500).json({ error: "Erreur d'enregistrement" });
    }

    notifyWhatsApp(payload).catch(() => {});
    return res.status(200).json({ ok: true });
  } catch (e) {
    console.error("submit error:", e);
    return res.status(500).json({ error: (e && e.message) || "Erreur serveur" });
  }
}
