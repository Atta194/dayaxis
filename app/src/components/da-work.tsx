/* DayAxis - Work view: worker marketplace (find/contact) + my worker profile. */
import { useMemo, useState } from "react";

import { TRADES } from "../lib/da-content";
import { memberName, useCtx } from "./da-ctx";
import { Avatar, Ic, Modal, Stars } from "./da-ui";
import type { Worker } from "../lib/da-types";

export default function Work() {
  const { data, act, t, toast, memberId } = useCtx();
  const [tab, setTab] = useState<"find" | "mine">("find");
  const [q, setQ] = useState("");
  const [sort, setSort] = useState<"best" | "exp" | "jobs">("best");
  const [mode, setMode] = useState<"grid" | "list">("grid");

  const my = data.my_workers[0] ?? null;

  const workers = useMemo(() => {
    let w = data.workers.filter((x) => {
      const s = `${x.name} ${x.trade} ${x.location}`.toLowerCase();
      return s.includes(q.toLowerCase());
    });
    if (sort === "best") w = [...w].sort((a, b) => (b.rating + b.review_count / 5) - (a.rating + a.review_count / 5));
    if (sort === "exp") w = [...w].sort((a, b) => b.experience_years - a.experience_years);
    if (sort === "jobs") w = [...w].sort((a, b) => b.jobs_done - a.jobs_done);
    return w;
  }, [data.workers, q, sort]);

  return (
    <div>
      <div className="row-b">
        <div>
          <h1 className="h-display">{t("nav_work")}</h1>
          <p className="muted mt1" style={{ fontSize: 14.5 }}>{t("work_note")}</p>
        </div>
        <div className="row">
          <div className="row">
            <button className="chip" aria-pressed={tab === "find"} onClick={() => setTab("find")}>{t("find_worker")}</button>
            <button className="chip" aria-pressed={tab === "mine"} onClick={() => setTab("mine")}>{t("my_profile")}</button>
          </div>
        </div>
      </div>

      {tab === "find" ? (
        <>
          <div className="card card-soft mt3">
            <div className="row">
              <Ic name="search" />
              <input className="input flex1" placeholder={t("search_worker")} value={q} onChange={(e) => setQ(e.target.value)} />
              <div className="row">
                {(["best", "exp", "jobs"] as const).map((s) => (
                  <button key={s} className="chip" aria-pressed={sort === s} onClick={() => setSort(s)}>
                    {s === "best" ? t("sort_best") : s === "exp" ? t("sort_experienced") : t("sort_jobs")}
                  </button>
                ))}
                <button className="icon-btn" onClick={() => setMode(mode === "grid" ? "list" : "grid")} title="view">
                  <Ic name={mode === "grid" ? "file" : "users"} />
                </button>
              </div>
            </div>
          </div>
          <div className={`grid mt3${mode === "grid" ? " g3" : ""}`} style={mode === "list" ? { gap: 10 } : undefined}>
            {workers.map((w) => <WorkerCard key={w.id} w={w} />)}
          </div>
          {workers.length === 0 ? (
            <div className="card mt3" style={{ textAlign: "center", padding: 30 }}><p className="muted">{t("none_match")}</p></div>
          ) : null}
        </>
      ) : (
        <MyProfile worker={my} by={memberName(data, memberId)} />
      )}
    </div>
  );
}

