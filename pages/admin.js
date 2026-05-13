import { useEffect, useMemo, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import ThemeToggle, { Logo } from "../components/ThemeToggle";

const REFRESH_MS = 10000;

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(false);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [lastUpdate, setLastUpdate] = useState(null);
  const [view, setView] = useState("stats");

  async function fetchData(pwd) {
    const res = await fetch("/api/responses", { headers: { "x-admin-password": pwd } });
    if (!res.ok) { if (res.status === 401) throw new Error("Mot de passe incorrect"); throw new Error("Erreur " + res.status); }
    const j = await res.json(); return j.data || [];
  }

  async function login(e) {
    e?.preventDefault(); setErr(""); setLoading(true);
    try { const list = await fetchData(password); setData(list); setAuthed(true); setLastUpdate(new Date()); sessionStorage.setItem("relancia_admin_pwd", password); }
    catch (e) { setErr(e.message); } finally { setLoading(false); }
  }

  useEffect(() => {
    const saved = sessionStorage.getItem("relancia_admin_pwd");
    if (saved) { setPassword(saved); (async () => { try { const list = await fetchData(saved); setData(list); setAuthed(true); setLastUpdate(new Date()); } catch { sessionStorage.removeItem("relancia_admin_pwd"); } })(); }
  }, []);

  useEffect(() => {
    if (!authed) return;
    const id = setInterval(async () => { try { const list = await fetchData(password); setData(list); setLastUpdate(new Date()); } catch {} }, REFRESH_MS);
    return () => clearInterval(id);
  }, [authed, password]);

  const stats = useMemo(() => computeStats(data), [data]);

  if (!authed) {
    return (
      <Shell>
        <div className="max-w-sm mx-auto pt-24 px-4">
          <form onSubmit={login} className="bg-white/70 dark:bg-white/[0.03] border border-ink-900/5 dark:border-bone-100/10 rounded-3xl p-8 backdrop-blur-sm shadow-soft">
            <p className="text-xs uppercase tracking-wider text-ink-900/55 dark:text-bone-100/55 mb-3">Acces restreint</p>
            <h1 className="serif text-2xl text-ink-900 dark:text-bone-50 mb-6">Tableau de bord</h1>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Mot de passe" className="w-full px-4 py-3 rounded-xl border border-ink-900/10 dark:border-bone-100/10 bg-white/40 dark:bg-white/[0.02] focus:border-sage-400 focus:outline-none focus:ring-2 focus:ring-sage-400/30 mb-3" autoFocus />
            {err && <p className="text-sm text-red-600 dark:text-red-400 mb-3">{err}</p>}
            <button disabled={loading || !password} className="w-full h-11 rounded-full bg-sage-400/90 hover:bg-sage-500 text-ink-950 font-medium disabled:opacity-40 transition">{loading ? "Connexion..." : "Se connecter"}</button>
          </form>
        </div>
      </Shell>
    );
  }

  return (
    <Shell>
      <Head><title>Administration - RelanceIA</title></Head>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <div className="flex items-start md:items-center justify-between mb-8 flex-wrap gap-3">
          <div>
            <p className="text-xs uppercase tracking-wider text-ink-900/55 dark:text-bone-100/55 mb-1">Phase 0 - Validation</p>
            <h1 className="serif text-3xl md:text-4xl text-ink-900 dark:text-bone-50">Tableau de bord temps reel</h1>
            <p className="text-xs text-ink-900/55 dark:text-bone-100/55 mt-2">{lastUpdate ? "Derniere maj: " + lastUpdate.toLocaleTimeString("fr-FR") + " (auto " + (REFRESH_MS / 1000) + "s)" : "..."}</p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => exportCSV(data)} className="h-10 px-4 rounded-full bg-white/60 dark:bg-white/[0.03] border border-ink-900/10 dark:border-bone-100/10 hover:border-sage-400/60 text-sm">Export CSV</button>
            <button onClick={() => { sessionStorage.removeItem("relancia_admin_pwd"); setAuthed(false); setPassword(""); }} className="h-10 px-4 rounded-full bg-white/60 dark:bg-white/[0.03] border border-ink-900/10 dark:border-bone-100/10 hover:border-sage-400/60 text-sm">Deconnexion</button>
          </div>
        </div>

        <div className="inline-flex rounded-full border border-ink-900/10 dark:border-bone-100/10 p-1 bg-white/60 dark:bg-white/[0.03] mb-6">
          {[{ k: "stats", l: "Statistiques" }, { k: "liste", l: "Liste detaillee" }].map((t) => (
            <button key={t.k} onClick={() => setView(t.k)} className={"h-9 px-5 rounded-full text-sm font-medium transition " + (view === t.k ? "bg-sage-400 text-ink-950" : "text-ink-900/70 dark:text-bone-100/70 hover:bg-ink-900/5 dark:hover:bg-bone-100/5")}>{t.l}</button>
          ))}
        </div>

        {view === "stats" ? <StatsView stats={stats} data={data} /> : <ListView data={data} />}
      </div>
    </Shell>
  );
}

