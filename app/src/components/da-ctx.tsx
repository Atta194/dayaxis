/* Shared context for all DayAxis views. */
import { createContext, useContext } from "react";

import type { DaAct } from "../lib/da-client";
import type { HomeData, Lang } from "../lib/da-types";

export interface DaCtx {
  data: HomeData;
  act: DaAct;
  lang: Lang;
  t: (key: string) => string;
  toast: (msg: string, kind?: "ok" | "info" | "warn") => void;
  setLang(l: Lang): void;
  setView(v: string): void;
  memberId: number | null;
  setMemberId(id: number | null): void;
  theme: "light" | "dark";
  setTheme(t: "light" | "dark"): void;
  viewMode: "cards" | "list" | "compact";
  setViewMode(m: "cards" | "list" | "compact"): void;
  celebrate(): void;
  refresh(): void;
}

export const DaCtx = createContext<DaCtx | null>(null);
export function useCtx(): DaCtx {
  const c = useContext(DaCtx);
  if (!c) throw new Error("useCtx outside provider");
  return c;
}

export const memberName = (data: HomeData, id: number | null): string => {
  if (id == null) return "Guest";
  const m = data.members.find((x) => x.id === id);
  return m ? m.name : "Guest";
};

export const memberColor = (data: HomeData, id: number | null): string => {
  if (id == null) return "#8b9891";
  return data.members.find((x) => x.id === id)?.color ?? "#8b9891";
};