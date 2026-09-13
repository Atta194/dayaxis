/* DayAxis shared types + pure helpers (client-safe, no Node/DOM only where noted). */

export type Lang =
  | "en" | "ru" | "hi" | "ur" | "es" | "ar"
  | "de" | "fr" | "it" | "pt" | "nl" | "pl" | "cs" | "tr" | "uk"
  | "zh" | "ja" | "ko" | "vi" | "th" | "id" | "bn" | "sw" | "af";
export type Cat =
  | "meal" | "medicine" | "childcare" | "exercise" | "family" | "break" | "custom";

export interface Member { id: number; home_id: string; name: string; color: string; is_owner?: number; }

export interface Task {
  id: string;
  member_id: number | null;
  title: string;
  category: Cat;
  notes: string;
  task_date: string | null; // YYYY-MM-DD for one-offs
  time: string | null;      // HH:MM
  repeat: "none" | "weekly" | "custom";
  weekdays: string;         // "0,1,6"
  interval_days: number | null;
  checklist: { id: string; label: string; done: boolean }[];
  status: "active" | "deleted";
  created_at: string;
}

export interface DoneRow { task_id: string; on_date: string; kind: "done" | "postponed"; }

export interface Worker {
  id: number;
  owner_home: string | null;
  name: string;
  trade: string;
  location: string;
  phone: string;
  email: string;
  experience_years: number;
  bio: string;
  video_url: string;
  photo: string;
  status: "available" | "busy" | "offline";
  availability: "now" | "today" | "week";
  rate: string;
  jobs_done: number;
  created_at: string;
  approved: number;      // 0 pending | 1 approved | -1 rejected
  phone_verified: number; // 0 | 1
  rating: number;
  review_count: number;
}

export interface Review { id: number; worker_id: number; by_name: string; rating: number; text: string; at: string; }
export interface Feedback { id: number; home_id: string; rating: number; text: string; at: string; }

export interface MindLog {
  id: number;
  home_id: string;
  kind: "meditation" | "sleep";
  minutes: number;
  mood: number | null;
  note: string;
  at: string;
}

export interface Subscription {
  home_id: string;
  plan: "none" | "trial" | "weekly" | "monthly" | "yearly";
  status: "none" | "active" | "pending" | "expired";
  started_at: string | null;
  expires_at: string | null;
}

export interface Ad {
  id: number;
  home_id: string;
  title: string;
  tagline: string;
  link: string;
  active: number;
  views: number;
  clicks: number;
  created_at: string;
}

export interface HomeData {
  home_id: string;
  members: Member[];
  tasks: Task[];
  completions: DoneRow[];
  workers: Worker[];
  reviews: Review[];
  feedback: Feedback[];
  mind_log: MindLog[];
  subscription: Subscription | null;
  ads: Ad[];
  pending_workers: Worker[];
  my_workers: Worker[];
  account_email: string | null;
  account_role: "user" | "admin" | null;
  account_phone_verified: number;
}

/* ---------- dates (all local) ---------- */
export const dkey = (d: Date): string =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

export const todayKey = (): string => dkey(new Date());

export const parseKey = (k: string): Date => {
  const [y, m, d] = k.split("-").map(Number);
  return new Date(y, m - 1, d);
};

export const addDays = (k: string, n: number): string => {
  const d = parseKey(k);
  d.setDate(d.getDate() + n);
  return dkey(d);
};

export const shiftMonth = (k: string, n: number): string => {
  const d = parseKey(k);
  d.setDate(1);
  d.setMonth(d.getMonth() + n);
  return dkey(d);
};

export const fmtDay = (k: string, lang: Lang): string => {
  const d = parseKey(k);
  return new Intl.DateTimeFormat(lang === "ar" ? "ar" : lang === "hi" ? "hi-IN" : lang === "ur" ? "ur-PK" : lang === "ru" ? "ru" : lang === "es" ? "es" : "en", {
    weekday: "long", day: "numeric", month: "long",
  }).format(d);
};

export const fmtShort = (k: string, lang: Lang): string => {
  const d = parseKey(k);
  return new Intl.DateTimeFormat(lang === "ar" ? "ar" : lang === "hi" ? "hi-IN" : lang === "ur" ? "ur-PK" : lang === "ru" ? "ru" : lang === "es" ? "es" : "en", {
    weekday: "short", day: "numeric", month: "short",
  }).format(d);
};

export const fmtHM = (t: string | null): string => t && /^\d{2}:\d{2}/.test(t) ? t.slice(0, 5) : "";

export const nowHM = (): string => {
  const d = new Date();
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
};