function computeStats(data) {
  const total = data.length;
  const withEmail = data.filter((r) => r.email).length;
  const meOui = data.filter((r) => r.micro_entrepreneur === "Oui").length;
  const oui = data.filter((r) => r.pret_a_payer === "Oui").length;
  const peutetre = data.filter((r) => r.pret_a_payer === "Peut-etre").length;
  const non = data.filter((r) => r.pret_a_payer === "Non").length;
  const conv = total > 0 ? Math.round((oui / total) * 100) : 0;
  const facturesBuckets = ["Aucune", "1 a 3", "4 a 10", "Plus de 10"];
  const facturesDist = facturesBuckets.map((k) => ({ key: k, value: data.filter((r) => r.factures_retard === k).length }));
  const now = new Date();
  const days = [];
  for (let i = 6; i >= 0; i--) { const d = new Date(now); d.setDate(d.getDate() - i); d.setHours(0,0,0,0); days.push({ date: d, count: 0 }); }
  data.forEach((r) => { const t = new Date(r.created_at); days.forEach((s) => { if (t.getFullYear() === s.date.getFullYear() && t.getMonth() === s.date.getMonth() && t.getDate() === s.date.getDate()) s.count++; }); });
  return { total, withEmail, meOui, oui, peutetre, non, conv, facturesDist, days };
}

function StatsView({ stats, data }) {
  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
        <Stat label="Reponses totales" value={stats.total} />
        <Stat label="Avec email" value={stats.withEmail} />
        <Stat label="Micro-entrepreneurs" value={stats.meOui} />
        <Stat label="Oui paierait" value={stats.oui} accent />
        <Stat label="Taux conversion" value={stats.conv + "%"} accent />
      </div>
      <div className={"mb-8 p-5 rounded-2xl border " + (stats.oui >= 3 ? "bg-sage-400/10 border-sage-400/40" : "bg-amber-500/10 border-amber-500/40")}>
        <p className={"text-xs uppercase tracking-wider mb-1 font-medium " + (stats.oui >= 3 ? "text-sage-700 dark:text-sage-300" : "text-amber-700 dark:text-amber-300")}>{stats.oui >= 3 ? "Critere valide" : "En cours"}</p>
        <p className="font-medium">{stats.oui >= 3 ? stats.oui + " repondants confirment l'interet. Tu peux lancer le build." : "Objectif: 3 'Oui' et 8 reponses (actuellement " + stats.oui + " oui, " + stats.total + " reponses)."}</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
        <Panel title="Reponses 7 derniers jours"><DailyBars days={stats.days} /></Panel>
        <Panel title="Factures impayees"><DistributionBars items={stats.facturesDist} total={stats.total} /></Panel>
      </div>
      <Panel title="Intention de paiement">
        <div className="grid grid-cols-3 gap-3">
          <PaymentBar label="Oui" value={stats.oui} total={stats.total} color="bg-sage-400" />
          <PaymentBar label="Peut-etre" value={stats.peutetre} total={stats.total} color="bg-amber-400" />
          <PaymentBar label="Non" value={stats.non} total={stats.total} color="bg-zinc-400" />
        </div>
      </Panel>
      <div className="mt-6"><Panel title="Dernieres reponses"><RecentList data={data.slice(0, 5)} /></Panel></div>
    </>
  );
}

function Stat({ label, value, accent }) {
  return (
    <div className="rounded-2xl border border-ink-900/5 dark:border-bone-100/10 bg-white/60 dark:bg-white/[0.03] p-4 backdrop-blur-sm">
      <div className="text-[10px] uppercase tracking-wider text-ink-900/55 dark:text-bone-100/55 mb-1">{label}</div>
      <div className={"serif text-3xl tabular-nums " + (accent ? "text-sage-600 dark:text-sage-300" : "text-ink-900 dark:text-bone-50")}>{value}</div>
    </div>
  );
}

function Panel({ title, children }) {
  return (
    <div className="rounded-2xl border border-ink-900/5 dark:border-bone-100/10 bg-white/60 dark:bg-white/[0.03] p-5 backdrop-blur-sm">
      <p className="text-xs uppercase tracking-wider text-ink-900/55 dark:text-bone-100/55 mb-4">{title}</p>
      {children}
    </div>
  );
}

function DailyBars({ days }) {
  const max = Math.max(1, ...days.map((d) => d.count));
  return (
    <div className="flex items-end gap-2 h-32">
      {days.map((d, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-1">
          <div className="text-[10px] tabular-nums text-ink-900/55 dark:text-bone-100/55">{d.count}</div>
          <div className="w-full bg-ink-900/5 dark:bg-bone-100/5 rounded-md overflow-hidden flex items-end" style={{ height: "85%" }}>
            <div className="w-full bg-sage-400/80 rounded-md" style={{ height: ((d.count / max) * 100) + "%" }} />
          </div>
          <div className="text-[10px] text-ink-900/55 dark:text-bone-100/55">{d.date.toLocaleDateString("fr-FR", { weekday: "short" }).slice(0, 3)}</div>
        </div>
      ))}
    </div>
  );
}

