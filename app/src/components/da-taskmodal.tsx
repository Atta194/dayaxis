/* Shared task row + edit/add modal for DayAxis. */
import { useState } from "react";

import { CATS } from "../lib/da-content";
import { memberColor, memberName, useCtx } from "./da-ctx";
import { fmtHM, uid } from "../lib/da-types";
import { Ic, Modal } from "./da-ui";

export function TaskRow({ task, date, onEdited }: {
  task: import("../lib/da-types").Task;
  date: string;
  onEdited?: () => void;
}) {
  const { data, act, t, lang, toast, setView, celebrate } = useCtx();
  const comp = data.completions.find((c) => c.task_id === task.id && c.on_date === date);
  const done = comp?.kind === "done";
  const postponed = comp?.kind === "postponed";
  const [open, setOpen] = useState(false);
  const [confirmDel, setConfirmDel] = useState(false);

  const toggle = () => {
    if (done) {
      void act.complete(task.id, date, false);
      toast(t("undo"));
    } else {
      void act.complete(task.id, date, true);
      celebrate();
      if (data.completions.some((c) => c.task_id === task.id && c.on_date === date)) {
        // was postponed before - just finish
      }
      // pop-up: suggest adding another
      setTimeout(() => setOpenSuggest(true), 450);
    }
  };
  const [openSuggest, setOpenSuggest] = useState(false);

  const postpone = () => {
    void act.postponeTask(task.id, date, 1);
    toast(t("postpone"));
  };
  const del = () => {
    void act.deleteTask(task.id);
    toast(t("delete"));
    setConfirmDel(false);
  };

  const cat = CATS.find((c) => c.id === task.category);
  const member = task.member_id;

  return (
    <>
      <div className={`task${done ? " done" : ""}${postponed ? "" : ""}`} style={open ? { borderColor: "var(--brand3)" } : undefined}>
        <button
          className="task-check" onClick={toggle} aria-label={done ? t("undo") : t("mark_done")}
          style={postponed && !done ? { borderColor: "var(--gold)", background: "color-mix(in srgb, var(--gold) 25%, transparent)" } : undefined}
        >
          <Ic name="check" />
        </button>
        <div style={{ flex: 1, minWidth: 0, cursor: "pointer" }} onClick={() => setOpen((o) => !o)}>
          <div className="task-title" style={{ fontSize: 14.5 }}>{task.title}</div>
          {open && task.notes ? <p className="mt1 muted" style={{ fontSize: 13 }}>{task.notes}</p> : null}
          <div className="task-sub mt1">
            {task.time ? <span><Ic name="clock" size={13} /> {fmtHM(task.time)}</span> : null}
            {cat ? <span className="chip chip-tag" data-cat={cat.id} style={{ padding: "2px 9px", fontSize: 11.5 }}>{t(`cat_${cat.id}`)}</span> : null}
            {member != null ? <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
              <span className="dot" style={{ background: memberColor(data, member) }} />{memberName(data, member)}
            </span> : null}
            {task.repeat !== "none" ? <span><Ic name="repeat" size={13} /> {task.repeat === "weekly" ? t("repeat_weekly") : `${t("repeat_custom")} ${task.interval_days ?? 2}`}</span> : null}
            {task.checklist.length ? <span>{task.checklist.filter((c) => c.done).length}/{task.checklist.length}</span> : null}
          </div>
          {postponed && !done ? <div className="small mt1" style={{ color: "var(--gold)", fontWeight: 700 }}>{t("postponed")}</div> : null}
        </div>
        <div className="task-actions">
          <button className="icon-btn" title={t("postpone_day")} onClick={postpone}><Ic name="clock" /></button>
          <button className="icon-btn" onClick={() => setView("plan")} title={t("details")}><Ic name="cal" /></button>
          <button className="icon-btn" style={{ color: "var(--danger)" }} title={t("delete")} onClick={() => setConfirmDel(true)}><Ic name="trash" /></button>
        </div>
      </div>
      {openSuggest ? (
        <Modal onClose={() => setOpenSuggest(false)} title={t("task_done")}>
          <p className="muted">{t("suggest_next")}</p>
          <div className="row mt3">
            <button className="btn btn-primary" onClick={() => { setOpenSuggest(false); setView("dash"); setTimeout(() => document.getElementById("da-quickadd")?.focus(), 60); }}>
              {t("add_task")}
            </button>
            <button className="btn" onClick={() => setOpenSuggest(false)}>{t("close")}</button>
          </div>
        </Modal>
      ) : null}
      {confirmDel ? (
        <Modal onClose={() => setConfirmDel(false)} title={t("sure_delete")}>
          <div className="row mt2">
            <button className="btn btn-danger" onClick={del}>{t("delete")}</button>
            <button className="btn" onClick={() => setConfirmDel(false)}>{t("cancel")}</button>
          </div>
        </Modal>
      ) : null}
      {onEdited ? null : null}
      <span style={{ display: "none" }}>{lang}</span>
    </>
  );
}