export const uid = (): string =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `t-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

/* ---------- occurrence logic ---------- */
export function occursOn(t: Task, date: string): boolean {
  if (t.status === "deleted") return false;
  if (t.repeat === "none") return t.task_date === date;
  if (t.repeat === "weekly") {
    const wd = String(parseKey(date).getDay());
    return t.weekdays.split(",").map((s) => s.trim()).includes(wd);
  }
  if (t.repeat === "custom" && t.task_date && t.interval_days && t.interval_days > 0) {
    const base = parseKey(t.task_date);
    const cur = parseKey(date);
    if (cur < base) return false;
    const diff = Math.round((cur.getTime() - base.getTime()) / 86400000);
    return diff % t.interval_days === 0;
  }
  return false;
}

export function tasksForDate(tasks: Task[], date: string): Task[] {
  return tasks.filter((t) => occursOn(t, date)).sort((a, b) => (a.time || "99").localeCompare(b.time || "99"));
}

/** status of a task occurrence on a date: pending | done | postponed */
export function occStatus(task: Task, date: string, completions: DoneRow[]): "pending" | "done" | "postponed" {
  const c = completions.find((r) => r.task_id === task.id && r.on_date === date);
  return c ? c.kind : "pending";
}

/* ---------- storage keys ---------- */
export const LS = {
  device: "da.device",
  theme: "da.theme",
  lang: "da.lang",
  view: "da.view",
  notify: "da.notify",
  voiceRem: "da.voicerem",
  reminderLead: "da.remlead",
  session: "da.session",
  guest: "da.guest",
  sounded: "da.sounded", // 'taskId|date' list of already-sounded reminders
  cache: "da.cache",     // last sync payload for offline view
  bed: "da.bed",         // bedtime goal HH:MM
  wake: "da.wake",       // wake goal HH:MM
  wind: "da.wind",       // wind-down checklist [ids]
  region: "da.region",   // emergency region override, e.g. "US"
};

export function lsGet(key: string, fallback = ""): string {
  try { return window.localStorage.getItem(key) ?? fallback; } catch { return fallback; }
}
export function lsSet(key: string, val: string): void {
  try { window.localStorage.setItem(key, val); } catch { /* ignore */ }
}

/* ---------- export: CSV (Google Sheets friendly) ---------- */
export function toCSV(rows: (string | number)[][]): string {
  const esc = (v: string | number) => {
    const s = String(v ?? "");
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  return "\uFEFF" + rows.map((r) => r.map(esc).join(",")).join("\r\n");
}

export function download(name: string, content: string, mime = "text/csv"): void {
  const blob = new Blob([content], { type: `${mime};charset=utf-8` });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = name;
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 4000);
}

export function copyText(text: string): Promise<void> {
  if (navigator.clipboard?.writeText) return navigator.clipboard.writeText(text);
  const ta = document.createElement("textarea");
  ta.value = text; document.body.appendChild(ta); ta.select();
  document.execCommand("copy"); ta.remove();
  return Promise.resolve();
}

/* ---------- sound + speech ---------- */
export function beep(kind: "ding" | "bell" = "ding"): void {
  try {
    const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new Ctx();
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.connect(g); g.connect(ctx.destination);
    const f = kind === "bell" ? 880 : 660;
    o.type = "sine"; o.frequency.value = f;
    g.gain.setValueAtTime(0.0001, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.25, ctx.currentTime + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + (kind === "bell" ? 0.9 : 0.35));
    o.start(); o.stop(ctx.currentTime + (kind === "bell" ? 0.95 : 0.4));
  } catch { /* audio blocked */ }
}

export function speak(text: string, lang: Lang): void {
  try {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text.slice(0, 160));
    const map: Partial<Record<Lang, string>> = { en: "en-US", ru: "ru-RU", hi: "hi-IN", ur: "ur-PK", es: "es-ES", ar: "ar-SA", de: "de-DE", fr: "fr-FR", it: "it-IT", pt: "pt-PT", nl: "nl-NL", pl: "pl-PL", cs: "cs-CZ", tr: "tr-TR", uk: "uk-UA", zh: "zh-CN", ja: "ja-JP", ko: "ko-KR", vi: "vi-VN", th: "th-TH", id: "id-ID", bn: "bn-BD", sw: "sw-KE", af: "af-ZA" };
    if ("lang" in u) u.lang = map[lang] ?? "en-US";
    u.rate = 1.02; u.pitch = 1;
    window.speechSynthesis.speak(u);
  } catch { /* unsupported */ }
}

export function notify(title: string, body: string): void {
  try {
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification(title, { body, icon: "/brand/favicon.svg" });
    }
    // always also beep
    beep("bell");
  } catch { /* ignored */ }
}

/* ---------- voice input ---------- */
export function speechInput(onResult: (text: string) => void, lang: Lang): () => void {
  const SR = (window as unknown as {
    SpeechRecognition?: new () => { lang: string; start(): void; onresult: ((e: { results: { [k: number]: { [k: number]: { transcript: string } } } }) => void) | null; onend: (() => void) | null; onerror: (() => void) | null };
    webkitSpeechRecognition?: new () => { lang: string; start(): void; onresult: ((e: { results: { [k: number]: { [k: number]: { transcript: string } } } }) => void) | null; onend: (() => void) | null; onerror: (() => void) | null };
  }).SpeechRecognition || (window as unknown as { webkitSpeechRecognition?: unknown }).webkitSpeechRecognition;
  const C = SR as (new () => { lang: string; start(): void; onresult: ((e: { results: { [k: number]: { [k: number]: { transcript: string } } } }) => void) | null; onend: (() => void) | null; onerror: (() => void) | null }) | undefined;
  if (!C) return () => {};
  const rec = new C();
  const map: Partial<Record<Lang, string>> = { en: "en-US", ru: "ru-RU", hi: "hi-IN", ur: "ur-PK", es: "es-ES", ar: "ar-SA", de: "de-DE", fr: "fr-FR", it: "it-IT", pt: "pt-PT", nl: "nl-NL", pl: "pl-PL", cs: "cs-CZ", tr: "tr-TR", uk: "uk-UA", zh: "zh-CN", ja: "ja-JP", ko: "ko-KR", vi: "vi-VN", th: "th-TH", id: "id-ID", bn: "bn-BD", sw: "sw-KE", af: "af-ZA" };
  rec.lang = map[lang] ?? "en-US";
  rec.onresult = (e) => {
    const t = e.results[0]?.[0]?.transcript;
    if (t) onResult(t);
  };
  rec.onerror = () => {};
  try { rec.start(); } catch { /* already started */ }
  return () => { try { rec.onresult = null; } catch { /* ignore */ } };
}