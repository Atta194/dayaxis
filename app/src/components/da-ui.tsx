/* DayAxis UI atoms: icons, rings, modals, toasts, confetti, stars, poses. */
import { useEffect, useRef, useState, type ReactNode } from "react";

/* ---------- icons (24x24, stroke) ---------- */
const PATHS: Record<string, ReactNode> = {
  check: <path d="M20 6 9 17l-5-5" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />,
  plus: <path d="M12 5v14M5 12h14" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />,
  x: <path d="M18 6 6 18M6 6l12 12" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />,
  sun: <><circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="2" /><path d="M12 2v2m0 16v2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M2 12h2m16 0h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></>,
  moon: <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />,
  globe: <><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="2" /><path d="M3 12h18M12 3a15 15 0 0 1 0 18 15 15 0 0 1 0-18z" fill="none" stroke="currentColor" strokeWidth="2" /></>,
  cal: <><rect x="3" y="5" width="18" height="16" rx="2" fill="none" stroke="currentColor" strokeWidth="2" /><path d="M3 10h18M8 3v4m8-4v4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></>,
  pot: <path d="M4 11h16l-1.5 9a2 2 0 0 1-2 1.8h-9a2 2 0 0 1-2-1.8L4 11zM8 8v2m4-2v2m4-2v2M7 5h10" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />,
  dumbbell: <><path d="M6.5 6.5v11M3.5 12h6m5-5.5v11m1.5-5.5h6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></>,
  wrench: <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />,
  bulb: <path d="M9 18h6M10 22h4M12 2a7 7 0 0 0-4 12.7c.6.5 1 1.4 1 2.3h6c0-.9.4-1.8 1-2.3A7 7 0 0 0 12 2z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />,
  user: <><circle cx="12" cy="8" r="4" fill="none" stroke="currentColor" strokeWidth="2" /><path d="M4 21v-1a6 6 0 0 1 6-6h4a6 6 0 0 1 6 6v1" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></>,
  users: <><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /><circle cx="9" cy="7" r="4" fill="none" stroke="currentColor" strokeWidth="2" /><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></>,
  star: <path d="m12 2 3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="currentColor" stroke="none" />,
  zen: <><circle cx="12" cy="8" r="3.6" fill="none" stroke="currentColor" strokeWidth="2" /><path d="M12 12.4c0 7-5.2 10-11 13 6.2.9 12.4.9 18.6 0-5.8-3-11-6-11-13z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" /><path d="M5 22.4h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></>,
  pause: <path d="M7 4v16M17 4v16" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />,
  trash: <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />,
  bell: <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />,
  mic: <><rect x="9" y="2" width="6" height="12" rx="3" fill="none" stroke="currentColor" strokeWidth="2" /><path d="M5 10v1a7 7 0 0 0 14 0v-1M12 18v4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></>,
  cam: <><rect x="3" y="6" width="13" height="12" rx="2" fill="none" stroke="currentColor" strokeWidth="2" /><path d="m16 10 5-3v10l-5-3" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" /></>,
  phone: <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.13.96.36 1.9.7 2.8a2 2 0 0 1-.45 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.27a2 2 0 0 1 2.1-.45c.9.34 1.84.57 2.8.7A2 2 0 0 1 22 16.9z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />,
  mail: <><rect x="3" y="5" width="18" height="14" rx="2" fill="none" stroke="currentColor" strokeWidth="2" /><path d="m3 7 9 6 9-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></>,
  play: <path d="M7 4v16l13-8z" fill="currentColor" stroke="none" />,
  clock: <><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="2" /><path d="M12 7v5l3 2" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></>,
  repeat: <path d="m17 1 4 4-4 4M3 11V9a4 4 0 0 1 4-4h14M7 23l-4-4 4-4M21 13v2a4 4 0 0 1-4 4H3" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />,
  file: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" /><path d="M14 2v6h6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" /></>,
  download: <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />,
  upload: <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />,
  heart: <path d="M19 14c1.5-1.5 3-3.3 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.8 0-3 .8-4.5 2-1.5-1.2-2.7-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.2 1.5 4 3 5.5l7 7z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />,
  shield: <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />,
  alert: <path d="M12 9v4m0 4h.01M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />,
  left: <path d="m15 18-6-6 6-6" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />,
  right: <path d="m9 18 6-6-6-6" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />,
  map: <><path d="M9 4 3 6v14l6-2 6 2 6-2V4l-6 2-6-2z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" /><path d="M9 4v14m6-12v14" fill="none" stroke="currentColor" strokeWidth="2" /></>,
  logout: <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />,
  mic2: <path d="M12 2a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />,
  spark: <path d="M12 3v4m0 10v4M5 12H1m22 0h-4M5.6 5.6l2.8 2.8m7.2 7.2 2.8 2.8M18.4 5.6l-2.8 2.8M8.4 15.6l-2.8 2.8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />,
};

