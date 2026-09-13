/* DayAxis - Stripe webhook: activates subscriptions after payment. Server-only. */
import { createAPIFileRoute } from "@tanstack/react-start/api";

import { bindings } from "../lib/bindings.server";

const PLAN_DAYS: Record<string, number> = { weekly: 7, monthly: 30, yearly: 365 };

export const APIRoute = createAPIFileRoute("/api/stripe-webhook")({
  POST: async ({ request }: { request: Request }) => {
    const { DB, STRIPE_WEBHOOK_SECRET } = bindings();
    if (!DB) return new Response("no-db", { status: 500 });
    if (!STRIPE_WEBHOOK_SECRET) return new Response("webhook not configured", { status: 400 });

    const raw = await request.text();
    const sig = request.headers.get("stripe-signature") ?? "";
    if (sig !== STRIPE_WEBHOOK_SECRET && !sig.includes(STRIPE_WEBHOOK_SECRET)) {
      return new Response("bad-signature", { status: 400 });
    }

    let payload: { type?: string; data?: { object?: { metadata?: Record<string, string> } } };
    try {
      payload = JSON.parse(raw);
    } catch {
      return new Response("bad-json", { status: 400 });
    }

    if (payload.type === "checkout.session.completed") {
      const meta = payload.data?.object?.metadata ?? {};
      const home = meta.home_id ?? "";
      const plan = PLAN_DAYS[meta.plan ?? ""] ? (meta.plan as string) : "";
      if (home && plan) {
        await DB.prepare(
          `INSERT INTO subscriptions (home_id, plan, status, started_at, expires_at, updated_at)
           VALUES (?, ?, 'active', datetime('now'), datetime('now', ?), datetime('now'))
           ON CONFLICT(home_id) DO UPDATE SET plan=excluded.plan, status='active',
             started_at=excluded.started_at, expires_at=excluded.expires_at, updated_at=datetime('now')`,
        ).bind(home, plan, `+${PLAN_DAYS[plan]} days`).run();
      }
    }

    return new Response("ok", { status: 200 });
  },
});