function DistributionBars({ items, total }) {
  return (
    <div className="space-y-3">
      {items.map((it) => {
        const pct = total > 0 ? Math.round((it.value / total) * 100) : 0;
        return (
          <div key={it.key}>
            <div className="flex justify-between text-xs mb-1">
              <span>{it.key}</span>
              <span className="text-ink-900/55 dark:text-bone-100/55 tabular-nums">{it.value} ({pct}%)</span>
            </div>
            <div className="h-2 bg-ink-900/5 dark:bg-bone-100/5 rounded-full overflow-hidden">
              <div className="h-full bg-sage-400" style={{ width: pct + "%" }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

function PaymentBar({ label, value, total, color }) {
  const pct = total > 0 ? Math.round((value / total) * 100) : 0;
  return (
    <div>
      <div className="flex justify-between text-xs mb-2">
        <span className="font-medium">{label}</span>
        <span className="text-ink-900/55 dark:text-bone-100/55 tabular-nums">{pct}%</span>
      </div>
      <div className="h-24 flex items-end bg-ink-900/5 dark:bg-bone-100/5 rounded-xl p-2">
        <div className={"w-full " + color + " rounded-md"} style={{ height: Math.max(4, pct) + "%" }} />
      </div>
      <div className="text-center text-xs mt-2 text-ink-900/55 dark:text-bone-100/55">{value} / {total}</div>
    </div>
  );
}

function RecentList({ data }) {
  if (data.length === 0) return <p className="text-sm text-ink-900/55 dark:text-bone-100/55">Pas encore de reponse.</p>;
  return (
    <div className="space-y-3">
      {data.map((r) => (
        <div key={r.id} className="flex items-start justify-between gap-3 py-2 border-b border-ink-900/5 dark:border-bone-100/5 last:border-0">
          <div className="min-w-0">
            <p className="text-sm font-medium truncate">{(r.prenom || "Anonyme") + " - " + (r.email || "pas d'email")}</p>
            <p className="text-xs text-ink-900/55 dark:text-bone-100/55 mt-0.5">ME: {r.micro_entrepreneur || "?"} - Factures: {r.factures_retard || "?"} - Paierait: {r.pret_a_payer || "?"}</p>
          </div>
          <span className="text-xs text-ink-900/55 dark:text-bone-100/55 whitespace-nowrap">{new Date(r.created_at).toLocaleString("fr-FR")}</span>
        </div>
      ))}
    </div>
  );
}

function ListView({ data }) {
  return (
    <div className="bg-white/60 dark:bg-white/[0.03] border border-ink-900/5 dark:border-bone-100/10 rounded-2xl overflow-hidden backdrop-blur-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-ink-900/5 dark:bg-bone-100/5 text-left">
            <tr><th className="p-3 font-medium">Date</th><th className="p-3 font-medium">Prenom</th><th className="p-3 font-medium">Email</th><th className="p-3 font-medium">ME</th><th className="p-3 font-medium">Factures</th><th className="p-3 font-medium">Paierait</th></tr>
          </thead>
          <tbody>
            {data.length === 0 && <tr><td colSpan={6} className="p-10 text-center text-ink-900/55 dark:text-bone-100/55">Aucune reponse.</td></tr>}
            {data.map((r) => (
              <tr key={r.id} className="border-t border-ink-900/5 dark:border-bone-100/5">
                <td className="p-3 text-xs text-ink-900/55 dark:text-bone-100/55 whitespace-nowrap">{new Date(r.created_at).toLocaleString("fr-FR")}</td>
                <td className="p-3">{r.prenom || "-"}</td>
                <td className="p-3">{r.email ? <a href={"mailto:" + r.email} className="text-sage-600 dark:text-sage-300 hover:underline underline-offset-4">{r.email}</a> : "-"}</td>
                <td className="p-3">{r.micro_entrepreneur || "-"}</td>
                <td className="p-3">{r.factures_retard || "-"}</td>
                <td className="p-3">{r.pret_a_payer || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function exportCSV(data) {
  if (!data.length) return;
  const cols = ["created_at", "prenom", "email", "micro_entrepreneur", "factures_retard", "pret_a_payer"];
  const csv = [cols.join(","), ...data.map((r) => cols.map((c) => '"' + String(r[c] == null ? "" : r[c]).replace(/"/g, '""') + '"').join(","))].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a"); a.href = url; a.download = "relancia-" + new Date().toISOString().slice(0, 10) + ".csv"; a.click();
  URL.revokeObjectURL(url);
}

function Shell({ children }) {
  return (
    <div className="min-h-screen bg-grad-light dark:bg-grad-dark text-ink-900 dark:text-bone-100">
      <header className="border-b border-ink-900/5 dark:border-bone-100/5">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
          <Link href="/"><Logo /></Link>
          <ThemeToggle />
        </div>
      </header>
      <main>{children}</main>
    </div>
  );
}