function WorkerCard({ w }: { w: Worker }) {
  const { data, act, t, toast, memberId } = useCtx();
  const [showReviews, setShowReviews] = useState(false);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [rtext, setRtext] = useState("");

  const reviews = data.reviews.filter((r) => r.worker_id === w.id);
  const statusColor = w.status === "available" ? "var(--ok)" : w.status === "busy" ? "var(--gold)" : "var(--ink3)";

  return (
    <div className="worker" style={{ flexDirection: "column" }}>
      <div className="row" style={{ alignItems: "flex-start", flexWrap: "nowrap" }}>
        <Avatar name={w.name} color={`hsl(${(w.id * 47) % 360}, 42%, 52%)`} size={50} />
        <div className="flex1">
          <div className="row" style={{ gap: 6 }}>
            <b style={{ fontSize: 15.5 }}>{w.name}</b>
            <span className="chip chip-tag" style={{ cursor: "default", padding: "1px 8px", fontSize: 11 }}>{w.trade}</span>
          </div>
          <div className="small muted mt1" style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
            <span style={{ display: "inline-flex", gap: 4, alignItems: "center" }}><Ic name="map" size={13} /> {w.location || "-"}</span>
            <span>{w.experience_years} yrs</span>
            <span>{w.jobs_done} jobs</span>
            {w.rate ? <b style={{ color: "var(--brand)" }}>{w.rate}</b> : null}
          </div>
          <div className="mt1">
            <Stars value={w.rating} size={14} />
            <span className="stars-num"> {w.rating} ({w.review_count})</span>
          </div>
        </div>
        <span className="chip chip-tag" style={{ cursor: "default", color: statusColor }}>
          <span className="dot" style={{ background: statusColor, margin: 0 }} />{w.status} · {w.availability}
        </span>
      </div>
      {w.bio ? <p className="small muted">{w.bio}</p> : null}
      <div className="row">
        {w.phone ? <a className="btn btn-sm" href={`tel:${w.phone.replace(/[^+\d]/g, "")}`}><Ic name="phone" /> {t("direct_call")}</a> : null}
        {w.email ? <a className="btn btn-sm" href={`mailto:${w.email}?subject=${encodeURIComponent("DayAxis: quick chat")}`}><Ic name="mail" /> {t("quick_chat")}</a> : null}
        {w.video_url ? <a className="btn btn-sm" href={w.video_url} target="_blank" rel="noreferrer"><Ic name="play" /> {t("video_proof")}</a> : null}
        <button className="btn btn-ghost btn-sm" onClick={() => setShowReviews((s) => !s)}>{t("reviews")} ({reviews.length})</button>
        <button className="btn btn-primary btn-sm" onClick={() => setReviewOpen(true)}><Ic name="star" size={14} /> {t("review_post")}</button>
      </div>
      {showReviews ? (
        <div className="mt2" style={{ display: "grid", gap: 8 }}>
          {reviews.length === 0 ? <p className="small muted">{t("no_reviews")}</p> : null}
          {reviews.map((r) => (
            <div key={r.id} style={{ borderTop: "1px solid var(--line)", paddingTop: 8 }}>
              <div className="row"><Stars value={r.rating} size={12} /><b className="small">{r.by_name}</b><span className="small muted">{r.at?.slice(0, 10)}</span></div>
              <p className="small mt1">{r.text}</p>
            </div>
          ))}
        </div>
      ) : null}
      {reviewOpen ? (
        <Modal onClose={() => setReviewOpen(false)} title={w.name}>
          <div className="field"><label>{t("your_rating")}</label><Stars value={rating} onChange={setRating} size={22} /></div>
          <div className="field mt2"><label>{t("add_task")}</label>
            <textarea className="textarea" value={rtext} onChange={(e) => setRtext(e.target.value)} />
          </div>
          <div className="row mt3" style={{ justifyContent: "flex-end" }}>
            <button className="btn" onClick={() => setReviewOpen(false)}>{t("cancel")}</button>
            <button className="btn btn-primary" onClick={async () => {
              await act.addReview(w.id, rating, rtext, memberName(data, memberId));
              setReviewOpen(false); setRtext(""); toast(t("thanks_feedback"));
            }}><Ic name="check" /> {t("review_post")}</button>
          </div>
        </Modal>
      ) : null}
    </div>
  );
}

