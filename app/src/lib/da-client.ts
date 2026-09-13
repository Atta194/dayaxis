/* DayAxis client data layer - wraps the server endpoint, holds app state. */
import { useCallback, useEffect, useMemo, useState } from "react";

import { da } from "./api/dayaxis.functions";
import { LS, lsGet, lsSet, uid } from "./da-types";
import type { HomeData, Task } from "./da-types";

export type DaResult =
  | { ok: true; data?: HomeData | Record<string, unknown> }
  | { ok: false; error: string; data?: Record<string, unknown> };

export function isDaError(res: DaResult): res is Extract<DaResult, { ok: false }> {
  return res.ok === false;
}

function loadCache(): HomeData | null {
  try {
    const raw = lsGet(LS.cache);
    if (!raw) return null;
    const o = JSON.parse(raw) as HomeData;
    return o && o.home_id ? o : null;
  } catch {
    return null;
  }
}

export function deviceId(): string {
  if (typeof window === "undefined") return "da-server";
  let d = lsGet(LS.device);
  if (!d || d.length < 16) {
    d = `da-${uid()}`;
    lsSet(LS.device, d);
  }
  return d;
}

export async function daCall(op: string, payload: Record<string, unknown> = {}): Promise<DaResult> {
  const device = deviceId();
  const res = await da({
    data: { op, auth: lsGet(LS.session) || device, home: device, payload },
  });
  return res as DaResult;
}

export interface DaAct {
  addTask(t: Partial<Task> & { title: string }): Promise<DaResult>;
  updateTask(t: Partial<Task>): Promise<DaResult>;
  complete(id: string, date: string, done: boolean): Promise<DaResult>;
  postponeTask(id: string, date: string, days: number): Promise<DaResult>;
  deleteTask(id: string): Promise<DaResult>;
  restoreTask(id: string): Promise<DaResult>;
  addMember(name: string, color: string, memberId: number | null): Promise<DaResult>;
  renameMember(id: number, name: string, memberId: number | null): Promise<DaResult>;
  deleteMember(id: number, memberId: number | null): Promise<DaResult>;
  approveWorker(id: number, approve: boolean, memberId: number | null): Promise<DaResult>;
  requestOtp(phone: string): Promise<DaResult & { data?: { code?: string; sms?: boolean } }>;
  verifyOtp(phone: string, code: string): Promise<DaResult>;
  changePassword(oldPass: string, newPass: string): Promise<DaResult>;
  logout(): Promise<DaResult>;
  adminWorkerDelete(id: number): Promise<DaResult>;
  adminStats(): Promise<DaResult>;
  googleStart(): Promise<DaResult>;
  googleCallback(code: string): Promise<DaResult>;
  addTip(title: string, body: string, cat: string): Promise<DaResult>;
  updateTip(id: number, title: string, body: string): Promise<DaResult>;
  deleteTip(id: number): Promise<DaResult>;
  saveWorker(w: Record<string, unknown>): Promise<DaResult>;
  deleteWorker(id: number): Promise<DaResult>;
  setWorkerStatus(id: number, status: string, availability: string): Promise<DaResult>;
  addReview(workerId: number, rating: number, text: string, byName: string): Promise<DaResult>;
  sendFeedback(rating: number, text: string): Promise<DaResult>;
  mindAdd(kind: "meditation" | "sleep", minutes: number, mood: number | null, note: string): Promise<DaResult>;
  mindDelete(id: number): Promise<DaResult>;
  startTrial(): Promise<DaResult>;
  subscribe(plan: string, origin: string): Promise<DaResult>;
  addAd(title: string, tagline: string, link: string): Promise<DaResult>;
  deleteAd(id: number): Promise<DaResult>;
  clickAd(id: number): Promise<DaResult>;
  signup(email: string, passcode: string): Promise<DaResult>;
  login(email: string, passcode: string): Promise<DaResult>;
}

