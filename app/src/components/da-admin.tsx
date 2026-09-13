/* DayAxis - Admin dashboard: live analytics, approval queue, worker management. */
import { useEffect, useState } from "react";

import { useCtx } from "./da-ctx";
import { Avatar, Ic, Stars } from "./da-ui";

interface Stats {
  accounts: number; homes: number; tasks: number; workers: number; pending: number;
  reviews: number; feedback: number; feedback_avg: number; ads_clicks: number; active_subs: number;
  week: { d: string; n: number }[];
  recent_feedback?: { id: number; rating: number; text: string; at: string }[];
}

export default function Admin() {
  const { data, act, t, memberId, toast } = useCtx();
  const [stats, setStats] = useState<Stats | null>(null);
  const [tipTitle, setTipTitle] = useState("");
  const [tipBody, setTipBody] = useState("");
  const [tipCat, setTipCat] = useState("");
  const [editingTip, setEditingTip] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editBody, setEditBody] = useState("");

  useEffect(() => {
    void (async () => {
      const res = await act.adminStats();
      if (res.ok && res.data) setStats(res.data as unknown as Stats);
    })();
  }, [act]);

  if (data.account_role !== "admin") {
    return <div className="card mt3" style={{ textAlign: "center", padding: 30 }}><p className="muted">{t("admin_denied")}</p></div>;
  }

  const stat = (label: string, num: number | string, tone = "brand", icon = "spark") => (
    <div className="card stat" data-tone={tone} style={{ justifyContent: "center" }}>
      <span className="stat-ico"><Ic name={icon} size={17} /></span>
      <span className="stat-num tnum">{num}</span>
      <span className="stat-lbl">{label}</span>
    </div>
  );

  const approve = (id: number, ok: boolean) => void act.approveWorker(id, ok, memberId);
  const del = (id: number) => {
    if (window.confirm(t("sure_delete"))) void act.adminWorkerDelete(id);
  };

  return (
    <div>
      <h1 className="h-display">{t("nav_admin")}</h1>
      <p className="muted mt1" style={{ fontSize: 14.5 }}>{t("admin_analytics")}</p>

      <div className="grid mt3" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(128px, 1fr))" }}>
        {stat("Accounts", stats?.accounts ?? "…", "brand", "users")}
        {stat("Homes", stats?.homes ?? "…", "brand", "user")}
        {stat("Tasks", stats?.tasks ?? "…", "gold", "check")}
        {stat("Workers", stats?.workers ?? "…", "brand", "wrench")}
        {stat(t("pending_queue"), stats?.pending ?? "…", "accent", "alert")}
        {stat("Reviews", stats?.reviews ?? "…", "brand", "star")}
        {stat(t("feedback"), `${stats?.feedback_avg ?? "…"} ★ (${stats?.feedback ?? 0})`, "brand", "spark")}
        {stat(t("sponsor_stats"), stats?.ads_clicks ?? "…", "gold", "play")}
        {stat(t("plan_active"), stats?.active_subs ?? "…", "brand", "shield")}
      </div>

      <div className="card mt3">
        <h3 className="h-sec" style={{ fontSize: 15.5 }}>Completed tasks - last 7 days</h3>
        <div className="weekchart mt2">
          {(stats?.week ?? []).map((w) => (
            <div className="bar" key={w.d} title={`${w.d}: ${w.n}`}>
              <div className="fill full" style={{ height: `${Math.max(4, Math.min(100, w.n * 12))}%` }} />
              <span>{w.d.slice(5)}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="card mt3">
        <div className="row-b">
          <h3 className="h-sec" style={{ fontSize: 15.5 }}>{t("pending_queue")}</h3>
          <span className="tnum small muted">{data.pending_workers.length}</span>
        </div>
        {data.pending_workers.length === 0 ? <p className="muted small mt2">{t("empty")}</p> : null}
        <div className="mt2 scroll-block" style={{ display: "grid", gap: 8 }}>
          {data.pending_workers.map((pw) => (
            <div key={pw.id} className="row" style={{ borderTop: "1px solid var(--line)", paddingTop: 8 }}>
              <Avatar name={pw.name} color="#1E7A6B" size={36} src={pw.photo || undefined} />
              <span className="flex1" style={{ minWidth: 0 }}>
                <b style={{ fontSize: 14 }}>{pw.name}</b>
                <span className="small muted"> · {pw.trade} · {pw.location} · {pw.phone}</span>
                {pw.phone_verified !== 1 ? <span className="small" style={{ color: "var(--gold)" }}> · {t("phone_pending")}</span> : null}
              </span>
              <button className="btn btn-primary btn-sm" onClick={() => approve(pw.id, true)}><Ic name="check" size={13} /> {t("approve")}</button>
              <button className="btn btn-danger btn-sm" onClick={() => approve(pw.id, false)}>{t("reject")}</button>
              <button className="icon-btn" style={{ color: "var(--danger)", width: 32, height: 32 }} title={t("delete")} onClick={() => del(pw.id)}><Ic name="trash" size={15} /></button>
            </div>
          ))}
        </div>
      </div>

      <div className="card mt3">
        <h3 className="h-sec" style={{ fontSize: 15.5 }}>{t("admin_workers_ov")}</h3>
        <div className="mt2 scroll-block" style={{ display: "grid", gap: 8 }}>
          {data.workers.length === 0 ? <p className="muted small">{t("empty")}</p> : null}
          {data.workers.map((w) => (
            <div key={w.id} className="row" style={{ borderTop: "1px solid var(--line)", paddingTop: 8 }}>
              <Avatar name={w.name} color="#1E7A6B" size={32} src={w.photo || undefined} />
              <span className="flex1">{w.name} <span className="small muted">· {w.trade} · {w.location}</span></span>
              <span className="chip chip-tag" style={{ cursor: "default", color: "var(--ok)" }}>{w.review_count} ★</span>
              <button className="icon-btn" style={{ color: "var(--danger)", width: 32, height: 32 }} title={t("delete")} onClick={() => del(w.id)}><Ic name="trash" size={15} /></button>
            </div>
          ))}
        </div>
      </div>

      {/* Tips content manager (add / update / delete) */}
      <div className="card mt3">
        <h3 className="h-sec" style={{ fontSize: 15.5 }}>{t("tips_title")} (admin)</h3>
        <div className="mt2" style={{ display: "grid", gap: 8, maxWidth: 620 }}>
          <div className="row" style={{ flexWrap: "nowrap" }}>
            <input className="input flex1" placeholder={t("title")} value={tipTitle} onChange={(e) => setTipTitle(e.target.value)} />
            <input className="input" style={{ width: 130 }} placeholder={t("category")} value={tipCat} onChange={(e) => setTipCat(e.target.value)} />
            <button className="btn btn-primary btn-sm" onClick={async () => {
              if (!tipTitle.trim()) { toast(t("title"), "warn"); return; }
              const r = await act.addTip(tipTitle.trim(), tipBody.trim(), tipCat.trim() || "general");
              if (r.ok) { setTipTitle(""); setTipBody(""); setTipCat(""); toast(t("pref_changed")); }
              else toast(r.error || "error", "warn");
            }}><Ic name="plus" size={13} /> {t("ad_add")}</button>
          </div>
          <textarea className="textarea" placeholder={t("ad_tagline")} value={tipBody} onChange={(e) => setTipBody(e.target.value)} />
        </div>
        <div className="mt2 scroll-block" style={{ display: "grid", gap: 8 }}>
          {data.tips.map((tip) => (
            <div key={tip.id} className="row" style={{ borderTop: "1px solid var(--line)", paddingTop: 8 }}>
              {editingTip === tip.id ? (
                <>
                  <input className="input flex1" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} />
                  <input className="input" style={{ width: 200 }} value={editBody} onChange={(e) => setEditBody(e.target.value)} placeholder={t("ad_tagline")} />
                  <button className="btn btn-primary btn-sm" onClick={async () => {
                    if (!editTitle.trim()) { toast(t("title"), "warn"); return; }
                    const r = await act.updateTip(tip.id, editTitle.trim(), editBody.trim());
                    if (r.ok) setEditingTip(null);
                  }}><Ic name="check" size={13} /></button>
                  <button className="btn btn-ghost btn-sm" onClick={() => setEditingTip(null)}>{t("cancel")}</button>
                </>
              ) : (
                <>
                  <span className="flex1" style={{ minWidth: 0 }}>
                    <b style={{ fontSize: 13.5 }}>{tip.title}</b><span className="small muted"> · {tip.cat}</span>
                    {tip.body ? <p className="small muted">{tip.body}</p> : null}
                  </span>
                  <button className="icon-btn" style={{ width: 30, height: 30 }} title={t("edit")} onClick={() => { setEditingTip(tip.id); setEditTitle(tip.title); setEditBody(tip.body); }}><Ic name="user" size={14} /></button>
                  <button className="icon-btn" style={{ width: 30, height: 30, color: "var(--danger)" }} title={t("delete")} onClick={() => void act.deleteTip(tip.id)}><Ic name="trash" size={14} /></button>
                </>
              )}
            </div>
          ))}
          {data.tips.length === 0 ? <p className="muted small">{t("empty")}</p> : null}
        </div>
      </div>

      {/* Global feedback board */}
      <div className="card mt3">
        <h3 className="h-sec" style={{ fontSize: 15.5 }}>{t("feedback")}</h3>
        <div className="mt2 scroll-block" style={{ display: "grid", gap: 8 }}>
          {!stats?.recent_feedback || stats.recent_feedback.length === 0 ? <p className="muted small">{t("empty")}</p> : null}
          {(stats?.recent_feedback ?? []).map((f) => (
            <div key={f.id} className="row" style={{ borderTop: "1px solid var(--line)", paddingTop: 8 }}>
              <Stars value={f.rating} size={12} />
              <span className="flex1 small">{f.text || "-"}</span>
              <span className="small muted">{f.at?.slice(0, 10)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}