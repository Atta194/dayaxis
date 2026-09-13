/* DayAxis - plans & pricing + sponsor ad management panels. */
import { useState } from "react";

import { PLANS, PLANS_ENABLED } from "../lib/da-content";
import { isDaError } from "../lib/da-client";
import { useCtx } from "./da-ctx";
import { Ic } from "./da-ui";

export function PlansPanel() {
  const { data, act, t, toast } = useCtx();
  if (!PLANS_ENABLED) return null; // dormant during the public-test month
  const sub = data.subscription;
  const now = Date.now();
  const exp = sub?.expires_at ? new Date(sub.expires_at.replace(" ", "T") + "Z").getTime() : 0;
  const trialActive = sub?.plan === "trial" && sub?.status === "active" && exp > now;
  const daysLeft = trialActive ? Math.max(0, Math.ceil((exp - now) / 86400000)) : 0;
  const activePlan =
    sub && ["weekly", "monthly", "yearly"].includes(sub.plan) && (sub.status === "active" || sub.status === "pending")
      ? sub
      : null;
  const expiredTrial = sub?.plan === "trial" && exp <= now;

  const subscribe = async (id: string) => {
    try {
      const res = await act.subscribe(id, window.location.origin);
      const url =
        !isDaError(res) && res.data && typeof (res.data as { url?: unknown }).url === "string"
          ? (res.data as { url: string }).url
          : null;
      if (url) {
        window.location.href = url;
        return;
      }
      const msg = isDaError(res)
        ? res.data && typeof (res.data as { message?: unknown }).message === "string"
          ? (res.data as { message: string }).message
          : res.error
        : "error";
      toast(msg || "error", "warn");
    } catch {
      toast("network", "warn");
    }
  };

  return (
    <div className="card mt2">
      <div className="row-b">
        <div>
          <h3 className="h-sec"><Ic name="star" /> {t("plans_title")}</h3>
          <p className="small muted mt1">{t("plan_free_trial")} - {t("plan_no_card")}</p>
        </div>
        {trialActive ? (
          <span className="chip chip-tag" style={{ cursor: "default", color: "var(--brand)" }}>
            {t("plan_trial_active")}: {daysLeft} {t("trial_days_left")}
          </span>
        ) : activePlan ? (
          <span className="chip chip-tag" style={{ cursor: "default", color: "var(--gold)" }}>
            ${PLANS.find((p) => p.id === activePlan.plan)?.price.toFixed(2)} · {activePlan.status === "pending" ? t("plan_pending") : t("plan_active")}
          </span>
        ) : expiredTrial ? (
          <span className="chip chip-tag" style={{ cursor: "default", color: "var(--danger)" }}>{t("plan_expired")}</span>
        ) : null}
      </div>
      <div className="grid mt2" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))" }}>
        <div className="card card-soft" style={{ display: "flex", flexDirection: "column", gap: 6, padding: 14 }}>
          <b style={{ fontSize: 14 }}>{t("plan_free_trial")}</b>
          <span className="small muted">7 {t("trial_days_left")} · {t("plan_no_card")}</span>
          <div style={{ flex: 1 }} />
          {trialActive ? (
            <button className="btn btn-soft btn-sm" disabled>{t("plan_active")}</button>
          ) : (
            <button className="btn btn-primary btn-sm" onClick={() => void act.startTrial()}>{t("plan_start_trial")}</button>
          )}
        </div>
        {PLANS.map((p) => (
          <div className="card card-soft" key={p.id} style={{ display: "flex", flexDirection: "column", gap: 6, padding: 14 }}>
            <b style={{ fontSize: 14 }}>{t(`plan_${p.id}`)}</b>
            <span className="muted tnum" style={{ fontSize: 22, fontWeight: 800 }}>${p.price.toFixed(2)}</span>
            <div style={{ flex: 1 }} />
            <button className="btn btn-primary btn-sm" onClick={() => void subscribe(p.id)}>{t("plan_subscribe")}</button>
          </div>
        ))}
      </div>
      <p className="small muted mt2">{t("payment_note")}</p>
    </div>
  );
}

export function SponsorPanel() {
  const { data, act, t, toast } = useCtx();
  const [title, setTitle] = useState("");
  const [tagline, setTagline] = useState("");
  const [link, setLink] = useState("");

  const add = async () => {
    if (!title.trim()) { toast(t("ad_title"), "warn"); return; }
    if (!/^https?:\/\//.test(link.trim())) { toast(t("ad_link"), "warn"); return; }
    const res = await act.addAd(title.trim(), tagline.trim(), link.trim());
    if (res.ok) {
      setTitle(""); setTagline(""); setLink("");
      toast(t("mind_saved"));
    }
  };

  return (
    <div className="card mt2">
      <h3 className="h-sec" style={{ fontSize: 15.5 }}><Ic name="spark" /> {t("sponsor_title")}</h3>
      <p className="small muted mt1">{t("sponsor_note")}</p>
      <div className="mt2" style={{ display: "grid", gap: 9, maxWidth: 520 }}>
        <input className="input" placeholder={t("ad_title")} value={title} onChange={(e) => setTitle(e.target.value)} />
        <input className="input" placeholder={t("ad_tagline")} value={tagline} onChange={(e) => setTagline(e.target.value)} />
        <input className="input" placeholder={t("ad_link")} value={link} onChange={(e) => setLink(e.target.value)} />
        <button className="btn btn-primary btn-sm" style={{ justifySelf: "start" }} onClick={() => void add()}>
          <Ic name="plus" /> {t("ad_add")}
        </button>
      </div>
      {data.ads.length ? (
        <div className="mt3" style={{ display: "grid", gap: 8 }}>
          {data.ads.map((ad) => (
            <div key={ad.id} className="row" style={{ borderTop: "1px solid var(--line)", paddingTop: 8 }}>
              <div className="flex1">
                <b style={{ fontSize: 14 }}>{ad.title}</b>
                {ad.tagline ? <p className="small muted">{ad.tagline}</p> : null}
                <span className="small muted">{ad.clicks} {t("sponsor_stats")} · {ad.link}</span>
              </div>
              <button className="icon-btn" style={{ width: 30, height: 30 }} title={t("delete")} onClick={() => void act.deleteAd(ad.id)}>
                <Ic name="trash" size={14} />
              </button>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}