export function Ic({ name, size = 18 }: { name: string; size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true">
      {PATHS[name] ?? <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="2" />}
    </svg>
  );
}

/* ---------- progress ring ---------- */
export function Ring({
  pct, size = 120, stroke = 11, label, sub, tone,
}: { pct: number; size?: number; stroke?: number; label?: ReactNode; sub?: ReactNode; tone?: string }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const clamped = Math.max(0, Math.min(1, pct));
  return (
    <div className="ring" style={{ width: size, height: size }}>
      <svg width={size} height={size}>
        <circle className="ring-track" cx={size / 2} cy={size / 2} r={r} fill="none" strokeWidth={stroke} />
        <circle
          className="ring-fill" cx={size / 2} cy={size / 2} r={r} fill="none" strokeWidth={stroke}
          strokeDasharray={c} strokeDashoffset={c * (1 - clamped)}
          strokeLinecap="round" style={tone ? { stroke: tone } : undefined}
        />
      </svg>
      <div className="ring-label">
        {label ?? <><b style={{ fontSize: size * 0.26, lineHeight: 1 }} className="tnum">{Math.round(pct * 100)}%</b>
          {sub ? <span className="small muted" style={{ fontSize: size * 0.13 }}>{sub}</span> : null}</>}
      </div>
    </div>
  );
}

/* ---------- modal ---------- */
export function Modal({ onClose, title, children, wide }: {
  onClose: () => void; title?: ReactNode; children: ReactNode; wide?: boolean;
}) {
  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className={`modal${wide ? " wide" : ""}`} onClick={(e) => e.stopPropagation()}>
        <div className="row-b" style={{ marginBottom: 14 }}>
          <h3 style={{ fontSize: 18 }}>{title}</h3>
          <button className="icon-btn" onClick={onClose} aria-label="Close"><Ic name="x" /></button>
        </div>
        {children}
      </div>
    </div>
  );
}

/* ---------- toasts ---------- */
export interface Toast { id: number; msg: string; kind: "ok" | "info" | "warn" }
export function useToasts() {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const n = useRef(0);
  const push = (msg: string, kind: "ok" | "info" | "warn" = "ok") => {
    const id = ++n.current;
    setToasts((ts) => [...ts.slice(-3), { id, msg, kind }]);
    setTimeout(() => setToasts((ts) => ts.filter((t) => t.id !== id)), 4200);
  };
  const zone = (
    <div className="toast-zone">
      {toasts.map((t) => (
        <div className="toast" key={t.id} role="status">
          <Ic name={t.kind === "ok" ? "check" : t.kind === "warn" ? "alert" : "spark"} />
          <span style={{ flex: 1 }}>{t.msg}</span>
          <span className="t-x" onClick={() => setToasts((ts) => ts.filter((x) => x.id !== t.id))}><Ic name="x" size={15} /></span>
        </div>
      ))}
    </div>
  );
  return { push, zone };
}

