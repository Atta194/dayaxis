/* DayAxis server API - one endpoint, many operations. Server-only (D1). */
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import type { D1Database } from "@cloudflare/workers-types";

import { bindings } from "../bindings.server";
import { SEED_REVIEWS, SEED_WORKERS } from "../da-content";
import type { Cat, Feedback, HomeData, Member, MindLog, Review, Task, Worker } from "../da-types";

const HOME_RE = /^[A-Za-z0-9_-]{16,64}$/;

async function sha256(s: string): Promise<string> {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s));
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function str(v: unknown, fallback = "", max = 2000): string {
  return typeof v === "string" ? v.trim().slice(0, max) : fallback;
}

function clampNum(v: unknown, fallback: number, min: number, max: number): number {
  const n = typeof v === "number" && Number.isFinite(v) ? v : fallback;
  return Math.min(max, Math.max(min, Math.round(n)));
}

const CATS: string[] = ["meal", "medicine", "childcare", "exercise", "family", "break", "custom"];
const REPEATS: string[] = ["none", "weekly", "custom"];

export const da = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      op: z.string().min(1),
      auth: z.string().optional().default(""),
      home: z.string().optional().default(""),
      payload: z.any().optional(),
    }),
  )
  .handler(async ({ data }) => {
    const { DB } = bindings();
    if (!DB) return { ok: false as const, error: "storage-unavailable" };

    const home =
      data.auth && (await DB.prepare("SELECT home_id FROM sessions WHERE token = ?").bind(data.auth).first<{ home_id: string }>())
        ? (await DB.prepare("SELECT home_id FROM sessions WHERE token = ?").bind(data.auth).first<{ home_id: string }>())!.home_id
        : data.home && HOME_RE.test(data.home)
          ? data.home
          : null;

    if (data.op === "account_login" || data.op === "account_signup") {
      return handleAccount(DB, data.op, data.payload, data.home);
    }
    if (!home) return { ok: false as const, error: "invalid-home" };
    const p = (data.payload ?? {}) as Record<string, unknown>;

    try {
      switch (data.op) {
        case "sync": return await syncAll(DB, home);
        case "member_add": return await memberAdd(DB, home, p);
        case "member_rename": return await memberRename(DB, home, p);
        case "task_save": return await taskSave(DB, home, p);
        case "task_delete": return await taskDelete(DB, home, p, true);
        case "task_restore": return await taskDelete(DB, home, p, false);
        case "complete": return await complete(DB, p);
        case "postpone": return await postpone(DB, p);
        case "worker_save": return await workerSave(DB, home, p);
        case "worker_delete": return await workerDelete(DB, home, p);
        case "worker_status": return await workerStatus(DB, p);
        case "review_add": return await reviewAdd(DB, home, p);
        case "feedback_add": return await feedbackAdd(DB, home, p);
        case "mind_add": return await mindAdd(DB, home, p);
        case "mind_delete": return await mindDelete(DB, home, p);
        default: return { ok: false as const, error: "unknown-op" };
      }
    } catch (e) {
      return { ok: false as const, error: e instanceof Error ? e.message.slice(0, 200) : "server-error" };
    }
  });

/* ---------------- helpers ---------------- */

async function seedWorkers(DB: D1Database): Promise<void> {
  const c = await DB.prepare("SELECT COUNT(*) AS n FROM workers").first<{ n: number }>();
  if (c && c.n! > 0) return;
  const insW = DB.prepare(
    `INSERT INTO workers (owner_home, name, trade, location, phone, email, experience_years, bio, video_url, status, availability, rate, jobs_done) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)`,
  );
  for (const w of SEED_WORKERS) {
    await insW.bind(null, w.name, w.trade, w.location, w.phone, w.email, w.experience_years, w.bio, w.video_url, w.status, w.availability, w.rate, w.jobs_done).run();
  }
  const insR = DB.prepare(
    `INSERT INTO reviews (worker_id, home_id, by_name, rating, text) VALUES (?,?,?,?,?)`,
  );
  for (const r of SEED_REVIEWS) {
    await insR.bind(r.worker_i + 1, "seed", r.by, r.rating, r.text).run();
  }
}

async function workersWithReviews(DB: D1Database): Promise<{ workers: Worker[]; reviews: Review[] }> {
  const [ws, rs] = await Promise.all([
    DB.prepare("SELECT * FROM workers ORDER BY jobs_done DESC").all<Worker & { rating?: number }>(),
    DB.prepare("SELECT * FROM reviews ORDER BY id DESC").all<Review>(),
  ]);
  const reviews = rs.results ?? [];
  const byWorker = new Map<number, Review[]>();
  for (const r of reviews) {
    const arr = byWorker.get(r.worker_id) ?? [];
    arr.push(r);
    byWorker.set(r.worker_id, arr);
  }
  const workers = (ws.results ?? []).map((w) => {
    const rv = byWorker.get(w.id) ?? [];
    const avg = rv.length ? Math.round((rv.reduce((a, b) => a + b.rating, 0) / rv.length) * 10) / 10 : 0;
    return { ...w, rating: avg, review_count: rv.length };
  });
  return { workers, reviews };
}

