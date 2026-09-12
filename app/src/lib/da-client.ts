/* DayAxis client data layer - wraps the server endpoint, holds app state. */
import { useCallback, useEffect, useMemo, useState } from "react";

import { da } from "./api/dayaxis.functions";
import { LS, lsGet, lsSet, uid } from "./da-types";
import type { HomeData, Task } from "./da-types";

export type DaResult =
  | { ok: true; data?: HomeData | Record<string, unknown> }
  | { ok: false; error: string };

export function isDaError(res: DaResult): res is Extract<DaResult, { ok: false }> {
  return res.ok === false;
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
  addMember(name: string, color: string): Promise<DaResult>;
  renameMember(id: number, name: string): Promise<DaResult>;
  saveWorker(w: Record<string, unknown>): Promise<DaResult>;
  deleteWorker(id: number): Promise<DaResult>;
  setWorkerStatus(id: number, status: string, availability: string): Promise<DaResult>;
  addReview(workerId: number, rating: number, text: string, byName: string): Promise<DaResult>;
  sendFeedback(rating: number, text: string): Promise<DaResult>;
  signup(email: string, passcode: string): Promise<DaResult>;
  login(email: string, passcode: string): Promise<DaResult>;
}

export function useDa() {
  const [data, setData] = useState<HomeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "network");
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
      }
      return res;
    } catch (e) {
      setError(e instanceof Error ? e.message : "network");
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
      addMember: async (name, color) => call("member_add", { name, color }),
      renameMember: async (id, name) => call("member_rename", { id, name }),
      saveWorker: async (w) => call("worker_save", { worker: w }),
      deleteWorker: async (id) => call("worker_delete", { id }),
      setWorkerStatus: async (id, status, availability) => call("worker_status", { id, status, availability }),
      addReview: async (workerId, rating, text, byName) => call("review_add", { workerId, rating, text, byName }),
      sendFeedback: async (rating, text) => call("feedback_add", { rating, text }),
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

  return { data, loading, error, refresh, call, act };
}