/* DayAxis server API - one endpoint, many operations. Server-only (D1). */
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import type { D1Database } from "@cloudflare/workers-types";

import { bindings } from "../bindings.server";
import type { Ad, Cat, Feedback, HomeData, Member, MindLog, Review, Subscription, Task, Worker } from "../da-types";

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

async function isHomeOwner(DB: D1Database, home: string, memberId: unknown): Promise<boolean> {
  const id = clampNum(memberId, 0, 1, 1e9);
  const row = await DB.prepare("SELECT is_owner FROM members WHERE id = ? AND home_id = ?").bind(id, home).first<{ is_owner: number }>();
  return row?.is_owner === 1;
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

    if (data.op === "account_login" || data.op === "account_signup" || data.op === "google_auth_start" || data.op === "google_auth_callback") {
      return handleAccount(DB, data.op, data.payload, data.home, data.auth);
    }

    const sessRow = data.auth
      ? await DB.prepare("SELECT home_id FROM sessions WHERE token = ?").bind(data.auth).first<{ home_id: string }>()
      : null;
    const isSession = sessRow != null;
    const home = sessRow ? sessRow.home_id : data.home && HOME_RE.test(data.home) ? data.home : null;
    if (!home) return { ok: false as const, error: "invalid-home" };

    // Personal features require a real account session - anonymous devices cannot mutate.
    const GATED = new Set([
      "task_save", "task_delete", "task_restore", "complete", "postpone",
      "member_add", "member_rename", "member_delete",
      "worker_save", "worker_delete", "worker_approve",
      "ad_add", "ad_delete", "mind_add", "mind_delete",
      "account_change_password",
    ]);
    if (GATED.has(data.op) && !isSession) return { ok: false as const, error: "auth-required" };

    const p = (data.payload ?? {}) as Record<string, unknown>;

    try {
      switch (data.op) {
        case "sync": return await syncAll(DB, home);
        case "member_add": return await memberAdd(DB, home, p);
        case "member_rename": return await memberRename(DB, home, p);
        case "member_delete": return await memberDelete(DB, home, p);
        case "task_save": return await taskSave(DB, home, p);
        case "task_delete": return await taskDelete(DB, home, p, true);
        case "task_restore": return await taskDelete(DB, home, p, false);
        case "complete": return await complete(DB, p);
        case "postpone": return await postpone(DB, p);
        case "worker_save": return await workerSave(DB, home, p);
        case "worker_delete": return await workerDelete(DB, home, p);
        case "worker_status": return await workerStatus(DB, home, p);
        case "worker_approve": return await workerApprove(DB, home, p);
        case "request_otp": return await requestOtp(DB, p);
        case "verify_otp": return await verifyOtp(DB, home, p);
        case "review_add": return await reviewAdd(DB, home, p);
        case "feedback_add": return await feedbackAdd(DB, home, p);
        case "mind_add": return await mindAdd(DB, home, p);
        case "mind_delete": return await mindDelete(DB, home, p);
        case "plan_start_trial": return await startTrial(DB, home);
        case "plan_subscribe": return await subscribePlan(DB, home, p);
        case "ad_add": return await adAdd(DB, home, p);
        case "ad_delete": return await adDelete(DB, home, p);
        case "ad_click": return await adClick(DB, p);
        case "account_change_password": return await changePassword(DB, home, p);
        case "account_logout": return await logoutAccount(DB, data.auth);
        case "admin_stats": return await adminStats(DB, home);
        case "worker_admin_delete": return await workerAdminDelete(DB, home, p);
        default: return { ok: false as const, error: "unknown-op" };
      }
    } catch (e) {
      return { ok: false as const, error: e instanceof Error ? e.message.slice(0, 200) : "server-error" };
    }
  });

/* ---------------- helpers ---------------- */

