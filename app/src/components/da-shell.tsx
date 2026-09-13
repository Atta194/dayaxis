/* DayAxis - app shell: topbar, tabs, reminder engine, theme/lang/member state. */
import { useEffect, useMemo, useState } from "react";

import { LANGS, t as tr } from "../lib/da-content";
import { useDa } from "../lib/da-client";
import { DaCtx, memberName } from "./da-ctx";
import Dashboard from "./da-dashboard";
import Planner from "./da-planner";
import Kitchen from "./da-kitchen";
import Move from "./da-move";
import Mind from "./da-mind";
import Work from "./da-work";
import Assist from "./da-assist";
import Profile from "./da-profile";
import Admin from "./da-admin";
import { Confetti, Ic, useToasts } from "./da-ui";
import {
  LS, lsGet, lsSet, notify, occStatus, speak, tasksForDate, todayKey,
} from "../lib/da-types";
import type { Lang } from "../lib/da-types";

const TABS = [
  { id: "dash", icon: "spark", key: "nav_dash" },
  { id: "plan", icon: "cal", key: "nav_plan" },
  { id: "kitchen", icon: "pot", key: "nav_kitchen" },
  { id: "move", icon: "dumbbell", key: "nav_move" },
  { id: "mind", icon: "zen", key: "nav_mind" },
  { id: "work", icon: "wrench", key: "nav_work" },
  { id: "assist", icon: "bulb", key: "nav_assist" },
  { id: "me", icon: "user", key: "nav_me" },
];