/* ---------- confetti ---------- */
export function Confetti({ fire }: { fire: number }) {
  const [pieces, setPieces] = useState<{ x: number; d: number; c: string; r: number; delay: number }[]>([]);
  useEffect(() => {
    if (!fire) return;
    const colors = ["#1E7A6B", "#E8705F", "#E9B44C", "#57BFA9", "#4C9E6F"];
    const p = Array.from({ length: 60 }, (_, i) => ({
      x: Math.random() * 100,
      d: 1.4 + Math.random() * 1.4,
      c: colors[i % colors.length],
      r: 6 + Math.random() * 8,
      delay: Math.random() * 0.4,
    }));
    setPieces(p);
    const h = setTimeout(() => setPieces([]), 3600);
    return () => clearTimeout(h);
  }, [fire]);
  if (!pieces.length) return null;
  return (
    <div className="confetti" aria-hidden="true">
      {pieces.map((pc, i) => (
        <span
          key={i} className="cf-piece"
          style={{
            left: `${pc.x}vw`, background: pc.c,
            animationDuration: `${pc.d}s`, animationDelay: `${pc.delay}s`,
            transform: `rotate(${pc.r}deg)`,
          }}
        />
      ))}
    </div>
  );
}

/* ---------- stars ---------- */
export function Stars({ value, onChange, size = 15 }: { value: number; onChange?: (v: number) => void; size?: number }) {
  return (
    <span className="rating-stars" role={onChange ? "radiogroup" : undefined}>
      {[1, 2, 3, 4, 5].map((v) => (
        <span
          key={v}
          onClick={onChange ? () => onChange(v) : undefined}
          style={{ cursor: onChange ? "pointer" : "default", color: v <= value ? "var(--gold)" : "var(--line)", display: "inline-flex" }}
        >
          <Ic name="star" size={size} />
        </span>
      ))}
    </span>
  );
}