async function workersWithReviews(DB: D1Database): Promise<{ workers: Worker[]; reviews: Review[] }> {
  const [ws, rs] = await Promise.all([
    DB.prepare("SELECT * FROM workers WHERE approved = 1 ORDER BY jobs_done DESC").all<Worker & { rating?: number }>(),
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
  const isOwnerH = (await DB.prepare("SELECT 1 FROM members WHERE home_id = ? AND is_owner = 1").bind(home).first()) !== null;
  const [m, t, c, f, a, ww, mind, sub, ads, pending] = await Promise.all([
    DB.prepare("SELECT * FROM members WHERE home_id = ? ORDER BY id").bind(home).all<Member>(),
    DB.prepare("SELECT * FROM tasks WHERE home_id = ? AND status IN ('active','deleted') ORDER BY created_at DESC").bind(home).all<Task>(),
    DB.prepare("SELECT * FROM completions WHERE task_id IN (SELECT id FROM tasks WHERE home_id = ?) ORDER BY on_date DESC").bind(home).all(),
    DB.prepare("SELECT * FROM feedback WHERE home_id = ? ORDER BY id DESC LIMIT 200").bind(home).all<Feedback>(),
    DB.prepare("SELECT email, role, phone_verified FROM accounts WHERE home_id = ? LIMIT 1").bind(home).first<{ email: string; role: string; phone_verified: number }>(),
    workersWithReviews(DB),
    DB.prepare("SELECT * FROM mind_log WHERE home_id = ? ORDER BY id DESC LIMIT 300").bind(home).all<MindLog>(),
    DB.prepare("SELECT * FROM subscriptions WHERE home_id = ?").bind(home).first<Subscription>(),
    DB.prepare("SELECT * FROM ads WHERE home_id = ? AND active = 1 ORDER BY id DESC").bind(home).all<Ad>(),
    isOwnerH
      ? DB.prepare("SELECT * FROM workers WHERE approved = 0 ORDER BY id ASC").all<Worker>()
      : Promise.resolve({ results: [] as Worker[] }),
  ]);
  const my = ww.workers.filter((w) => w.owner_home === home);
  return {
    ok: true,
    data: {
      home_id: home,
      members: (m.results ?? []).map((x) => ({ ...x }) as Member),
      tasks: (t.results ?? []).map((x) => ({ ...x, checklist: JSON.parse(String(x.checklist ?? "[]")) }) as Task),
      completions: (c.results ?? []).map((r) => ({ task_id: r.task_id as string, on_date: r.on_date as string, kind: (r.kind as "done" | "postponed") })),
      feedback: f.results ?? [],
      mind_log: (mind.results ?? []).map((x) => ({
        id: x.id, home_id: x.home_id, kind: x.kind as "meditation" | "sleep",
        minutes: x.minutes, mood: x.mood, note: x.note, at: x.at,
      })),
      subscription: sub ?? null,
      ads: ads.results ?? [],
      pending_workers: isOwnerH ? (pending.results ?? []).map((x) => ({ ...x, rating: 0, review_count: 0 }) as Worker) : [],
      workers: ww.workers,
      reviews: ww.reviews,
      my_workers: my,
      account_email: a?.email ?? null,
      account_role: a?.role === "admin" ? "admin" : a?.role === "user" ? "user" : null,
      account_phone_verified: a?.phone_verified ?? 0,
    },
  };
}

async function memberAdd(DB: D1Database, home: string, p: Record<string, unknown>) {
  if (!(await isHomeOwner(DB, home, p.memberId))) return { ok: false as const, error: "owner-only" };
  const count = await DB.prepare("SELECT COUNT(*) AS n FROM members WHERE home_id = ?").bind(home).first<{ n: number }>();
  if (count && count.n! >= 5) return { ok: false as const, error: "max-guests" };
  const name = str(p.name, "Guest", 60) || "Guest";
  const color = str(p.color, "#1E7A6B", 9) || "#1E7A6B";
  await DB.prepare("INSERT INTO members (home_id, name, color, is_owner) VALUES (?,?,?,0)").bind(home, name, color).run();
  return syncAll(DB, home);
}

async function memberRename(DB: D1Database, home: string, p: Record<string, unknown>) {
  if (!(await isHomeOwner(DB, home, p.memberId))) return { ok: false as const, error: "owner-only" };
  const id = clampNum(p.id, 0, 1, 1e9);
  const name = str(p.name, "Guest", 60) || "Guest";
  await DB.prepare("UPDATE members SET name = ? WHERE id = ? AND home_id = ?").bind(name, id, home).run();
  return syncAll(DB, home);
}

async function memberDelete(DB: D1Database, home: string, p: Record<string, unknown>) {
  if (!(await isHomeOwner(DB, home, p.memberId))) return { ok: false as const, error: "owner-only" };
  const id = clampNum(p.id, 0, 1, 1e9);
  const target = await DB.prepare("SELECT is_owner FROM members WHERE id = ? AND home_id = ?").bind(id, home).first<{ is_owner: number }>();
  if (!target) return { ok: false as const, error: "no-member" };
  if (target.is_owner === 1) return { ok: false as const, error: "owner-protected" };
  await DB.prepare("DELETE FROM members WHERE id = ? AND home_id = ?").bind(id, home).run();
  await DB.prepare("UPDATE tasks SET member_id = NULL WHERE member_id = ? AND home_id = ?").bind(id, home).run();
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
  const photo = str(w.photo, "", 200000);
  const status = ["available", "busy", "offline"].includes(str(w.status, "available", 12)) ? str(w.status, "available", 12) : "available";
  const availability = ["now", "today", "week"].includes(str(w.availability, "now", 10)) ? str(w.availability, "now", 10) : "now";
  const rate = str(w.rate, "", 40);
  if (id) {
    await DB.prepare(
      `UPDATE workers SET name=?, trade=?, location=?, phone=?, email=?, experience_years=?, bio=?, video_url=?, photo=?, status=?, availability=?, rate=? WHERE id=?`,
    ).bind(name, trade, location, phone, email, exp, bio, video, photo, status, availability, rate, id).run();
  } else {
    const isOwner = (await DB.prepare("SELECT 1 FROM members WHERE home_id = ? AND is_owner = 1").bind(home).first()) !== null;
    await DB.prepare(
      `INSERT INTO workers (owner_home, name, trade, location, phone, email, experience_years, bio, video_url, photo, status, availability, rate, approved)
       VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
    ).bind(home, name, trade, location, phone, email, exp, bio, video, photo, status, availability, rate, isOwner ? 1 : 0).run();
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

async function workerStatus(DB: D1Database, home: string, p: Record<string, unknown>) {
  const id = clampNum(p.id, 0, 0, 1e9);
  const status = ["available", "busy", "offline"].includes(str(p.status, "available", 12)) ? str(p.status, "available", 12) : "available";
  const availability = ["now", "today", "week"].includes(str(p.availability, "now", 10)) ? str(p.availability, "now", 10) : "now";
  await DB.prepare("UPDATE workers SET status = ?, availability = ? WHERE id = ?").bind(status, availability, id).run();
  return syncAll(DB, home);
}

async function workerApprove(DB: D1Database, home: string, p: Record<string, unknown>) {
  if (!(await isHomeOwner(DB, home, p.memberId)) && !(await isAdminAccount(DB, home))) return { ok: false as const, error: "owner-only" };
  const id = clampNum(p.id, 0, 1, 1e9);
  const approve = p.approve === true ? 1 : -1;
  await DB.prepare("UPDATE workers SET approved = ? WHERE id = ?").bind(approve, id).run();
  return syncAll(DB, home);
}

async function requestOtp(DB: D1Database, p: Record<string, unknown>) {
  const phone = str(p.phone, "", 40);
  if (phone.length < 5) return { ok: false as const, error: "bad-phone" };
  const code = String(Math.floor(100000 + Math.random() * 900000));
  await DB.prepare(
    `INSERT INTO otp (phone, code, expires_at, created_at) VALUES (?, ?, datetime('now','+10 minutes'), datetime('now'))
     ON CONFLICT(phone) DO UPDATE SET code=excluded.code, expires_at=excluded.expires_at, created_at=datetime('now')`,
  ).bind(phone, code).run();
  return { ok: true as const, data: { sms: false, code } };
}

async function verifyOtp(DB: D1Database, home: string, p: Record<string, unknown>) {
  const phone = str(p.phone, "", 40);
  const code = str(p.code, "", 10);
  const row = await DB.prepare("SELECT code FROM otp WHERE phone = ? AND expires_at > datetime('now')").bind(phone).first<{ code: string }>();
  if (!row || row.code !== code) return { ok: false as const, error: "bad-otp" };
  await DB.prepare("UPDATE workers SET phone_verified = 1 WHERE owner_home = ? AND phone = ?").bind(home, phone).run();
  await DB.prepare("UPDATE accounts SET phone = ?, phone_verified = 1 WHERE home_id = ?").bind(phone, home).run();
  await DB.prepare("DELETE FROM otp WHERE phone = ?").bind(phone).run();
  return syncAll(DB, home);
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

/* ---------------- subscriptions & ads ---------------- */

// Plans are dormant during the public-test month; flip to true to activate.
const PLANS_ACTIVE = false;

async function startTrial(DB: D1Database, home: string) {
  if (!PLANS_ACTIVE) return { ok: false as const, error: "plans-disabled" };
  await DB.prepare(
    `INSERT INTO subscriptions (home_id, plan, status, started_at, expires_at, updated_at)
     VALUES (?, 'trial', 'active', datetime('now'), datetime('now','+7 days'), datetime('now'))
     ON CONFLICT(home_id) DO UPDATE SET plan='trial', status='active',
       started_at=datetime('now'), expires_at=datetime('now','+7 days'), updated_at=datetime('now')`,
  ).bind(home).run();
  return syncAll(DB, home);
}

const PLAN_PRICES: Record<string, number> = { weekly: 195, monthly: 445, yearly: 3000 }; // USD cents

async function subscribePlan(DB: D1Database, home: string, p: Record<string, unknown>) {
  if (!PLANS_ACTIVE) return { ok: false as const, error: "plans-disabled" };
  const plan = ["weekly", "monthly", "yearly"].includes(str(p.plan, "", 12)) ? str(p.plan, "", 12) : null;
  if (!plan) return { ok: false as const, error: "bad-plan" };
  const { STRIPE_SECRET_KEY } = bindings();
  if (!STRIPE_SECRET_KEY) {
    return {
      ok: false as const,
      error: "payment-not-configured",
      data: { message: "Payments are ready to connect - add the Stripe key in Settings and checkout will open here automatically." },
    };
  }
  const origin = typeof p.origin === "string" && /^https:\/\//.test(p.origin) ? p.origin : "https://dayaxis.higgsfield.app";
  const res = await fetch("https://api.stripe.com/v1/checkout/sessions", {
    method: "POST",
    headers: { Authorization: `Bearer ${STRIPE_SECRET_KEY}`, "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      mode: "payment",
      "line_items[0][quantity]": "1",
      "line_items[0][price_data][currency]": "usd",
      "line_items[0][price_data][unit_amount]": String(PLAN_PRICES[plan]),
      "line_items[0][price_data][product_data][name]": `DayAxis - ${plan} plan`,
      success_url: `${origin}/?checkout=success`,
      cancel_url: `${origin}/?checkout=cancel`,
      "metadata[home_id]": home,
      "metadata[plan]": plan,
    }).toString(),
  });
  const json = (await res.json()) as { url?: string; error?: { message?: string } };
  if (!res.ok || !json.url) {
    return { ok: false as const, error: "stripe-error", data: { message: json.error?.message ?? "Checkout could not be created." } };
  }
  await DB.prepare(
    `INSERT INTO subscriptions (home_id, plan, status, started_at, updated_at)
     VALUES (?, ?, 'pending', datetime('now'), datetime('now'))
     ON CONFLICT(home_id) DO UPDATE SET plan=excluded.plan, status='pending', updated_at=datetime('now')`,
  ).bind(home, plan).run();
  return { ok: true as const, data: { url: json.url, plan } };
}

async function adAdd(DB: D1Database, home: string, p: Record<string, unknown>) {
  const title = str(p.title, "Sponsor", 80) || "Sponsor";
  const tagline = str(p.tagline, "", 160);
  const link = str(p.link, "", 500);
  if (!/^https?:\/\//.test(link)) return { ok: false as const, error: "bad-link" };
  await DB.prepare("INSERT INTO ads (home_id, title, tagline, link) VALUES (?,?,?,?)")
    .bind(home, title, tagline, link).run();
  return syncAll(DB, home);
}

async function adDelete(DB: D1Database, home: string, p: Record<string, unknown>) {
  const id = clampNum(p.id, 0, 1, 1e9);
  await DB.prepare("DELETE FROM ads WHERE id = ? AND home_id = ?").bind(id, home).run();
  return syncAll(DB, home);
}

async function adClick(DB: D1Database, p: Record<string, unknown>) {
  const id = clampNum(p.id, 0, 1, 1e9);
  await DB.prepare("UPDATE ads SET clicks = clicks + 1 WHERE id = ?").bind(id).run();
  return { ok: true as const };
}

/* ---------------- accounts ---------------- */

async function handleAccount(
  DB: D1Database, op: string, payload: unknown, home: string | undefined, auth: string | undefined,
): Promise<
  | { ok: true; data: { token: string; account_email: string; account_role: "user" | "admin" } }
  | { ok: true; data: { url: string } }
  | { ok: false; error: string; data?: Record<string, unknown> }
> {
  const p = (payload ?? {}) as Record<string, unknown>;

  if (op === "google_auth_start") {
    const { GOOGLE_CLIENT_ID } = bindings();
    if (!GOOGLE_CLIENT_ID) {
      return { ok: false as const, error: "google-not-configured", data: { message: "Sign in with Google is wired and ready - connect the Google OAuth client ID in Settings to enable it." } };
    }
    const origin = typeof p.origin === "string" && /^https:\/\//.test(p.origin) ? p.origin : "https://dayaxis.higgsfield.app";
    const params = new URLSearchParams({
      client_id: GOOGLE_CLIENT_ID,
      redirect_uri: `${origin}/?social=google`,
      response_type: "code",
      scope: "openid email profile",
      prompt: "select_account",
    });
    return { ok: true as const, data: { url: `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}` } };
  }

  if (op === "google_auth_callback") {
    const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } = bindings();
    if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
      return { ok: false as const, error: "google-not-configured", data: { message: "Google sign-in needs the OAuth client ID and secret in Settings." } };
    }
    const code = str(p.code, "", 500);
    const origin = typeof p.origin === "string" && /^https:\/\//.test(p.origin) ? p.origin : "https://dayaxis.higgsfield.app";
    const tok = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code, client_id: GOOGLE_CLIENT_ID, client_secret: GOOGLE_CLIENT_SECRET,
        redirect_uri: `${origin}/?social=google`, grant_type: "authorization_code",
      }).toString(),
    });
    const tokenJson = (await tok.json()) as { access_token?: string };
    if (!tok.ok || !tokenJson.access_token) return { ok: false as const, error: "google-error" };
    const ui = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
      headers: { Authorization: `Bearer ${tokenJson.access_token}` },
    });
    const me = (await ui.json()) as { email?: string; name?: string };
    const gmail = (me.email ?? "").toLowerCase();
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(gmail)) return { ok: false as const, error: "google-error" };
    let row = await DB.prepare("SELECT home_id, role FROM accounts WHERE email = ?").bind(gmail).first<{ home_id: string; role: string }>();
    if (!row) {
      const found = await DB.prepare("SELECT COUNT(*) AS n FROM accounts").first<{ n: number }>();
      const role = found && found.n! === 0 ? "admin" : "user";
      const newHome = `da-${crypto.randomUUID()}`;
      await DB.prepare("INSERT INTO accounts (email, home_id, passcode_hash, role) VALUES (?,?,?,?)").bind(gmail, newHome, "", role).run();
      await DB.prepare("INSERT INTO homes (id) VALUES (?)").bind(newHome).run();
      await DB.prepare("INSERT INTO members (home_id, name, color, is_owner) VALUES (?,?,?,1)").bind(newHome, me.name?.slice(0, 60) || "Owner", "#1E7A6B").run();
      row = { home_id: newHome, role };
    }
    const token = crypto.randomUUID();
    await DB.prepare("INSERT INTO sessions (token, home_id) VALUES (?,?)").bind(token, row.home_id).run();
    return { ok: true as const, data: { token, account_email: gmail, account_role: row.role === "admin" ? "admin" : "user" } };
  }

  const email = str(p.email, "", 200).toLowerCase();
  const passcode = str(p.passcode, "", 200);
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return { ok: false as const, error: "bad-email" };
  if (passcode.length < 6) return { ok: false as const, error: "short-passcode" };
  const hash = await sha256(passcode);

  if (op === "account_signup") {
    const deviceHome = home && HOME_RE.test(home) ? home : null;
    if (!deviceHome) return { ok: false as const, error: "invalid-home" };
    const existing = await DB.prepare("SELECT 1 FROM accounts WHERE email = ?").bind(email).first();
    if (existing) return { ok: false as const, error: "email-exists" };
    const found = await DB.prepare("SELECT COUNT(*) AS n FROM accounts").first<{ n: number }>();
    const role = found && found.n! === 0 ? "admin" : "user";
    await DB.prepare("INSERT INTO accounts (email, home_id, passcode_hash, role) VALUES (?,?,?,?)").bind(email, deviceHome, hash, role).run();
    const token = crypto.randomUUID();
    await DB.prepare("INSERT INTO sessions (token, home_id) VALUES (?,?)").bind(token, deviceHome).run();
    return { ok: true as const, data: { token, account_email: email, account_role: role } };
  }

  // login
  const row = await DB.prepare("SELECT home_id, passcode_hash, role FROM accounts WHERE email = ?").bind(email).first<{ home_id: string; passcode_hash: string; role: string }>();
  if (!row || row.passcode_hash !== hash) return { ok: false as const, error: "wrong-credentials" };
  const token2 = crypto.randomUUID();
  await DB.prepare("INSERT INTO sessions (token, home_id) VALUES (?,?)").bind(token2, row.home_id).run();
  return { ok: true as const, data: { token: token2, account_email: email, account_role: row.role === "admin" ? "admin" : "user" } };
}

async function isAdminAccount(DB: D1Database, home: string): Promise<boolean> {
  const r = await DB.prepare("SELECT role FROM accounts WHERE home_id = ?").bind(home).first<{ role: string }>();
  return r?.role === "admin";
}

async function changePassword(DB: D1Database, home: string, p: Record<string, unknown>) {
  const acc = await DB.prepare("SELECT passcode_hash FROM accounts WHERE home_id = ?").bind(home).first<{ passcode_hash: string }>();
  if (!acc) return { ok: false as const, error: "auth-required" };
  const oldHash = await sha256(str(p.old, "", 200));
  if (acc.passcode_hash !== oldHash) return { ok: false as const, error: "wrong-credentials" };
  const newPw = str(p.new, "", 200);
  if (newPw.length < 6) return { ok: false as const, error: "short-passcode" };
  await DB.prepare("UPDATE accounts SET passcode_hash = ? WHERE home_id = ?").bind(await sha256(newPw), home).run();
  return syncAll(DB, home);
}

async function logoutAccount(DB: D1Database, auth: string | undefined) {
  if (auth) await DB.prepare("DELETE FROM sessions WHERE token = ?").bind(auth).run();
  return { ok: true as const };
}

async function adminStats(DB: D1Database, home: string) {
  if (!(await isAdminAccount(DB, home))) return { ok: false as const, error: "admin-only" };
  const [accounts, homes, tasks, workers, pendingW, reviews, feedback, adsClicks, subs, week] = await Promise.all([
    DB.prepare("SELECT COUNT(*) AS n FROM accounts").first<{ n: number }>(),
    DB.prepare("SELECT COUNT(*) AS n FROM homes").first<{ n: number }>(),
    DB.prepare("SELECT COUNT(*) AS n FROM tasks").first<{ n: number }>(),
    DB.prepare("SELECT COUNT(*) AS n FROM workers").first<{ n: number }>(),
    DB.prepare("SELECT COUNT(*) AS n FROM workers WHERE approved = 0").first<{ n: number }>(),
    DB.prepare("SELECT COUNT(*) AS n FROM reviews").first<{ n: number }>(),
    DB.prepare("SELECT COUNT(*) AS n, AVG(rating) AS avg FROM feedback").first<{ n: number; avg: number | null }>(),
    DB.prepare("SELECT COALESCE(SUM(clicks),0) AS n FROM ads").first<{ n: number }>(),
    DB.prepare("SELECT COUNT(*) AS n FROM subscriptions WHERE status = 'active'").first<{ n: number }>(),
    DB.prepare("SELECT on_date, COUNT(*) AS n FROM completions WHERE on_date >= date('now','-6 days') GROUP BY on_date ORDER BY on_date").all<{ on_date: string; n: number }>(),
  ]);
  return {
    ok: true as const,
    data: {
      accounts: accounts?.n ?? 0, homes: homes?.n ?? 0, tasks: tasks?.n ?? 0,
      workers: workers?.n ?? 0, pending: pendingW?.n ?? 0, reviews: reviews?.n ?? 0,
      feedback: feedback?.n ?? 0, feedback_avg: feedback?.avg ? Math.round(feedback.avg * 10) / 10 : 0,
      ads_clicks: adsClicks?.n ?? 0, active_subs: subs?.n ?? 0,
      week: (week.results ?? []).map((r) => ({ d: r.on_date, n: r.n })),
    },
  };
}

async function workerAdminDelete(DB: D1Database, home: string, p: Record<string, unknown>) {
  if (!(await isAdminAccount(DB, home))) return { ok: false as const, error: "admin-only" };
  const id = clampNum(p.id, 0, 1, 1e9);
  await DB.prepare("DELETE FROM reviews WHERE worker_id = ?").bind(id).run();
  await DB.prepare("DELETE FROM workers WHERE id = ?").bind(id).run();
  return syncAll(DB, home);
}