export default function Shell() {
  const { data, loading, error, refresh, act, offline } = useDa();
  const [lang, setLangState] = useState<Lang>((lsGet(LS.lang) as Lang) || "en");
  const [theme, setThemeState] = useState<"light" | "dark">(lsGet(LS.theme) === "dark" ? "dark" : "light");
  const [view, setViewState] = useState("dash");
  const [memberId, setMemberIdState] = useState<number | null>(Number(lsGet(LS.guest)) || null);
  const [viewMode, setViewModeState] = useState<"cards" | "list" | "compact">((lsGet(LS.view) as "cards" | "list" | "compact") || "cards");
  const [fire, setFire] = useState(0);
  const [installEvt, setInstallEvt] = useState<{ prompt: () => Promise<void> } | null>(null);
  const { push, zone } = useToasts();

  /* PWA: service worker + install prompt */
  useEffect(() => {
    const onInst = (e: Event) => {
      e.preventDefault();
      setInstallEvt(e as unknown as { prompt: () => Promise<void> });
    };
    const onInstalled = () => setInstallEvt(null);
    window.addEventListener("beforeinstallprompt", onInst);
    window.addEventListener("appinstalled", onInstalled);
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    }
    return () => {
      window.removeEventListener("beforeinstallprompt", onInst);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);
  const installApp = installEvt ? () => { void installEvt.prompt(); } : null;

  /* Google OAuth return: exchange ?code on the callback URL */
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const code = params.get("code");
      if (params.get("social") === "google" && code) {
        window.history.replaceState({}, "", window.location.pathname);
        void act.googleCallback(code).then((res) => {
          if (!res.ok) {
            const msg = res.data && "message" in res.data && typeof res.data.message === "string" ? res.data.message : res.error;
            push(msg || "error", "warn");
          } else {
            push(t("welcome"), "ok");
          }
        });
      }
    } catch { /* ignore */ }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* theme + lang applied to <html> */
  useEffect(() => {
    const root = document.documentElement;
    root.dataset.theme = theme;
    root.style.colorScheme = theme;
    lsSet(LS.theme, theme);
  }, [theme]);
  useEffect(() => {
    const root = document.documentElement;
    root.lang = lang;
    root.dir = lang === "ar" ? "rtl" : "ltr";
    lsSet(LS.lang, lang);
  }, [lang]);

  /* reminder engine - every 12 s */
  useEffect(() => {
    const iv = setInterval(() => {
      if (!data) return;
      const today = todayKey();
      const lead = Number(lsGet(LS.reminderLead, "5")) || 5;
      const now = new Date();
      const nowMin = now.getHours() * 60 + now.getMinutes();
      let sounded: string[] = [];
      try { sounded = JSON.parse(lsGet(LS.sounded, "[]")) as string[]; } catch { sounded = []; }
      let changed = false;
      for (const task of tasksForDate(data.tasks, today)) {
        if (!task.time || occStatus(task, today, data.completions) !== "pending") continue;
        const [h, m] = task.time.split(":").map(Number);
        const tm = h * 60 + m;
        if (tm < nowMin - lead || tm > nowMin + 4) continue;
        const key = `${task.id}|${today}`;
        if (sounded.includes(key)) continue;
        sounded.push(key);
        changed = true;
        notify(task.title, task.time ?? "");
        if (lsGet(LS.voiceRem) === "1") speak(task.title, lang);
        push(`Reminder: ${task.title} - ${task.time}`);
      }
      if (changed) lsSet(LS.sounded, JSON.stringify(sounded.slice(-300)));
    }, 12000);
    return () => clearInterval(iv);
  }, [data, lang, push]);

  const t = useMemo(() => (k: string) => tr(lang, k), [lang]);

  const setLang = (l: Lang) => { setLangState(l); lsSet(LS.lang, l); };
  const setTheme = (th: "light" | "dark") => { setThemeState(th); lsSet(LS.theme, th); };
  const setView = (v: string) => { setViewState(v); window.scrollTo({ top: 0 }); };
  const setMemberId = (id: number | null) => { setMemberIdState(id); lsSet(LS.guest, id == null ? "" : String(id)); };
  const celebrate = () => setFire((f) => f + 1);

  /* loading / error */
  if (loading) return <Splash loading />;
  if (!data) {
    return (
      <div className="splash">
        <div className="splash-card" style={{ maxWidth: 460 }}>
          <div className="splash-copy">
            <h1 className="h-display">{t("welcome")}</h1>
            <p className="muted">{error === "storage-unavailable" ? "Storage is warming up - try again in a moment." : "Could not reach the data store."}</p>
            <button className="btn btn-accent" onClick={() => void refresh()}>Retry</button>
          </div>
        </div>
      </div>
    );
  }

  const value = {
    data, act, lang, t, toast: push, setLang, setView, memberId, setMemberId,
    theme, setTheme, viewMode, setViewMode: (m: "cards" | "list" | "compact") => { setViewModeState(m); lsSet(LS.view, m); },
    celebrate, refresh, offline, installApp,
  };

  const current = memberName(data, memberId);
  const tabs = [
    ...TABS,
    ...(data.account_role === "admin" ? [{ id: "admin", icon: "shield", key: "nav_admin" }] : []),
  ];
  const cycleMember = () => {
    const list = data.members;
    if (!list.length) return;
    const idx = list.findIndex((m) => m.id === memberId);
    const next = list[(idx + 1) % list.length];
    setMemberId(next.id);
    push(`${t("switch_to")} ${next.name}`);
  };

  return (
    <DaCtx.Provider value={value}>
      <div className="da-app">
        <div className="blob blob-1" aria-hidden="true" />
        <div className="blob blob-2" aria-hidden="true" />

        <header className="topbar no-print">
          <a className="brand-lockup" href="/">
            <img src="/brand/logo.svg" alt="" width={34} height={34} />
            <span className="brand-name">Day<b>Axis</b></span>
          </a>
          <div className="topbar-spacer tabnav-wrap">
            <nav className="tabnav" aria-label="Main">
              {tabs.map((tb) => (
                <button key={tb.id} className="tab" aria-selected={view === tb.id} onClick={() => setView(tb.id)}>
                  <Ic name={tb.icon} /> <span>{t(tb.key)}</span>
                </button>
              ))}
            </nav>
          </div>
          {data.members.length ? (
            <button className="chip" onClick={cycleMember} title={t("members")}>
              <span className="avatar" style={{ width: 22, height: 22, fontSize: 10, borderRadius: 7, background: "var(--brand)" }}>{current.slice(0, 2).toUpperCase()}</span>
              <b style={{ maxWidth: 90, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{current}</b>
            </button>
          ) : null}
          <select
            className="select" style={{ width: 92, padding: "7px 26px 7px 10px", fontSize: 13 }} value={lang}
            onChange={(e) => setLang(e.target.value as Lang)} aria-label={t("language")}
          >
            {LANGS.map((l) => <option key={l.id} value={l.id}>{l.native}</option>)}
          </select>
          <button className="icon-btn" onClick={() => setTheme(theme === "dark" ? "light" : "dark")} aria-label={theme === "dark" ? t("light") : t("dark")}>
            <Ic name={theme === "dark" ? "sun" : "moon"} />
          </button>
        </header>

        <main className="da-main">
          {!data.account_email ? (
            <div className="card card-soft mt2 no-print" style={{ display: "flex", alignItems: "center", gap: 12, justifyContent: "space-between", padding: "12px 16px" }}>
              <span className="small">{t("signin_required")}</span>
              <button className="btn btn-accent btn-sm" onClick={() => setView("me")}>{t("login")}</button>
            </div>
          ) : null}
          {view === "dash" ? <Dashboard /> : null}
          {view === "plan" ? <Planner /> : null}
          {view === "kitchen" ? <Kitchen /> : null}
          {view === "move" ? <Move /> : null}
          {view === "mind" ? <Mind /> : null}
          {view === "work" ? <Work /> : null}
          {view === "admin" ? <Admin /> : null}
          {view === "assist" ? <Assist /> : null}
          {view === "me" ? <Profile /> : null}
        </main>

        <nav className="mobilenav no-print" aria-label="Main">
          {tabs.map((tb) => (
            <button key={tb.id} className="tab" aria-selected={view === tb.id} onClick={() => setView(tb.id)}>
              <Ic name={tb.icon} /> <span>{t(tb.key)}</span>
            </button>
          ))}
        </nav>

        {zone}
        {offline ? (
          <div className="offline-ban"><Ic name="alert" size={15} /> Offline - showing last synced data</div>
        ) : null}
        <Confetti fire={fire} />
      </div>
    </DaCtx.Provider>
  );
}

function Splash({ loading }: { loading?: boolean }) {
  return (
    <div className="splash">
      <div className="splash-card">
        <div className="splash-art">
          <img src="/brand/diorama.svg" alt="" />
        </div>
        <div className="splash-copy">
          <span className="splash-pill"><Ic name="spark" size={14} /> Daily life toolkit</span>
          <h1 className="h-display">Day<b style={{ color: "var(--accent)" }}>Axis</b></h1>
          <p className="muted" style={{ fontSize: 15.5 }}>Tasks, reminders, meals, movement, trusted workers and smart help - one calm place for your busiest days.</p>
          {loading ? (
            <div className="row" style={{ gap: 12 }}>
              <div className="ring" style={{ width: 34, height: 34 }}>
                <svg width={34} height={34}>
                  <circle className="ring-track" cx={17} cy={17} r={13} fill="none" strokeWidth={4} />
                  <circle className="ring-fill" cx={17} cy={17} r={13} fill="none" strokeWidth={4} strokeDasharray={81.7} strokeDashoffset={20} strokeLinecap="round" style={{ animation: "rise 1.2s ease infinite" }} />
                </svg>
              </div>
              <span className="muted small">Warming up your command center…</span>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}