function MyProfile({ worker, by }: { worker: Worker | null; by: string }) {
  const { data, act, t, toast } = useCtx();
  const blank = {
    name: "", trade: TRADES[0], location: "", phone: "", email: "", experience_years: 1,
    bio: "", video_url: "", rate: "", status: "available", availability: "now",
  };
  const [f, setF] = useState(worker ? { ...worker } : blank);
  const [confirmDel, setConfirmDel] = useState(false);
  const reviews = worker ? data.reviews.filter((r) => r.worker_id === worker.id) : [];

  const set = (k: string, v: string | number) => setF((p) => ({ ...p, [k]: v }));

  const save = async () => {
    if (!f.name.trim()) { toast(t("full_name"), "warn"); return; }
    await act.saveWorker(worker ? { ...f, id: worker.id } : { ...f, owner_home: undefined });
    toast(t("saved"));
  };

  if (!worker) {
    return (
      <div className="card mt3" style={{ maxWidth: 720 }}>
        <h3 className="h-sec">{t("register_worker")}</h3>
        <p className="muted small mt1">{t("logged_as")}: <b>{by}</b></p>
        <WorkerForm f={f} set={set} t={t} save={save} isNew />
      </div>
    );
  }

  return (
    <div className="mt3" style={{ display: "grid", gap: 14 }}>
      <div className="card">
        <div className="row-b">
          <h3 className="h-sec">{t("edit_profile")}</h3>
          <button className="btn btn-danger btn-sm" onClick={() => setConfirmDel(true)}><Ic name="trash" /> {t("delete_profile")}</button>
        </div>
        <WorkerForm f={f} set={set} t={t} save={save} />
        <div className="row mt2">
          <span className="chip">{t("your_work_status")}: <b>{worker.status}</b></span>
          {(["available", "busy", "offline"] as const).map((s) => (
            <button key={s} className="chip" aria-pressed={f.status === s} onClick={() => { set("status", s); void act.setWorkerStatus(worker.id, s, f.availability); toast(t("pref_changed")); }}>
              {s}
            </button>
          ))}
        </div>
      </div>
      <div className="card">
        <h3 className="h-sec" style={{ fontSize: 15.5 }}>{t("your_reviews")} ({reviews.length})</h3>
        <div className="mt2" style={{ display: "grid", gap: 8 }}>
          {reviews.length === 0 ? <p className="muted small">{t("no_reviews")}</p> : null}
          {reviews.map((r) => (
            <div key={r.id} style={{ borderTop: "1px solid var(--line)", paddingTop: 8 }}>
              <div className="row"><Stars value={r.rating} size={12} /><b className="small">{r.by_name}</b></div>
              <p className="small mt1">{r.text}</p>
            </div>
          ))}
        </div>
        <div className="row mt2">
          <button className="btn btn-sm" onClick={() => void import("../lib/da-export").then((m) => m.downloadHistoryCSV(data))}><Ic name="download" /> {t("export_resume")}</button>
        </div>
      </div>
      {confirmDel ? (
        <Modal onClose={() => setConfirmDel(false)} title={t("sure_delete")}>
          <div className="row mt2">
            <button className="btn btn-danger" onClick={async () => { await act.deleteWorker(worker.id); toast(t("deleted_profile")); }}>{t("delete")}</button>
            <button className="btn" onClick={() => setConfirmDel(false)}>{t("cancel")}</button>
          </div>
        </Modal>
      ) : null}
    </div>
  );
}

function WorkerForm({ f, set, t, save, isNew }: {
  f: Record<string, unknown>;
  set: (k: string, v: string | number) => void;
  t: (k: string) => string;
  save: () => void;
  isNew?: boolean;
}) {
  const sv = (k: string) => (typeof f[k] === "string" ? String(f[k]) : String(f[k] ?? ""));
  return (
    <div style={{ display: "grid", gap: 11, marginTop: 14 }}>
      <div className="grid" style={{ gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        <div className="field"><label>{t("full_name")} *</label><input className="input" value={sv("name")} onChange={(e) => set("name", e.target.value)} /></div>
        <div className="field"><label>{t("trade")}</label>
          <select className="select" value={sv("trade")} onChange={(e) => set("trade", e.target.value)}>
            {TRADES.map((x) => <option key={x}>{x}</option>)}
          </select>
        </div>
        <div className="field"><label>{t("location")}</label><input className="input" value={sv("location")} onChange={(e) => set("location", e.target.value)} placeholder="City" /></div>
        <div className="field"><label>{t("experience_years")}</label><input className="input" type="number" min={0} max={60} value={sv("experience_years")} onChange={(e) => set("experience_years", Math.max(0, Number(e.target.value) || 0))} /></div>
        <div className="field"><label>{t("phone")}</label><input className="input" value={sv("phone")} onChange={(e) => set("phone", e.target.value)} /></div>
        <div className="field"><label>{t("email")}</label><input className="input" value={sv("email")} onChange={(e) => set("email", e.target.value)} /></div>
      </div>
      <div className="grid" style={{ gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        <div className="field"><label>{t("rate")}</label><input className="input" value={sv("rate")} onChange={(e) => set("rate", e.target.value)} placeholder="from $15/hr" /></div>
        <div className="field"><label>{t("availability")}</label>
          <select className="select" value={sv("availability")} onChange={(e) => set("availability", e.target.value)}>
            <option value="now">{t("availability")}: now</option>
            <option value="today">{t("availability")}: today</option>
            <option value="week">{t("availability")}: week</option>
          </select>
        </div>
      </div>
      <div className="field"><label>{t("video_url")}</label><input className="input" value={sv("video_url")} onChange={(e) => set("video_url", e.target.value)} placeholder="https://…" /></div>
      <div className="field"><label>{t("bio")}</label><textarea className="textarea" value={sv("bio")} onChange={(e) => set("bio", e.target.value)} /></div>
      <div className="row" style={{ justifyContent: "flex-end" }}>
        <button className="btn btn-primary" onClick={save}><Ic name="check" /> {isNew ? t("register_worker") : t("save")}</button>
      </div>
    </div>
  );
}