export function useDa() {
  const [data, setData] = useState<HomeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [offline, setOffline] = useState(false);

  const refresh = useCallback(async () => {
    try {
      const res = await daCall("sync");
      if (isDaError(res)) {
        setError(res.error);
        return;
      }
      if (res.data && "home_id" in res.data) {
        setData(res.data as HomeData);
        setError(null);
        setOffline(false);
        lsSet(LS.cache, JSON.stringify(res.data));
      }
    } catch (e) {
      const cached = loadCache();
      if (cached) {
        setData(cached);
        setOffline(true);
      } else {
        setError(e instanceof Error ? e.message : "network");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const call = useCallback(async (op: string, payload: Record<string, unknown>): Promise<DaResult> => {
    try {
      const res = await daCall(op, payload);
      if (isDaError(res)) {
        setError(res.error);
        return res;
      }
      if (res.data && "home_id" in res.data) {
        setData(res.data as HomeData);
        setOffline(false);
        lsSet(LS.cache, JSON.stringify(res.data));
      }
      return res;
    } catch (e) {
      setError(e instanceof Error ? e.message : "network");
      const cached = loadCache();
      if (cached) {
        setData(cached);
        setOffline(true);
      }
      return { ok: false, error: "network" };
    }
  }, []);

  const act = useMemo<DaAct>(() => {
    return {
      addTask: async (t) => call("task_save", { task: { ...t, id: uid(), home_id: undefined } }),
      updateTask: async (t) => call("task_save", { task: t }),
      complete: async (id, date, done) => {
        const res = await call("complete", { id, date, done });
        // local patch for instant feedback
        setData((prev) => {
          if (!prev) return prev;
          const rest = prev.completions.filter((c) => !(c.task_id === id && c.on_date === date));
          const completions = done
            ? [...rest, { task_id: id, on_date: date, kind: "done" as const }]
            : rest;
          return { ...prev, completions };
        });
        return res;
      },
      postponeTask: async (id, date, days) => {
        const res = await call("postpone", { id, date, days });
        if (!res.ok) return res;
        // one-off postpone moved the date server-side: resync lightweight via refresh
        void refresh();
        return res;
      },
      deleteTask: async (id) => call("task_delete", { id }),
      restoreTask: async (id) => call("task_restore", { id }),
      addMember: async (name, color, memberId) => call("member_add", { name, color, memberId }),
      renameMember: async (id, name, memberId) => call("member_rename", { id, name, memberId }),
      deleteMember: async (id, memberId) => call("member_delete", { id, memberId }),
      approveWorker: async (id, approve, memberId) => call("worker_approve", { id, approve, memberId }),
      requestOtp: async (phone) => call("request_otp", { phone }),
      verifyOtp: async (phone, code) => call("verify_otp", { phone, code }),
      changePassword: async (oldPass, newPass) => call("account_change_password", { old: oldPass, new: newPass }),
      logout: async () => {
        const res = await call("account_logout", {});
        lsSet(LS.session, "");
        void refresh();
        return res.ok ? { ok: true as const } : res;
      },
      adminWorkerDelete: async (id) => call("worker_admin_delete", { id }),
      adminStats: async () => call("admin_stats", {}),
      addTip: async (title, body, cat) => call("tip_add", { title, body, cat }),
      updateTip: async (id, title, body) => call("tip_update", { id, title, body }),
      deleteTip: async (id) => call("tip_delete", { id }),
      googleStart: async () => call("google_auth_start", { origin: window.location.origin }),
      googleCallback: async (code) => {
        const res = await call("google_auth_callback", { code, origin: window.location.origin });
        const tkn = res.ok && res.data && "token" in res.data ? String(res.data.token) : "";
        if (tkn) lsSet(LS.session, tkn);
        void refresh();
        return res;
      },
      saveWorker: async (w) => call("worker_save", { worker: w }),
      deleteWorker: async (id) => call("worker_delete", { id }),
      setWorkerStatus: async (id, status, availability) => call("worker_status", { id, status, availability }),
      addReview: async (workerId, rating, text, byName) => call("review_add", { workerId, rating, text, byName }),
      sendFeedback: async (rating, text) => call("feedback_add", { rating, text }),
      mindAdd: async (kind, minutes, mood, note) => call("mind_add", { kind, minutes, mood, note }),
      mindDelete: async (id) => call("mind_delete", { id }),
      startTrial: async () => call("plan_start_trial", {}),
      subscribe: async (plan, origin) => call("plan_subscribe", { plan, origin }),
      addAd: async (title, tagline, link) => call("ad_add", { title, tagline, link }),
      deleteAd: async (id) => call("ad_delete", { id }),
      clickAd: async (id) => call("ad_click", { id }),
      signup: async (email, passcode) => {
        const res = await call("account_signup", { email, passcode });
        const tkn = res.ok && res.data && "token" in res.data ? String(res.data.token) : "";
        if (tkn) lsSet(LS.session, tkn);
        return res;
      },
      login: async (email, passcode) => {
        const res = await call("account_login", { email, passcode });
        const tkn = res.ok && res.data && "token" in res.data ? String(res.data.token) : "";
        if (tkn) lsSet(LS.session, tkn);
        return res;
      },
    };
  }, [call, refresh]);

  return { data, loading, error, offline, refresh, call, act };
}