async function syncAll(DB: D1Database, home: string): Promise<{ ok: true; data: HomeData }> {
  await DB.prepare("INSERT OR IGNORE INTO homes (id) VALUES (?)").bind(home).run();
  await seedWorkers(DB);
  const [m, t, c, f, a, ww, mind] = await Promise.all([
    DB.prepare("SELECT * FROM members WHERE home_id = ? ORDER BY id").bind(home).all<Member>(),
    DB.prepare("SELECT * FROM tasks WHERE home_id = ? AND status IN ('active','deleted') ORDER BY created_at DESC").bind(home).all<Task>(),
    DB.prepare("SELECT * FROM completions WHERE task_id IN (SELECT id FROM tasks WHERE home_id = ?) ORDER BY on_date DESC").bind(home).all(),
    DB.prepare("SELECT * FROM feedback WHERE home_id = ? ORDER BY id DESC LIMIT 200").bind(home).all<Feedback>(),
    DB.prepare("SELECT email FROM accounts WHERE home_id = ? LIMIT 1").bind(home).first<{ email: string }>(),
    workersWithReviews(DB),
    DB.prepare("SELECT * FROM mind_log WHERE home_id = ? ORDER BY id DESC LIMIT 300").bind(home).all<MindLog>(),
  ]);
  const my = ww.workers.filter((w) => w.owner_home === home);
  return {
    ok: true,
    data: {
      home_id: home,
      members: (m.results ?? []).map((x) => ({ ...x, checklist: undefined }) as unknown as Member),
      tasks: (t.results ?? []).map((x) => ({ ...x, checklist: JSON.parse(String(x.checklist ?? "[]")) }) as Task),
      completions: (c.results ?? []).map((r) => ({ task_id: r.task_id as string, on_date: r.on_date as string, kind: (r.kind as "done" | "postponed") })),
feedback: f.results ?? [],
      mind_log: (mind.results ?? []).map((x) => ({
        id: x.id, home_id: x.home_id, kind: x.kind as "meditation" | "sleep",
        minutes: x.minutes, mood: x.mood, note: x.note, at: x.at,
      })),
      workers: ww.workers,
      reviews: ww.reviews,
      my_workers: my,
      account_email: a?.email ?? null,
    },
  };
}

async function memberAdd(DB: D1Database, home: string, p: Record<string, unknown>) {
  const name = str(p.name, "Guest", 60) || "Guest";
  const color = str(p.color, "#1E7A6B", 9) || "#1E7A6B";
  await DB.prepare("INSERT INTO members (home_id, name, color) VALUES (?,?,?)").bind(home, name, color).run();
  return syncAll(DB, home);
}

async function memberRename(DB: D1Database, home: string, p: Record<string, unknown>) {
  const id = clampNum(p.id, 0, 1, 1e9);
  const name = str(p.name, "Guest", 60) || "Guest";
  await DB.prepare("UPDATE members SET name = ? WHERE id = ? AND home_id = ?").bind(name, id, home).run();
  return syncAll(DB, home);
}

async function taskSave(DB: D1Database, home: string, p: Record<string, unknown>) {
  const task = (p.task ?? {}) as Partial<Task>;
  const id = str(task.id, "", 80);
  const title = str(task.title, "Task", 200) || "Task";
  const category = CATS.includes(str(task.category, "custom", 20)) ? str(task.category, "custom", 20) : "custom";
  const notes = str(task.notes, "", 2000);
  const taskDate = str(task.task_date, "", 10) || null;
  const time = /^\d{2}:\d{2}$/.test(str(task.time, "", 5)) ? str(task.time, "", 5) : null;
  const repeat = REPEATS.includes(str(task.repeat, "none", 10)) ? str(task.repeat, "none", 10) : "none";
  const weekdays = str(task.weekdays, "", 30);
  const intervalDays = repeat === "custom" ? clampNum(task.interval_days, 2, 1, 365) : null;
  const memberId = task.member_id == null ? null : clampNum(task.member_id, 1, 1, 1e9);
  const checklist = JSON.stringify(Array.isArray(task.checklist) ? task.checklist : []);
  const status = task.status === "deleted" ? "deleted" : "active";
  const now = new Date().toISOString();
  await DB.prepare(
    `INSERT INTO tasks (id, home_id, member_id, title, category, notes, task_date, time, repeat, weekdays, interval_days, checklist, status, created_at, updated_at)
     VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
     ON CONFLICT(id) DO UPDATE SET title=excluded.title, category=excluded.category, notes=excluded.notes,
       task_date=excluded.task_date, time=excluded.time, repeat=excluded.repeat, weekdays=excluded.weekdays,
       interval_days=excluded.interval_days, checklist=excluded.checklist, status=excluded.status,
       member_id=excluded.member_id, updated_at=excluded.updated_at`,
  ).bind(id, home, memberId, title, category, notes, taskDate, time, repeat, weekdays, intervalDays, checklist, status, now, now).run();
  return syncAll(DB, home);
}