/* ---------- SVG stick-figure poses for exercises (theme-aware: visible in day & night) ---------- */
const POSES: Record<string, ReactNode> = {
  stand: <><ellipse cx="60" cy="90" rx="26" ry="4" fill="var(--brand3)" opacity="0.3" /><path d="M20 92h80" stroke="var(--line)" strokeWidth="3" strokeLinecap="round" /><circle cx="60" cy="18" r="9" fill="var(--brand2)" /><path d="M60 27v34M60 40 44 52m16-12 16 12M60 61 47 82m13-21 13 21" stroke="var(--ink)" strokeWidth="7" strokeLinecap="round" /><circle cx="44" cy="52" r="4" fill="var(--accent)" /><circle cx="76" cy="52" r="4" fill="var(--accent)" /><circle cx="47" cy="82" r="5" fill="var(--accent)" /><circle cx="73" cy="82" r="5" fill="var(--accent)" /></>,
  reach: <><ellipse cx="60" cy="90" rx="26" ry="4" fill="var(--brand3)" opacity="0.3" /><path d="M20 92h80" stroke="var(--line)" strokeWidth="3" strokeLinecap="round" /><circle cx="60" cy="18" r="9" fill="var(--brand2)" /><path d="M60 27v34M60 36 42 13m18 23 18-13M60 61 47 82m13-21 13 21" stroke="var(--ink)" strokeWidth="7" strokeLinecap="round" /><circle cx="42" cy="13" r="4" fill="var(--accent)" /><circle cx="78" cy="13" r="4" fill="var(--accent)" /><circle cx="47" cy="82" r="5" fill="var(--accent)" /><circle cx="73" cy="82" r="5" fill="var(--accent)" /></>,
  armsout: <><ellipse cx="60" cy="90" rx="26" ry="4" fill="var(--brand3)" opacity="0.3" /><path d="M20 92h80" stroke="var(--line)" strokeWidth="3" strokeLinecap="round" /><circle cx="60" cy="18" r="9" fill="var(--brand2)" /><path d="M60 27v34M60 36 36 30m24 6 24-6M60 61 46 82m14-21 14 21" stroke="var(--ink)" strokeWidth="7" strokeLinecap="round" /><circle cx="36" cy="30" r="4" fill="var(--accent)" /><circle cx="84" cy="30" r="4" fill="var(--accent)" /><circle cx="46" cy="82" r="5" fill="var(--accent)" /><circle cx="74" cy="82" r="5" fill="var(--accent)" /></>,
  jump: <><path d="M36 88q9 10 20 4m30-4q-9 10-20 4" stroke="var(--brand3)" strokeWidth="4" fill="none" strokeLinecap="round" /><circle cx="60" cy="13" r="9" fill="var(--brand2)" /><path d="M60 22v25M60 31 40 19m20 12 20-12M60 47 44 68m16-21 16 21" stroke="var(--ink)" strokeWidth="7" strokeLinecap="round" /><circle cx="40" cy="19" r="4" fill="var(--accent)" /><circle cx="80" cy="19" r="4" fill="var(--accent)" /><circle cx="44" cy="68" r="5" fill="var(--accent)" /><circle cx="76" cy="68" r="5" fill="var(--accent)" /></>,
  squat: <><ellipse cx="60" cy="90" rx="32" ry="4" fill="var(--brand3)" opacity="0.3" /><path d="M16 92h88" stroke="var(--line)" strokeWidth="3" strokeLinecap="round" /><circle cx="60" cy="14" r="9" fill="var(--brand2)" /><path d="M60 23v20M60 34 40 30m20 4 20-4M60 43 46 68m14-25 12 25" stroke="var(--ink)" strokeWidth="7" strokeLinecap="round" /><circle cx="40" cy="30" r="4" fill="var(--accent)" /><circle cx="80" cy="30" r="4" fill="var(--accent)" /><path d="M42 72h-6m30 0h6" stroke="var(--ink)" strokeWidth="7" strokeLinecap="round" /></>,
  plank: <><ellipse cx="60" cy="92" rx="40" ry="4" fill="var(--brand3)" opacity="0.25" /><circle cx="98" cy="24" r="9" fill="var(--brand2)" /><path d="M90 30 40 90M90 30 90 48m0 0-50 58M20 90h20" stroke="var(--ink)" strokeWidth="7" strokeLinecap="round" /><circle cx="90" cy="48" r="4" fill="var(--accent)" /><circle cx="20" cy="90" r="5" fill="var(--accent)" /><circle cx="40" cy="90" r="5" fill="var(--accent)" /></>,
  lunge: <><path d="M34 90q10-14 0-24" stroke="var(--brand3)" strokeWidth="4" fill="none" strokeLinecap="round" /><circle cx="60" cy="13" r="9" fill="var(--brand2)" /><path d="M60 22v24M60 35 42 25m18 10 20 10M60 46 45 76m15-30 15 20" stroke="var(--ink)" strokeWidth="7" strokeLinecap="round" /><circle cx="42" cy="25" r="4" fill="var(--accent)" /><circle cx="80" cy="35" r="4" fill="var(--accent)" /><circle cx="45" cy="76" r="5" fill="var(--accent)" /><path d="M60 46 58 88" stroke="var(--ink)" strokeWidth="7" strokeLinecap="round" /><circle cx="58" cy="88" r="5" fill="var(--accent)" /></>,
  bridge: <><ellipse cx="55" cy="90" rx="34" ry="4" fill="var(--brand3)" opacity="0.3" /><path d="M18 92h82" stroke="var(--line)" strokeWidth="3" strokeLinecap="round" /><circle cx="78" cy="18" r="9" fill="var(--brand2)" /><path d="M72 24 40 56m32-32 26 22M40 56 24 82m16-26-12 24M66 80l14-24" stroke="var(--ink)" strokeWidth="7" strokeLinecap="round" /><circle cx="40" cy="56" r="4" fill="var(--accent)" /><circle cx="24" cy="82" r="5" fill="var(--accent)" /><circle cx="80" cy="80" r="5" fill="var(--accent)" /></>,
  chair: <><path d="M28 84h64M30 84v14m60-14v14M40 60v24m40-24v24" stroke="var(--ink3)" strokeWidth="5" strokeLinecap="round" /><circle cx="60" cy="15" r="9" fill="var(--brand2)" /><path d="M60 24v26M60 33 42 25m18 8 18-8M60 50v18" stroke="var(--ink)" strokeWidth="7" strokeLinecap="round" /><circle cx="42" cy="25" r="4" fill="var(--accent)" /><circle cx="78" cy="25" r="4" fill="var(--accent)" /></>,
  wall: <><path d="M96 24 88 96" stroke="var(--ink3)" strokeWidth="4" /><ellipse cx="60" cy="90" rx="22" ry="4" fill="var(--brand3)" opacity="0.3" /><circle cx="60" cy="19" r="9" fill="var(--brand2)" /><path d="M60 28v36M60 40 78 28m18 6-18 12M60 64 44 88m16-24 16 24" stroke="var(--ink)" strokeWidth="7" strokeLinecap="round" /><circle cx="78" cy="28" r="4" fill="var(--accent)" /><circle cx="44" cy="88" r="5" fill="var(--accent)" /><circle cx="76" cy="88" r="5" fill="var(--accent)" /></>,
  march: <><path d="M34 90q12-8 22-2" stroke="var(--brand3)" strokeWidth="4" fill="none" strokeLinecap="round" /><circle cx="60" cy="15" r="9" fill="var(--brand2)" /><path d="M60 24v30M60 33 40 29m20 4 22 4M60 54 44 74m16-20 16 20" stroke="var(--ink)" strokeWidth="7" strokeLinecap="round" /><circle cx="40" cy="29" r="4" fill="var(--accent)" /><circle cx="82" cy="33" r="4" fill="var(--accent)" /><path d="M44 74l-8 10" stroke="var(--ink)" strokeWidth="7" strokeLinecap="round" /><circle cx="36" cy="84" r="5" fill="var(--accent)" /><circle cx="76" cy="74" r="5" fill="var(--accent)" /></>,
  bear: <><path d="M24 92h20m48 0h8" stroke="var(--ink3)" strokeWidth="4" strokeLinecap="round" /><circle cx="86" cy="22" r="9" fill="var(--brand2)" /><path d="M78 28 34 76M78 28 70 78M34 76H22m48 0h8" stroke="var(--ink)" strokeWidth="7" strokeLinecap="round" /><circle cx="22" cy="76" r="5" fill="var(--accent)" /><circle cx="70" cy="78" r="5" fill="var(--accent)" /><circle cx="78" cy="78" r="5" fill="var(--accent)" /></>,
};

