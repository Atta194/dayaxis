/* DayAxis - Mind view: guided meditation sessions + sleep tracker. */
import { useEffect, useMemo, useRef, useState } from "react";

import { MIND_SESSIONS, SLEEP_TIPS, WIND_IDS } from "../lib/da-content";
import type { MindSession } from "../lib/da-content";
import { LS, beep, lsGet, lsSet } from "../lib/da-types";
import type { MindLog } from "../lib/da-types";
import { useCtx } from "./da-ctx";
import { Ic, Modal, Stars } from "./da-ui";

const KIND_LBL: Record<MindSession["kind"], string> = { breath: "mind_breath", guide: "mind_guide", focus: "mind_focus", kids: "mind_kids" };

export default function Mind() {
  const { data, act, t, toast } = useCtx();
  const [tab, setTab] = useState<"meditate" | "sleep">("meditate");
  const [session, setSession] = useState<MindSession | null>(null);

  const medLogs = data.mind_log.filter((l) => l.kind === "meditation");
  const week = useMemo(() => {
    const cut = Date.now() - 7 * 86400000;
    return medLogs.filter((l) => new Date(l.at.replace(" ", "T") + "Z").getTime() >= cut).reduce((a, b) => a + b.minutes, 0);
  }, [medLogs]);
  const sleepLogs = data.mind_log.filter((l) => l.kind === "sleep");

  return (
    <div>
      <div className="row-b">
        <div>
          <h1 className="h-display">{t("nav_mind")}</h1>
          <p className="muted mt1" style={{ fontSize: 14.5 }}>A few calm minutes a day change the whole day.</p>
        </div>
        <div className="row">
          <button className="chip" aria-pressed={tab === "meditate"} onClick={() => setTab("meditate")}><Ic name="zen" size={14} /> {t("mind_meditate")}</button>
          <button className="chip" aria-pressed={tab === "sleep"} onClick={() => setTab("sleep")}><Ic name="moon" size={14} /> {t("mind_sleep")}</button>
        </div>
      </div>

      {tab === "meditate" ? (
        <>
          <div className="card mt3" style={{ display: "flex", alignItems: "center", gap: 18, flexWrap: "wrap" }}>
            <div className="pose-frame" style={{ width: 74, height: 74, borderRadius: 18 }}>
              <IconZen size={40} />
            </div>
            <div style={{ flex: 1, minWidth: 200 }}>
              <h3 style={{ fontSize: 17 }}>{t("mind_weekly")}</h3>
              <p className="muted small mt1">
                <b style={{ color: "var(--brand)", fontSize: 24 }} className="tnum">{week}</b> {t("mind_min")} · {medLogs.length} {t("mind_times")}
              </p>
            </div>
          </div>

          <div className="grid g3 mt3">
            {MIND_SESSIONS.map((s) => (
              <div className="card" key={s.id} style={{ display: "flex", flexDirection: "column" }}>
                <div className="row" style={{ justifyContent: "space-between" }}>
                  <span className="chip chip-tag" style={{ cursor: "default" }}>{t(KIND_LBL[s.kind])}</span>
                  <b className="tnum muted">{s.mins} {t("mind_min")}</b>
                </div>
                <h3 className="mt2" style={{ fontSize: 16.5 }}>{t(s.titleKey)}</h3>
                <p className="small muted mt1" style={{ flex: 1 }}>
                  {s.pattern.map((p, i) => p.in + "+" + p.hold + "+" + p.out + (p.hold2 ? "+" + p.hold2 : "")).join(" / ")}
                </p>
                <button className="btn btn-primary mt2" onClick={() => setSession(s)}><Ic name="play" size={14} /> {t("mind_start")}</button>
              </div>
            ))}
          </div>

          <div className="card mt3">
            <h3 className="h-sec" style={{ fontSize: 15.5 }}>{t("mind_logs")}</h3>
            {medLogs.length === 0 ? <p className="muted small mt2">{t("empty")}</p> : null}
            <div className="mt2" style={{ display: "grid", gap: 8 }}>
              {medLogs.slice(0, 8).map((l) => (
                <div key={l.id} className="row" style={{ borderTop: "1px solid var(--line)", paddingTop: 8 }}>
                  <Ic name="zen" size={16} />
                  <span className="flex1">{l.note || t("mind_meditate")}</span>
                  <b className="tnum">{l.minutes} {t("mind_min")}</b>
                  {l.mood ? <Stars value={l.mood} size={11} /> : null}
                  <span className="small muted">{l.at?.slice(0, 10)}</span>
                  <button className="icon-btn" style={{ width: 28, height: 28 }} onClick={() => void act.mindDelete(l.id)}><Ic name="trash" size={13} /></button>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        <SleepTab sleepLogs={sleepLogs} />
      )}

      {session ? <Player session={session} onClose={() => setSession(null)} /> : null}
    </div>
  );
}

function IconZen({ size = 24 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size}>
      <g fill="none" stroke="var(--brand)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="9" r="3.6" />
        <path d="M12 13.4c0 6.5-4.8 9.3-10 12 5.6.8 11.2.8 16.8 0-5.2-2.7-10-5.5-10-12z" />
      </g>
    </svg>
  );
}

/* ---------------- meditation player ---------------- */
function Player({ session, onClose }: { session: MindSession; onClose: () => void }) {
  const { act, t, toast } = useCtx();
  const total = session.mins * 60;
  const [elapsed, setElapsed] = useState(0);
  const [running, setRunning] = useState(true);
  const [finished, setFinished] = useState(false);
  const [mood, setMood] = useState<number | null>(null);
  const [noise, setNoise] = useState<"none" | "white" | "rain">("none");

  const pattern = useMemo(() => {
    const p = session.pattern[0];
    return [
      { key: "mind_phase_in", sec: p.in },
      { key: "mind_phase_hold", sec: p.hold },
      { key: "mind_phase_out", sec: p.out },
      { key: "mind_phase_hold2", sec: p.hold2 },
    ].filter((x) => x.sec > 0);
  }, [session]);

  useEffect(() => {
    if (!running || finished) return;
    const iv = setInterval(() => {
      setElapsed((e) => {
        const nx = e + 1;
        if (nx >= total) {
          clearInterval(iv);
          setFinished(true);
          setRunning(false);
          beep("bell");
          void act.mindAdd("meditation", session.mins, null, t(session.titleKey));
          return total;
        }
        return nx;
      });
    }, 1000);
    return () => clearInterval(iv);
  }, [running, finished, total, session, act, t]);

  useEffect(() => { useNoise(noise); }, [noise]);

  const phaseSec = pattern.reduce((a, b) => a + b.sec, 0);
  const cyclePos = elapsed % phaseSec;
  let acc = 0;
  let phase = pattern[pattern.length - 1];
  for (const p of pattern) {
    if (cyclePos < acc + p.sec) { phase = p; break; }
    acc += p.sec;
  }
  const phaseLeft = Math.max(0, Math.ceil((acc + phase.sec - cyclePos)));
  const scale = phase.key === "mind_phase_in" ? 1.35 : phase.key === "mind_phase_hold" ? 1.35 : phase.key === "mind_phase_hold2" ? 1 : 1;
  const pct = Math.min(1, elapsed / total);

  const save = () => {
    void act.mindAdd("meditation", session.mins, mood ?? 3, t(session.titleKey));
    toast(t("mind_saved"));
    onClose();
  };

  return (
    <Modal onClose={onClose} title={finished ? t("mind_finished") : t(session.titleKey)}>
      {finished ? (
        <div style={{ textAlign: "center", padding: "10px 0" }}>
          <IconZen size={44} />
          <p className="mt2">{t("mind_finished")} · {session.mins} {t("mind_min")}</p>
          <p className="muted small mt2">{t("mind_mood")}</p>
          <div className="row mt1" style={{ justifyContent: "center" }}><Stars value={mood ?? 3} onChange={setMood} size={26} /></div>
          <div className="row mt3" style={{ justifyContent: "center" }}>
            <button className="btn btn-primary" onClick={save}><Ic name="check" /> {t("mind_saved")}</button>
          </div>
        </div>
      ) : (
        <div style={{ textAlign: "center", padding: "6px 0" }}>
          <div
            className="breath-circle"
            style={{
              width: 170, height: 170, margin: "0 auto",
              transform: `scale(${scale})`, transition: `transform ${phase.sec}s ease-in-out`,
            }}
          />
          <h3 className="mt3" style={{ fontSize: 20 }}>{t(phase.key)}</h3>
          <p className="tnum" style={{ fontSize: 30, fontWeight: 800, color: "var(--brand)" }}>{phaseLeft}</p>
          <div className="pbar mt2" style={{ maxWidth: 260, margin: "0 auto" }}><div style={{ width: `${pct * 100}%` }} /></div>
          <p className="small muted mt2 tnum">{Math.floor(elapsed / 60)}:{String(elapsed % 60).padStart(2, "0")} / {session.mins}:00</p>
          {session.stepsKey.map((k) => (
            <p key={k} className="small muted mt1" style={{ maxWidth: 380, margin: "8px auto 0" }}>
              {k === "settle" ? t("mind_step1") : k === "notice" ? t("mind_step2") : t("mind_step3")}
            </p>
          ))}
          <div className="row mt3" style={{ justifyContent: "center" }}>
            <button className="btn" onClick={() => setRunning((r) => !r)}>
              <Ic name={running ? "pause" : "play"} size={14} /> {running ? "Pause" : "Resume"}
            </button>
            {(["none", "white", "rain"] as const).map((n) => (
              <button key={n} className="chip" aria-pressed={noise === n} onClick={() => setNoise(n)}>
                {n === "none" ? t("mind_none") : n === "white" ? t("mind_pink") : t("mind_rain")}
              </button>
            ))}
          </div>
        </div>
      )}
    </Modal>
  );
}

/* ---------------- sleep ---------------- */
function SleepTab({ sleepLogs }: { sleepLogs: MindLog[] }) {
  const { act, t, toast, data } = useCtx();
  const [bed, setBed] = useState(lsGet(LS.bed, "23:00"));
  const [wake, setWake] = useState(lsGet(LS.wake, "07:00"));
  const [from, setFrom] = useState(lsGet(LS.bed, "23:00"));
  const [to, setTo] = useState(lsGet(LS.wake, "07:00"));
  const [wind, setWind] = useState<string[]>(() => {
    try { return JSON.parse(lsGet(LS.wind, "[]")) as string[]; } catch { return []; }
  });

  const diff = (a: string, b: string) => {
    const [ah, am] = a.split(":").map(Number);
    const [bh, bm] = b.split(":").map(Number);
    let m = bh * 60 + bm - (ah * 60 + am);
    if (m < 0) m += 1440;
    return m;
  };
  const planned = diff(bed, wake);
  const hours = (m: number) => Math.floor(m / 60) + "h " + String(m % 60).padStart(2, "0") + "m";

  const setBedV = (v: string) => { setBed(v); lsSet(LS.bed, v); };
  const setWakeV = (v: string) => { setWake(v); lsSet(LS.wake, v); };
  const toggleWind = (id: string) => {
    const nw = wind.includes(id) ? wind.filter((x) => x !== id) : [...wind, id];
    setWind(nw);
    lsSet(LS.wind, JSON.stringify(nw));
  };

  const week = useMemo(() => {
    const last = [...sleepLogs].sort((a, b) => a.at.localeCompare(b.at)).slice(-7);
    return last.map((l) => ({ h: Math.round((l.minutes / 60) * 10) / 10, at: l.at.slice(0, 10) }));
  }, [sleepLogs]);

  return (
    <div className="mt3">
      <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", alignItems: "start" }}>
        <div className="card">
          <h3 className="h-sec"><Ic name="moon" /> {t("sleep_duration")}</h3>
          <div className="row mt2">
            <div className="field flex1"><label>{t("sleep_bedtime")}</label>
              <input className="input" type="time" value={bed} onChange={(e) => setBedV(e.target.value)} />
            </div>
            <div className="field flex1"><label>{t("sleep_wake")}</label>
              <input className="input" type="time" value={wake} onChange={(e) => setWakeV(e.target.value)} />
            </div>
          </div>
          <p className="mt2 tnum" style={{ fontSize: 26, fontWeight: 800, color: "var(--brand)" }}>{hours(planned)}</p>
          <div className="pbar mt1 gold"><div style={{ width: `${Math.min(100, (planned / 600) * 100)}%` }} /></div>
        </div>

        <div className="card">
          <h3 className="h-sec" style={{ fontSize: 15.5 }}>{t("sleep_log")}</h3>
          <div className="row mt2">
            <div className="field flex1"><label>{t("sleep_to_bed")}</label>
              <input className="input" type="time" value={from} onChange={(e) => setFrom(e.target.value)} />
            </div>
            <div className="field flex1"><label>{t("sleep_woke")}</label>
              <input className="input" type="time" value={to} onChange={(e) => setTo(e.target.value)} />
            </div>
          </div>
          <p className="small muted mt2 tnum">{hours(diff(from, to))}</p>
          <button
            className="btn btn-primary mt2" onClick={() => {
              const m = diff(from, to);
              void act.mindAdd("sleep", m, null, `${from} -> ${to}`);
              toast(t("mind_saved"));
            }}
          ><Ic name="check" /> {t("sleep_add")}</button>
        </div>

        <div className="card">
          <h3 className="h-sec" style={{ fontSize: 15.5 }}>{t("sleep_wind")}</h3>
          <div className="mt2" style={{ display: "grid", gap: 7 }}>
            {WIND_IDS.map((id) => (
              <label key={id} className="check-row">
                <input type="checkbox" checked={wind.includes(id)} onChange={() => toggleWind(id)} />
                <span style={{ fontSize: 13.5 }}>{t(id)}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      <div className="card mt2">
        <h3 className="h-sec" style={{ fontSize: 15.5 }}>{t("sleep_week")}</h3>
        <div className="weekchart mt2">
          {week.length === 0 ? <p className="muted small">{t("empty")}</p> :
            week.map((w, i) => (
              <div className="bar" key={i} title={`${w.at}: ${w.h}h`}>
                <div className="fill full" style={{ height: `${Math.max(4, (w.h / 10) * 100)}%` }} />
                <span>{w.at.slice(5)}</span>
              </div>
            ))}
        </div>
        {sleepLogs.length ? (
          <div className="mt3" style={{ display: "grid", gap: 8 }}>
            {sleepLogs.slice(0, 6).map((l) => (
              <div key={l.id} className="row" style={{ borderTop: "1px solid var(--line)", paddingTop: 8 }}>
                <span className="flex1 small muted">{l.at?.slice(0, 10)} {l.note}</span>
                <b className="tnum">{hours(l.minutes)}</b>
                <button className="icon-btn" style={{ width: 28, height: 28 }} onClick={() => void act.mindDelete(l.id)}><Ic name="trash" size={13} /></button>
              </div>
            ))}
          </div>
        ) : null}
      </div>

      <div className="card mt2">
        <h3 className="h-sec" style={{ fontSize: 15.5 }}>{t("sleep_tips")}</h3>
        <ul className="mt2" style={{ paddingLeft: 18, display: "grid", gap: 7, fontSize: 13.5 }}>
          {SLEEP_TIPS.map((tip, i) => <li key={i}>{tip}</li>)}
        </ul>
      </div>
    </div>
  );
}

/* ---------------- noise ---------------- */
function useNoise(type: "none" | "white" | "rain") {
  const ref = useRef<{ src: AudioBufferSourceNode; ctx: AudioContext } | null>(null);
  useEffect(() => {
    if (type === "none") {
      try { ref.current?.src.stop(); ref.current?.ctx.close(); } catch { /* ignore */ }
      ref.current = null;
      return;
    }
    let ctx: AudioContext;
    try {
      const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      ctx = new AC();
    } catch {
      return;
    }
    const len = ctx.sampleRate * 2;
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const d = buf.getChannelData(0);
    let last = 0;
    for (let i = 0; i < len; i++) {
      const w = Math.random() * 2 - 1;
      if (type === "white") d[i] = w * 0.14;
      else if (type === "rain") { last = (last + 0.06 * w) / 1.06; d[i] = last * 6; }
      else { last = (last + 0.02 * w) / 1.02; d[i] = last * 3.2; }
    }
    const src = ctx.createBufferSource();
    src.buffer = buf;
    src.loop = true;
    const gain = ctx.createGain();
    gain.gain.value = 0.32;
    src.connect(gain);
    gain.connect(ctx.destination);
    src.start();
    ref.current = { src, ctx };
    return () => {
      try { src.stop(); ctx.close(); } catch { /* ignore */ }
      ref.current = null;
    };
  }, [type]);
}