export function TaskModal({ onClose, presetDate, preset }: {
  onClose: () => void;
  presetDate?: string;
  preset?: import("../lib/da-types").Task;
}) {
  const { data, act, t, toast, memberId } = useCtx();
  const [title, setTitle] = useState(preset?.title ?? "");
  const [cat, setCat] = useState(preset?.category ?? "custom");
  const [date, setDate] = useState(preset?.task_date ?? presetDate ?? "");
  const [time, setTime] = useState(preset?.time ?? "");
  const [notes, setNotes] = useState(preset?.notes ?? "");
  const [repeat, setRepeat] = useState(preset?.repeat ?? "none");
  const [weekdays, setWeekdays] = useState<string[]>(preset?.weekdays ? preset.weekdays.split(",") : ["1", "3", "5"]);
  const [intervalDays, setIntervalDays] = useState(preset?.interval_days ?? 2);
  const [member, setMember] = useState<number | null>(preset?.member_id ?? memberId);
  const [checks, setChecks] = useState(preset?.checklist ?? []);
  const [checkInput, setCheckInput] = useState("");

  const save = () => {
    if (!title.trim()) { toast(t("title"), "warn"); return; }
    void act.updateTask({
      id: preset?.id ?? uid(),
      title: title.trim(), category: cat as typeof cat, notes,
      task_date: date || null, time: time || null,
      repeat: repeat as "none" | "weekly" | "custom",
      weekdays: weekdays.join(","), interval_days: repeat === "custom" ? intervalDays : null,
      member_id: member, checklist: checks, status: "active",
    });
    toast(t("task_saved"));
    onClose();
  };

  const WDS = [
    { v: "0", l: "S" }, { v: "1", l: "M" }, { v: "2", l: "T" }, { v: "3", l: "W" },
    { v: "4", l: "T" }, { v: "5", l: "F" }, { v: "6", l: "S" },
  ];

  return (
    <Modal onClose={onClose} title={preset ? t("edit") : t("add_task")}>
      <div style={{ display: "grid", gap: 12 }}>
        <div className="field">
          <label>{t("title")}</label>
          <input className="input" value={title} onChange={(e) => setTitle(e.target.value)} placeholder={t("add_task")} autoFocus />
        </div>
        <div className="field">
          <label>{t("category")}</label>
          <div className="row">
            {CATS.map((c) => (
              <button key={c.id} className="chip" aria-pressed={cat === c.id} onClick={() => setCat(c.id)}>
                <Ic name={c.id === "meal" ? "pot" : c.id === "medicine" ? "shield" : c.id === "exercise" ? "dumbbell" : c.id === "family" ? "users" : c.id === "break" ? "heart" : "spark"} size={14} />
                {t(`cat_${c.id}`)}
              </button>
            ))}
          </div>
        </div>
        <div className="grid" style={{ gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <div className="field">
            <label>{t("date")}</label>
            <input className="input" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>
          <div className="field">
            <label>{t("time")}</label>
            <input className="input" type="time" value={time} onChange={(e) => setTime(e.target.value)} />
          </div>
        </div>
        <div className="field">
          <label>{t("member")}</label>
          <select className="select" value={member ?? ""} onChange={(e) => setMember(e.target.value ? Number(e.target.value) : null)}>
            <option value="">{t("guest")}</option>
            {data.members.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
          </select>
        </div>
        <div className="field">
          <label>{t("repeat")}</label>
          <div className="row">
            <button className="chip" aria-pressed={repeat === "none"} onClick={() => setRepeat("none")}>{t("repeat_none")}</button>
            <button className="chip" aria-pressed={repeat === "weekly"} onClick={() => setRepeat("weekly")}>{t("repeat_weekly")}</button>
            <button className="chip" aria-pressed={repeat === "custom"} onClick={() => setRepeat("custom")}>{t("repeat_custom")}</button>
          </div>
          {repeat === "weekly" ? (
            <div className="row mt1">
              {WDS.map((d) => (
                <button key={d.v} className="chip" aria-pressed={weekdays.includes(d.v)} onClick={() => {
                  setWeekdays((w) => (w.includes(d.v) ? w.filter((x) => x !== d.v) : [...w, d.v]));
                }}>{d.l}</button>
              ))}
            </div>
          ) : null}
          {repeat === "custom" ? (
            <div className="row mt1">
              <input className="input" type="number" min={1} max={365} value={intervalDays}
                onChange={(e) => setIntervalDays(Math.max(1, Number(e.target.value) || 1))}
                style={{ width: 110 }} />
              <span className="muted small">{t("days_interval")}</span>
            </div>
          ) : null}
        </div>
        <div className="field">
          <label>{t("checklist")}</label>
          {checks.map((c, i) => (
            <div key={c.id} className="row">
              <button className="task-check" style={{ width: 20, height: 20, margin: 0 }}
                onClick={() => setChecks((cs) => cs.map((x, j) => j === i ? { ...x, done: !x.done } : x))}>
                {c.done ? <Ic name="check" size={12} /> : null}
              </button>
              <span style={{ flex: 1, fontSize: 14, textDecoration: c.done ? "line-through" : "none" }}>{c.label}</span>
              <button className="icon-btn" style={{ width: 28, height: 28 }} onClick={() => setChecks((cs) => cs.filter((_, j) => j !== i))}><Ic name="x" size={13} /></button>
            </div>
          ))}
          <div className="row">
            <input className="input" value={checkInput} placeholder={t("add_check_item")}
              onChange={(e) => setCheckInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && checkInput.trim()) {
                  setChecks((cs) => [...cs, { id: uid(), label: checkInput.trim(), done: false }]);
                  setCheckInput("");
                }
              }} />
            <button className="btn btn-soft btn-sm" onClick={() => {
              if (checkInput.trim()) {
                setChecks((cs) => [...cs, { id: uid(), label: checkInput.trim(), done: false }]);
                setCheckInput("");
              }
            }}><Ic name="plus" /></button>
          </div>
        </div>
        <div className="field">
          <label>{t("notes")}</label>
          <textarea className="textarea" value={notes} onChange={(e) => setNotes(e.target.value)} />
        </div>
        <div className="row" style={{ justifyContent: "flex-end" }}>
          <button className="btn" onClick={onClose}>{t("cancel")}</button>
          <button className="btn btn-primary" onClick={save}><Ic name="check" /> {t("save")}</button>
        </div>
      </div>
    </Modal>
  );
}