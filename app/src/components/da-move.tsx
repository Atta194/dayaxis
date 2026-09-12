/* DayAxis - Move view: age-group home exercises with form graphics + detail. */
import { useState } from "react";

import { EXERCISES, GROUPS } from "../lib/da-content";
import { useCtx } from "./da-ctx";
import { Ic, Modal, Pose } from "./da-ui";
import type { Exercise, Group } from "../lib/da-content";

export default function Move() {
  const { t } = useCtx();
  const [group, setGroup] = useState<Group>("adults");
  const [detail, setDetail] = useState<Exercise | null>(null);

  const list = EXERCISES.filter((e) => e.group === group);
  const lvl = (n: number) => (n === 1 ? t("easy") : n === 2 ? t("medium") : t("tough"));

  return (
    <div>
      <div className="row-b">
        <div>
          <h1 className="h-display">{t("nav_move")}</h1>
          <p className="muted mt1" style={{ fontSize: 14.5 }}>{t("move_note")}</p>
        </div>
      </div>

      <div className="row mt3">
        {GROUPS.map((g) => (
          <button key={g.id} className="chip" aria-pressed={group === g.id} onClick={() => setGroup(g.id)}>
            {t(g.key)}
          </button>
        ))}
      </div>

      <div className="grid g3 mt3">
        {list.map((e) => (
          <div className="card" key={e.id} style={{ cursor: "pointer" }} onClick={() => setDetail(e)}>
            <div className="pose-frame"><Pose pose={e.pose} /></div>
            <h3 className="mt2" style={{ fontSize: 16 }}>{e.title}</h3>
            <p className="small muted mt1" style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <span style={{ display: "inline-flex", gap: 4, alignItems: "center" }}><Ic name="clock" size={13} /> {e.mins} {t("mins")}</span>
              <span>{lvl(e.lvl)}</span>
            </p>
            <button className="btn btn-soft btn-sm mt2">{t("how_to")} →</button>
          </div>
        ))}
      </div>

      {detail ? (
        <Modal onClose={() => setDetail(null)} title={detail.title}>
          <div style={{ display: "flex", justifyContent: "center" }}><Pose pose={detail.pose} /></div>
          <div className="row mt2" style={{ justifyContent: "center" }}>
            <span className="chip chip-tag" style={{ cursor: "default" }}>{eLabel(detail, t)}</span>
            <span className="chip chip-tag" style={{ cursor: "default" }}>{t("intensity")}: {lvl(detail.lvl)}</span>
          </div>
          <h4 className="mt3" style={{ fontSize: 14.5 }}>{t("steps")}</h4>
          <ol style={{ paddingLeft: 18, display: "grid", gap: 7, fontSize: 14 }}>
            {detail.steps.map((s, i) => <li key={i}>{s}</li>)}
          </ol>
          <div className="row mt3" style={{ justifyContent: "flex-end" }}>
            <button className="btn btn-primary" onClick={() => setDetail(null)}>{t("close")}</button>
          </div>
        </Modal>
      ) : null}
    </div>
  );
}

function eLabel(e: Exercise, t: (k: string) => string): string {
  return `${t(e.group)} · ${e.mins} ${t("mins")}`;
}