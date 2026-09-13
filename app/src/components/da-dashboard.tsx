/* DayAxis - Dashboard view. */
import { useState } from "react";

import { CATS } from "../lib/da-content";
import { useCtx, memberName } from "./da-ctx";
import { TaskModal, TaskRow } from "./da-taskmodal";
import { Ic, Ring } from "./da-ui";
import { addDays, fmtShort, occStatus, speechInput, tasksForDate, todayKey } from "../lib/da-types";

const WD = ["S", "M", "T", "W", "T", "F", "S"];

export default function Dashboard() {
  const { data, act, t, lang, toast, memberId, viewMode } = useCtx();
  const today = todayKey();
  const [sel, setSel] = useState(today);
  const [adding, setAdding] = useState(false);
  const [qtitle, setQtitle] = useState("");
  const [qcat, setQcat] = useState("custom");
  const [qtime, setQtime] = useState("");
  const [listening, setListening] = useState(false);

  const todays = tasksForDate(data.tasks, today);
  const totalToday = todays.length;
  const doneToday = todays.filter((tt) => occStatus(tt, today, data.completions) === "done").length;
  const postponedToday = todays.filter((tt) => occStatus(tt, today, data.completions) === "postponed").length;
  const remainingToday = totalToday - doneToday - postponedToday;
  const deletedCount = data.tasks.filter((t) => t.status === "deleted").length;
  const pct = totalToday ? doneToday / totalToday : 0;

  const days = Array.from({ length: 7 }, (_, i) => addDays(today, i - 6));
  const selTasks = tasksForDate(data.tasks, sel);

  const hour = new Date().getHours();
  const greet = hour < 12 ? t("good_morning") : hour < 18 ? t("good_afternoon") : t("good_evening");

  const quickAdd = () => {
    const title = qtitle.trim();
    if (!title) return;
    void act.addTask({ title, category: qcat as never, task_date: today, time: qtime || null, repeat: "none" });
    setQtitle(""); setQtime("");
    toast(t("added"));
  };

  const startVoice = () => {
    if (listening) return;
    setListening(true);
    const stop = speechInput((text) => {
      setListening(false);
      setQtitle(text);
      setTimeout(() => {
        if (text.trim()) quickAdd();
      }, 250);
    }, lang);
    setTimeout(stop, 6000);
  };

  return (
    <div>
      <div className="row-b">
        <div>
          <h1 className="h-display">{greet}</h1>
          <p className="muted mt1" style={{ fontSize: 15 }}>{fmtShort(today, lang)} · {memberName(data, memberId)}</p>
        </div>
        <button className="btn btn-accent" onClick={() => setAdding(true)}><Ic name="plus" /> {t("add_task")}</button>
      </div>

      {/* stats */}
      <div className="grid mt3" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", alignItems: "stretch" }}>
        <div className="card" style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: 14 }}>
          <Ring pct={pct} size={118} sub={`${doneToday}/${totalToday}`} />
        </div>
        <Stat tone="brand" num={doneToday} lbl={t("done")} sub={`${t("tasks_done_today")}`} />
        <Stat tone="gold" num={remainingToday} lbl={t("remaining")} sub={`${t("today_progress")}`} />
        <Stat tone="accent" num={postponedToday} lbl={t("postponed")} sub={t("postpone_day")} />
        <Stat tone="danger" num={deletedCount} lbl={t("deleted")} sub={t("deleted_tasks")} />
      </div>

      {/* week strip */}
      <div className="weekstrip mt3">
        {days.map((d) => {
          const list = tasksForDate(data.tasks, d);
          const done = list.filter((x) => occStatus(x, d, data.completions) === "done").length;
          const dd = new Date(d + "T12:00:00");
          return (
            <button key={d} className={`daycell${d === today ? " today" : ""}`} aria-selected={sel === d} onClick={() => setSel(d)}>
              <span className="dow">{WD[dd.getDay()]}</span>
              <span className="dnum">{dd.getDate()}</span>
              <span className="dbar"><i style={{ width: `${list.length ? (done / list.length) * 100 : 0}%` }} /></span>
            </button>
          );
        })}
      </div>

      {/* week chart */}
      <div className="card mt2">
        <h3 className="h-sec" style={{ fontSize: 15 }}>{t("past_7")}</h3>
        <div className="weekchart mt2">
          {days.map((d) => {
            const list = tasksForDate(data.tasks, d);
            const done = list.filter((x) => occStatus(x, d, data.completions) === "done").length;
            const dd = new Date(d + "T12:00:00");
            return (
              <div className="bar" key={d} title={`${d}: ${done}/${list.length}`}>
                <div className={`fill${list.length && done === list.length ? " full" : ""}`} style={{ height: `${list.length ? Math.max(6, (done / list.length) * 100) : 3}%` }} />
                <span>{WD[dd.getDay()]}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* quick add */}
      <div className="card card-soft mt3">
        <div className="row">
          <button className="icon-btn" onClick={startVoice} style={listening ? { background: "var(--accent)", borderColor: "var(--accent)", color: "#fff" } : undefined} title={t("speak")}>
            <Ic name="mic" />
          </button>
          <input
            id="da-quickadd" className="input flex1" placeholder={t("add_task")} value={qtitle}
            onChange={(e) => setQtitle(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") quickAdd(); }}
          />
          <input className="input" type="time" value={qtime} onChange={(e) => setQtime(e.target.value)} style={{ width: 110 }} aria-label={t("time")} />
          <button className="btn btn-primary" onClick={quickAdd}><Ic name="plus" /> {t("add")}</button>
        </div>
        <div className="row mt1">
          {CATS.slice(0, 6).map((c) => (
            <button key={c.id} className="chip" aria-pressed={qcat === c.id} onClick={() => setQcat(c.id)}>{t(`cat_${c.id}`)}</button>
          ))}
        </div>
      </div>

      {/* selected day tasks */}
      <div className="row-b mt3">
        <h2 className="h-sec">{sel === today ? t("plan_today") : fmtShort(sel, lang)}</h2>
        <span className="muted small tnum">{selTasks.filter((x) => occStatus(x, sel, data.completions) === "done").length}/{selTasks.length} · {t("done")}</span>
      </div>
      <div className={`grid mt2${viewMode === "cards" ? " g3" : ""}`} style={viewMode === "compact" ? { gap: 6 } : undefined}>
        {selTasks.length === 0 ? (
          <div className="card" style={{ textAlign: "center", padding: "30px 16px", gridColumn: "1 / -1" }}>
            <Ic name="spark" size={26} />
            <p className="muted mt2" style={{ fontSize: 14.5 }}>{t("no_tasks_today")}</p>
          </div>
        ) : (
          selTasks.map((task) => (
            <div key={task.id} style={viewMode === "cards" ? { height: "100%" } : undefined}>
              <TaskRow task={task} date={sel} />
            </div>
          ))
        )}
      </div>

      {adding ? <TaskModal onClose={() => setAdding(false)} presetDate={today} /> : null}
    </div>
  );
}

function Stat({ tone, num, lbl, sub }: { tone: string; num: number; lbl: string; sub?: string }) {
  return (
    <div className="card stat" data-tone={tone} style={{ justifyContent: "center" }}>
      <span className="stat-num tnum">{num}</span>
      <span className="stat-lbl">{lbl}</span>
      {sub ? <span className="small muted">{sub}</span> : null}
    </div>
  );
}