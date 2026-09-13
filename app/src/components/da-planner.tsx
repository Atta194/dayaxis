/* DayAxis - Planner view: week / month / history + exports. */
import { useMemo, useRef, useState } from "react";

import { useCtx } from "./da-ctx";
import { TaskModal, TaskRow } from "./da-taskmodal";
import { Ic } from "./da-ui";
import {
  downloadHistoryCSV, exportJSON, parseBackup, printReport,
} from "../lib/da-export";
import {
  addDays as addDays2, dkey, occStatus, parseKey, shiftMonth, tasksForDate, todayKey,
} from "../lib/da-types";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export default function Planner() {
  const { data, act, t, lang, toast } = useCtx();
  const [tab, setTab] = useState<"week" | "month" | "history">("week");
  const [sel, setSel] = useState(todayKey());
  const [month, setMonth] = useState(todayKey());
  const [adding, setAdding] = useState(false);
  const [showDeleted, setShowDeleted] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const today = todayKey();
  const wd0 = ["S", "M", "T", "W", "T", "F", "S"];

  // week containing sel (Mon..Sun)
  const weekStart = useMemo(() => {
    const d = parseKey(sel);
    const dow = (d.getDay() + 6) % 7;
    d.setDate(d.getDate() - dow);
    return dkey(d);
  }, [sel]);
  const weekDays = useMemo(() => Array.from({ length: 7 }, (_, i) => addDays2(weekStart, i)), [weekStart]);

  // month grid
  const m = parseKey(month);
  const mFirst = new Date(m.getFullYear(), m.getMonth(), 1);
  const mStartDow = (mFirst.getDay() + 6) % 7;
  const mDays = new Date(m.getFullYear(), m.getMonth() + 1, 0).getDate();
  const mCells = useMemo(() => {
    const cells: (string | null)[] = [];
    for (let i = 0; i < mStartDow; i++) cells.push(null);
    for (let d = 1; d <= mDays; d++) cells.push(dkey(new Date(m.getFullYear(), m.getMonth(), d)));
    return cells;
  }, [month, mStartDow, mDays]);

  const selTasks = tasksForDate(data.tasks, sel);

  // history rows (30 days)
  const history = useMemo(() => {
    const byId = new Map(data.tasks.map((x) => [x.id, x]));
    return [...data.completions]
      .filter((c) => c.on_date >= addDays2(today, -30))
      .sort((a, b) => (a.on_date < b.on_date ? 1 : -1))
      .map((c) => ({ ...c, task: byId.get(c.task_id) }))
      .filter((r) => r.task && r.task.status !== "deleted");
  }, [data, today]);

  const deleted = data.tasks.filter((x) => x.status === "deleted");

  const restore = (file: File) => {
    const reader = new FileReader();
    reader.onload = async () => {
      const bk = parseBackup(String(reader.result ?? ""));
      if (!bk) { toast("backup invalid", "warn"); return; }
      let n = 0;
      for (const tk of bk.tasks) {
        if (!tk || !tk.title) continue;
        await act.updateTask({ ...tk, checklist: Array.isArray(tk.checklist) ? tk.checklist : [] });
        n++;
      }
      toast(`${t("import_json")}: ${n}`);
    };
    reader.readAsText(file);
  };

  return (
    <div>
      <div className="row-b">
        <h1 className="h-display">{t("nav_plan")}</h1>
        <div className="row">
          <div className="row" role="tablist">
            {(["week", "month", "history"] as const).map((k) => (
              <button key={k} className="chip" aria-pressed={tab === k} onClick={() => setTab(k)}>{t(`plan_${k}`)}</button>
            ))}
          </div>
          <button className="btn btn-accent btn-sm" onClick={() => setAdding(true)}><Ic name="plus" /> {t("add")}</button>
        </div>
      </div>

      {tab === "week" ? (
        <>
          <div className="weekstrip mt3">
            {weekDays.map((d) => {
              const list = tasksForDate(data.tasks, d);
              const done = list.filter((x) => occStatus(x, d, data.completions) === "done").length;
              const dd = new Date(d + "T12:00:00");
              return (
                <button key={d} className={`daycell${d === today ? " today" : ""}`} aria-selected={sel === d} onClick={() => setSel(d)}>
                  <span className="dow">{wd0[dd.getDay()]}</span>
                  <span className="dnum">{dd.getDate()}</span>
                  <span className="dbar"><i style={{ width: `${list.length ? (done / list.length) * 100 : 0}%` }} /></span>
                </button>
              );
            })}
          </div>
          <div className="row mt2">
            <button className="btn btn-ghost btn-sm" onClick={() => setSel(addDays2(sel, -7))}><Ic name="left" /> {t("prev")}</button>
            <button className="btn btn-ghost btn-sm" onClick={() => setSel(today)}>{t("today")}</button>
            <button className="btn btn-ghost btn-sm" onClick={() => setSel(addDays2(sel, 7))}>{t("next")} <Ic name="right" /></button>
            <span className="muted small flex1" style={{ textAlign: "right" }}>{new Date(sel + "T12:00:00").toLocaleDateString(lang === "ru" ? "ru-RU" : lang === "hi" ? "hi-IN" : lang === "ur" ? "ur-PK" : lang === "ar" ? "ar" : lang === "es" ? "es-ES" : "en-US", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}</span>
          </div>
          <DayList date={sel} />
        </>
      ) : null}

      {tab === "month" ? (
        <>
          <div className="row-b mt3">
            <div className="row">
              <button className="icon-btn" onClick={() => setMonth(shiftMonth(month, -1))}><Ic name="left" /></button>
              <b>{MONTHS[m.getMonth()]} {m.getFullYear()}</b>
              <button className="icon-btn" onClick={() => setMonth(shiftMonth(month, 1))}><Ic name="right" /></button>
            </div>
            <button className="btn btn-ghost btn-sm" onClick={() => setSel(today)}>{t("today")}</button>
          </div>
          <div className="grid mt2" style={{ gridTemplateColumns: "repeat(7, 1fr)", gap: 5, fontSize: 11.5, textAlign: "center", color: "var(--ink3)", fontWeight: 700 }}>
            {wd0.map((d) => <div key={d}>{d}</div>)}
          </div>
          <div className="monthgrid mt1">
            {mCells.map((d, i) => {
              if (!d) return <div key={i} />;
              const list = tasksForDate(data.tasks, d);
              return (
                <button key={d} className={`mday${d === today ? " today" : ""}`} aria-selected={sel === d} onClick={() => { setSel(d); setTab("week"); }}>
                  <span className="mn tnum">{Number(d.slice(8))}</span>
                  {list.length ? (
                    <span className="mcount">
                      {list.map((x) => {
                        const st = occStatus(x, d, data.completions);
                        return <i key={x.id} className={st === "done" ? "done" : st === "postponed" ? "post" : "pend"} />;
                      }).slice(0, 5)}
                      {list.length > 5 ? <i className="pend" /> : null}
                    </span>
                  ) : null}
                </button>
              );
            })}
          </div>
          <DayList date={sel} />
        </>
      ) : null}

      {tab === "history" ? (
        <>
          <div className="card mt3">
            <div className="row-b">
              <div>
                <h3 className="h-sec">{t("plan_history")}</h3>
                <p className="muted small mt1">{t("history_desc")}</p>
              </div>
            </div>
            <div className="row mt2">
              <button className="btn btn-sm" onClick={() => downloadHistoryCSV(data)}><Ic name="download" /> {t("export_csv")}</button>
              <button className="btn btn-sm" onClick={() => void import("../lib/da-export").then((m) => m.copyCSV(data, toast))}><Ic name="upload" /> {t("open_sheets")}</button>
              <button className="btn btn-sm" onClick={() => printReport(data, lang, `DayAxis ${t("plan_history")}`)}><Ic name="file" /> {t("export_pdf")}</button>
              <button className="btn btn-sm" onClick={() => exportJSON(data)}><Ic name="download" /> {t("export_json")}</button>
              <button className="btn btn-sm" onClick={() => fileRef.current?.click()}><Ic name="upload" /> {t("import_json")}</button>
              <input ref={fileRef} type="file" accept="application/json" style={{ display: "none" }} onChange={(e) => { const f = e.target.files?.[0]; if (f) restore(f); e.target.value = ""; }} />
              <button className="btn btn-sm" onClick={() => void import("../lib/da-export").then((m) => m.composeEmail("DayAxis history export", `DayAxis history for ${today}\n\nDownload CSV/PDF in DayAxis → Plan → History.`))}><Ic name="mail" /> {t("email_export")}</button>
            </div>
            <div className="mt3 scroll-block-lg scroll-x">
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13.5 }} className="tnum">
                <thead>
                  <tr style={{ textAlign: "left", color: "var(--ink2)" }}>
                    <th style={{ padding: "8px 10px" }}>{t("date")}</th>
                    <th style={{ padding: "8px 10px" }}>{t("title")}</th>
                    <th style={{ padding: "8px 10px" }}>{t("category")}</th>
                    <th style={{ padding: "8px 10px" }}>{t("time")}</th>
                    <th style={{ padding: "8px 10px" }}>{t("mark_done")}</th>
                  </tr>
                </thead>
                <tbody>
                  {history.slice(0, 60).map((r) => (
                    <tr key={`${r.task_id}-${r.on_date}`} style={{ borderTop: "1px solid var(--line)" }}>
                      <td style={{ padding: "8px 10px" }}>{r.on_date}</td>
                      <td style={{ padding: "8px 10px" }}>{r.task?.title}</td>
                      <td style={{ padding: "8px 10px" }}><span className="chip chip-tag" data-cat={r.task?.category}>{r.task?.category ? t(`cat_${r.task.category}`) : ""}</span></td>
                      <td style={{ padding: "8px 10px" }}>{r.task?.time}</td>
                      <td style={{ padding: "8px 10px" }}>
                        <span style={{ color: r.kind === "done" ? "var(--ok)" : "var(--gold)", fontWeight: 700 }}>{r.kind}</span>
                      </td>
                    </tr>
                  ))}
                  {history.length === 0 ? (
                    <tr><td colSpan={5} style={{ padding: 20, textAlign: "center", color: "var(--ink3)" }}>{t("empty")}</td></tr>
                  ) : null}
                </tbody>
              </table>
            </div>
          </div>
          <div className="card mt2">
            <div className="row-b">
              <h3 className="h-sec" style={{ fontSize: 15 }}>{t("deleted_tasks")} ({deleted.length})</h3>
              <button className="btn btn-ghost btn-sm" onClick={() => setShowDeleted((s) => !s)}>{showDeleted ? t("close") : t("details")}</button>
            </div>
            {showDeleted ? (
              <div className="mt2" style={{ display: "grid", gap: 8 }}>
                {deleted.length === 0 ? <p className="muted small">{t("empty_deleted")}</p> : null}
                {deleted.map((x) => (
                  <div className="row" key={x.id} style={{ borderBottom: "1px solid var(--line)", paddingBottom: 8 }}>
                    <span className="flex1" style={{ textDecoration: "line-through", color: "var(--ink3)" }}>{x.title}</span>
                    <button className="btn btn-soft btn-sm" onClick={() => { void act.restoreTask(x.id); toast(t("restore")); }}><Ic name="repeat" /> {t("restore")}</button>
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        </>
      ) : null}

      {adding ? <TaskModal onClose={() => setAdding(false)} presetDate={sel} /> : null}
    </div>
  );

  function DayList({ date }: { date: string }) {
    const list = tasksForDate(data.tasks, date);
    const done = list.filter((x) => occStatus(x, date, data.completions) === "done").length;
    return (
      <div className="mt3">
        <div className="row-b">
          <h2 className="h-sec" style={{ fontSize: 16 }}>{list.length ? `${done}/${list.length}` : ""}</h2>
          {list.length ? <div className="pbar flex1" style={{ maxWidth: 180 }}><div style={{ width: `${(done / list.length) * 100}%` }} /></div> : null}
        </div>
        <div className="grid mt2" style={{ gap: 8 }}>
          {list.length === 0 ? (
            <div className="card" style={{ textAlign: "center", padding: "26px 14px" }}>
              <p className="muted">{t("no_tasks_today")}</p>
            </div>
          ) : (
            list.map((task) => <TaskRow key={task.id} task={task} date={date} />)
          )}
        </div>
      </div>
    );
  }
}