async function taskDelete(DB: D1Database, home: string, p: Record<string, unknown>, deleted: boolean) {
  const id = str(p.id, "", 80);
  await DB.prepare("UPDATE tasks SET status = ?, updated_at = ? WHERE id = ? AND home_id = ?")
    .bind(deleted ? "deleted" : "active", new Date().toISOString(), id, home).run();
  return syncAll(DB, home);
}

async function complete(DB: D1Database, p: Record<string, unknown>) {
  const id = str(p.id, "", 80);
  const date = /^\d{4}-\d{2}-\d{2}$/.test(str(p.date, "", 10)) ? str(p.date, "", 10) : null;
  if (!id || !date) return { ok: false as const, error: "bad-input" };
  if (p.done === false) {
    await DB.prepare("DELETE FROM completions WHERE task_id = ? AND on_date = ?").bind(id, date).run();
  } else {
    await DB.prepare("INSERT OR REPLACE INTO completions (task_id, on_date, kind, at) VALUES (?,?, 'done', datetime('now'))").bind(id, date).run();
  }
  return { ok: true as const, data: { id, date, done: p.done !== false } };
}

async function postpone(DB: D1Database, p: Record<string, unknown>) {
  const id = str(p.id, "", 80);
  const date = /^\d{4}-\d{2}-\d{2}$/.test(str(p.date, "", 10)) ? str(p.date, "", 10) : null;
  const days = clampNum(p.days, 1, 1, 60);
  if (!id || !date) return { ok: false as const, error: "bad-input" };
  const task = await DB.prepare("SELECT repeat FROM tasks WHERE id = ?").bind(id).first<{ repeat: string }>();
  if (task && task.repeat === "none") {
    await DB.prepare("UPDATE tasks SET task_date = date(task_date, ?), updated_at = ? WHERE id = ?")
      .bind(`+${days} days`, new Date().toISOString(), id).run();
  } else {
    await DB.prepare("INSERT OR REPLACE INTO completions (task_id, on_date, kind, at) VALUES (?,?,'postponed',datetime('now'))").bind(id, date).run();
  }
  return { ok: true as const };
}

async function workerSave(DB: D1Database, home: string, p: Record<string, unknown>) {
  const w = (p.worker ?? {}) as Partial<Worker>;
  const id = clampNum(w.id, 0, 0, 1e9);
  if (id) {
    const owner = await DB.prepare("SELECT owner_home FROM workers WHERE id = ?").bind(id).first<{ owner_home: string | null }>();
    if (!owner || owner.owner_home !== home) return { ok: false as const, error: "not-yours" };
  }
  const name = str(w.name, "Worker", 80) || "Worker";
  const trade = str(w.trade, "Handyman", 60) || "Handyman";
  const location = str(w.location, "", 60);
  const phone = str(w.phone, "", 40);
  const email = str(w.email, "", 120);
  const exp = clampNum(w.experience_years, 0, 0, 60);
  const bio = str(w.bio, "", 1000);
  const video = str(w.video_url, "", 500);
  const status = ["available", "busy", "offline"].includes(str(w.status, "available", 12)) ? str(w.status, "available", 12) : "available";
  const availability = ["now", "today", "week"].includes(str(w.availability, "now", 10)) ? str(w.availability, "now", 10) : "now";
  const rate = str(w.rate, "", 40);
  if (id) {
    await DB.prepare(
      `UPDATE workers SET name=?, trade=?, location=?, phone=?, email=?, experience_years=?, bio=?, video_url=?, status=?, availability=?, rate=? WHERE id=?`,
    ).bind(name, trade, location, phone, email, exp, bio, video, status, availability, rate, id).run();
  } else {
    await DB.prepare(
      `INSERT INTO workers (owner_home, name, trade, location, phone, email, experience_years, bio, video_url, status, availability, rate) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)`,
    ).bind(home, name, trade, location, phone, email, exp, bio, video, status, availability, rate).run();
  }
  return syncAll(DB, home);
}

