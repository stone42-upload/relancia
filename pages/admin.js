import { useEffect, useMemo, useState } from "react";
import Head from "next/head";

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(false);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  async function login(e) {
    e?.preventDefault();
    setErr("");
    setLoading(true);
    try {
      const res = await fetch("/api/responses", {
        headers: { "x-admin-password": password },
      });
      if (!res.ok) {
        if (res.status === 401) throw new Error("Mot de passe incorrect");
        throw new Error("Erreur " + res.status);
      }
      const j = await res.json();
      setData(j.data || []);
      setAuthed(true);
      sessionStorage.setItem("relancia_admin_pwd", password);
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const saved = sessionStorage.getItem("relancia_admin_pwd");
    if (saved) {
      setPassword(saved);
      // auto-login
      (async () => {
        try {
          const res = await fetch("/api/responses", {
            headers: { "x-admin-password": saved },
          });
          if (res.ok) {
            const j = await res.json();
            setData(j.data || []);
            setAuthed(true);
          } else {
            sessionStorage.removeItem("relancia_admin_pwd");
          }
        } catch {}
      })();
    }
  }, []);

  const stats = useMemo(() => {
    const total = data.length;
    const oui = data.filter((r) => r.pret_a_payer === "Oui").length;
    const peutetre = data.filter((r) => r.pret_a_payer === "Peut-être").length;
    const non = data.filter((r) => r.pret_a_payer === "Non").length;
    const withEmail = data.filter((r) => r.email).length;
    return { total, oui, peutetre, non, withEmail };
  }, [data]);

  function exportCSV() {
    if (!data.length) return;
    const cols = [
      "created_at", "factures_retard", "temps_relances", "pret_a_payer",
      "methode_actuelle", "email"
    ];
    const header = cols.join(",");
    const rows = data.map((r) =>
      cols.map((c) => {
        const v = r[c] == null ? "" : String(r[c]);
        return `"${v.replace(/"/g, '""')}"`;
      }).join(",")
    );
    const csv = [header, ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `relancia-responses-${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  if (!authed) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        <Head><title>Admin — RelanceIA</title></Head>
        <form onSubmit={login} className="bg-white border border-slate-200 rounded-2xl p-8 w-full max-w-sm shadow-sm">
          <h1 className="text-xl font-bold mb-1">Admin</h1>
          <p className="text-sm text-slate-500 mb-6">Accès au dashboard de validation</p>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Mot de passe"
            className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-brand-600 focus:outline-none mb-3"
            autoFocus
          />
          {err && <p className="text-sm text-red-600 mb-3">{err}</p>}
          <button
            disabled={loading || !password}
            className="w-full bg-brand-600 text-white py-3 rounded-xl font-semibold disabled:opacity-50 hover:bg-brand-700"
          >
            {loading ? "..." : "Entrer"}
          </button>
        </form>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 p-4 md:p-8">
      <Head><title>Admin — RelanceIA</title></Head>
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Validation Phase 0</h1>
          <div className="flex gap-2">
            <button onClick={exportCSV} className="px-4 py-2 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 text-sm">
              ⬇ Export CSV
            </button>
            <button
              onClick={() => { sessionStorage.removeItem("relancia_admin_pwd"); setAuthed(false); setPassword(""); }}
              className="px-4 py-2 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 text-sm"
            >
              Déconnexion
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
          <StatCard label="Réponses" value={stats.total} accent="bg-slate-50" />
          <StatCard label="Oui" value={stats.oui} accent="bg-green-50 text-green-700" />
          <StatCard label="Peut-être" value={stats.peutetre} accent="bg-amber-50 text-amber-700" />
          <StatCard label="Non" value={stats.non} accent="bg-red-50 text-red-700" />
          <StatCard label="Avec email" value={stats.withEmail} accent="bg-brand-50 text-brand-700" />
        </div>

        {/* Critère GO/NO-GO */}
        <div className={`mb-6 p-4 rounded-xl border ${stats.oui >= 3 ? "bg-green-50 border-green-200" : "bg-amber-50 border-amber-200"}`}>
          <div className="font-semibold">
            {stats.oui >= 3 ? "✅ GO — tu as au moins 3 'Oui' confirmés." : `⏳ Objectif : 3 'Oui' (tu en as ${stats.oui})`}
          </div>
          <div className="text-sm text-slate-600 mt-1">
            Phase 0 réussie si tu obtiens 8+ réponses qualifiées et 3+ "Oui" pour le pricing 9-19 €/mois.
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left">
              <tr>
                <th className="p-3">Date</th>
                <th className="p-3">Factures retard</th>
                <th className="p-3">Temps/mois</th>
                <th className="p-3">Prêt à payer</th>
                <th className="p-3">Méthode actuelle</th>
                <th className="p-3">Email</th>
              </tr>
            </thead>
            <tbody>
              {data.length === 0 && (
                <tr><td colSpan={6} className="p-8 text-center text-slate-500">Aucune réponse pour l'instant.</td></tr>
              )}
              {data.map((r) => (
                <tr key={r.id} className="border-t border-slate-100">
                  <td className="p-3 whitespace-nowrap text-xs text-slate-500">{new Date(r.created_at).toLocaleString("fr-FR")}</td>
                  <td className="p-3">{r.factures_retard || "—"}</td>
                  <td className="p-3">{r.temps_relances || "—"}</td>
                  <td className="p-3">
                    <Badge value={r.pret_a_payer} />
                  </td>
                  <td className="p-3 max-w-xs truncate" title={r.methode_actuelle}>{r.methode_actuelle || "—"}</td>
                  <td className="p-3">{r.email ? <a href={`mailto:${r.email}`} className="text-brand-600 hover:underline">{r.email}</a> : "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}

function StatCard({ label, value, accent }) {
  return (
    <div className={`rounded-xl p-4 border border-slate-200 ${accent}`}>
      <div className="text-xs uppercase tracking-wide opacity-70">{label}</div>
      <div className="text-2xl font-bold mt-1">{value}</div>
    </div>
  );
}

function Badge({ value }) {
  const map = {
    "Oui": "bg-green-100 text-green-700",
    "Peut-être": "bg-amber-100 text-amber-700",
    "Non": "bg-red-100 text-red-700",
  };
  if (!value) return <span className="text-slate-400">—</span>;
  return <span className={`px-2 py-0.5 rounded-full text-xs ${map[value] || "bg-slate-100"}`}>{value}</span>;
}