export function Pose({ pose }: { pose: string }) {
  return (
    <svg viewBox="0 0 120 100" width="130" height="108" role="img" aria-label="Exercise posture">
      <rect
        width="120" height="100" rx="12" fill="none"
        style={{ background: "radial-gradient(circle at 30% 18%, var(--brand3), var(--card2) 62%)" }}
      />
      {POSES[pose] ?? POSES.stand}
    </svg>
  );
}

/* ---------- misc ---------- */
export function Avatar({ name, color, size = 52, src }: { name: string; color: string; size?: number; src?: string }) {
  const initials = name.trim().slice(0, 2).toUpperCase();
  if (src) {
    return (
      <span className="avatar" style={{ overflow: "hidden", width: size, height: size, borderRadius: size * 0.3, background: color }}>
        <img src={src} alt={name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </span>
    );
  }
  return (
    <span className="avatar" style={{ background: color, width: size, height: size, fontSize: size * 0.36, borderRadius: size * 0.3 }}>
      {initials}
    </span>
  );
}

export function Empty({ msg }: { msg: string }) {
  return (
    <div className="card" style={{ textAlign: "center", padding: "34px 18px" }}>
      <Ic name="spark" size={26} />
      <p className="muted mt2" style={{ fontSize: 14.5 }}>{msg}</p>
    </div>
  );
}

export function Img({ src, alt, className = "" }: { src: string; alt: string; className?: string }) {
  const [err, setErr] = useState(false);
  if (err || !src) {
    return (
      <div className={`dish-img ${className}`} style={{ display: "flex", alignItems: "center", justifyContent: "center", background: "var(--card2)" }}>
        <Ic name="pot" size={34} />
      </div>
    );
  }
  return <img className={`dish-img ${className}`} src={src} alt={alt} loading="lazy" onError={() => setErr(true)} />;
}