async function workerDelete(DB: D1Database, home: string, p: Record<string, unknown>) {
  const id = clampNum(p.id, 0, 0, 1e9);
  const owner = await DB.prepare("SELECT owner_home FROM workers WHERE id = ?").bind(id).first<{ owner_home: string | null }>();
  if (!owner || owner.owner_home !== home) return { ok: false as const, error: "not-yours" };
  await DB.prepare("DELETE FROM reviews WHERE worker_id = ?").bind(id).run();
  await DB.prepare("DELETE FROM workers WHERE id = ?").bind(id).run();
  return syncAll(DB, home);
}

async function workerStatus(DB: D1Database, p: Record<string, unknown>) {
  const id = clampNum(p.id, 0, 0, 1e9);
  const status = ["available", "busy", "offline"].includes(str(p.status, "available", 12)) ? str(p.status, "available", 12) : "available";
  const availability = ["now", "today", "week"].includes(str(p.availability, "now", 10)) ? str(p.availability, "now", 10) : "now";
  await DB.prepare("UPDATE workers SET status = ?, availability = ? WHERE id = ?").bind(status, availability, id).run();
  return { ok: true as const };
}

async function reviewAdd(DB: D1Database, home: string, p: Record<string, unknown>) {
  const workerId = clampNum(p.workerId, 0, 1, 1e9);
  const rating = clampNum(p.rating, 5, 1, 5);
  const text = str(p.text, "", 600);
  const byName = str(p.byName, "Guest", 60) || "Guest";
  await DB.prepare("INSERT INTO reviews (worker_id, home_id, by_name, rating, text) VALUES (?,?,?,?,?)")
    .bind(workerId, home, byName, rating, text).run();
  return syncAll(DB, home);
}

async function feedbackAdd(DB: D1Database, home: string, p: Record<string, unknown>) {
  const rating = clampNum(p.rating, 5, 1, 5);
  const text = str(p.text, "", 2000);
  await DB.prepare("INSERT INTO feedback (home_id, rating, text) VALUES (?,?,?)").bind(home, rating, text).run();
  return syncAll(DB, home);
}

async function mindAdd(DB: D1Database, home: string, p: Record<string, unknown>) {
  const kind = str(p.kind, "meditation", 20) === "sleep" ? "sleep" : "meditation";
  const minutes = clampNum(p.minutes, 5, 1, 1440);
  const mood = p.mood == null ? null : clampNum(p.mood, 3, 1, 5);
  const note = str(p.note, "", 200);
  await DB.prepare("INSERT INTO mind_log (home_id, kind, minutes, mood, note) VALUES (?,?,?,?,?)")
    .bind(home, kind, minutes, mood, note).run();
  return syncAll(DB, home);
}

async function mindDelete(DB: D1Database, home: string, p: Record<string, unknown>) {
  const id = clampNum(p.id, 0, 1, 1e9);
  await DB.prepare("DELETE FROM mind_log WHERE id = ? AND home_id = ?").bind(id, home).run();
  return syncAll(DB, home);
}

/* ---------------- accounts ---------------- */

async function handleAccount(
  DB: D1Database, op: string, payload: unknown, home: string | undefined,
): Promise<{ ok: true; data: { token: string; account_email: string } } | { ok: false; error: string }> {
  const p = (payload ?? {}) as Record<string, unknown>;
  const email = str(p.email, "", 200).toLowerCase();
  const passcode = str(p.passcode, "", 200);
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return { ok: false, error: "bad-email" };
  if (passcode.length < 6) return { ok: false, error: "short-passcode" };
  const hash = await sha256(passcode);

  if (op === "account_signup") {
    const deviceHome = home && HOME_RE.test(home) ? home : null;
    if (!deviceHome) return { ok: false, error: "invalid-home" };
    const existing = await DB.prepare("SELECT 1 FROM accounts WHERE email = ?").bind(email).first();
    if (existing) return { ok: false, error: "email-exists" };
    await DB.prepare("INSERT INTO accounts (email, home_id, passcode_hash) VALUES (?,?,?)").bind(email, deviceHome, hash).run();
    const token = crypto.randomUUID();
    await DB.prepare("INSERT INTO sessions (token, home_id) VALUES (?,?)").bind(token, deviceHome).run();
    return { ok: true, data: { token, account_email: email } };
  }

  // login
  const row = await DB.prepare("SELECT home_id, passcode_hash FROM accounts WHERE email = ?").bind(email).first<{ home_id: string; passcode_hash: string }>();
  if (!row || row.passcode_hash !== hash) return { ok: false, error: "wrong-credentials" };
  const token = crypto.randomUUID();
  await DB.prepare("INSERT INTO sessions (token, home_id) VALUES (?,?)").bind(token, row.home_id).run();
  return { ok: true, data: { token, account_email: email } };
}