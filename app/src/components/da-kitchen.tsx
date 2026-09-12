/* DayAxis - Kitchen view: recipes, servings, nutrition totals, diet filters. */
import { useMemo, useState } from "react";

import { DIETS, RECIPES, sumNut } from "../lib/da-content";
import { useCtx } from "./da-ctx";
import { Ic, Img } from "./da-ui";

export default function Kitchen() {
  const { t } = useCtx();
  const [servings, setServings] = useState<Record<string, number>>({});
  const [filters, setFilters] = useState<Set<string>>(new Set());
  const [fastOnly, setFastOnly] = useState(false);
  const [openDish, setOpenDish] = useState<string | null>(null);

  const list = useMemo(() => RECIPES.filter((r) => {
    if (fastOnly && r.mins > 20) return false;
    for (const f of filters) {
      if (!r.diets.includes(f)) return false;
    }
    return true;
  }), [filters, fastOnly]);

  const sel = RECIPES.find((r) => r.id === openDish);
  const sv = sel ? Math.max(1, servings[sel.id] ?? sel.serves) : 1;
  const nut = sel ? sumNut(sel.ing, sv) : null;

  const dietLabel = (d: string) =>
    ({ veg: "Vegetarian", vegan: "Vegan", "high-protein": "High protein", kids: "Kids-friendly", "no-cook": "No cook", fast: "Fast", family: "Family", snack: "Snack" })[d] ?? d;

  return (
    <div>
      <div className="row-b">
        <div>
          <h1 className="h-display">{t("nav_kitchen")}</h1>
          <p className="muted mt1" style={{ fontSize: 14.5 }}>{t("decide_note")}</p>
        </div>
      </div>

      <div className="card card-soft mt3">
        <div className="row">
          <span className="chip chip-tag" style={{ cursor: "default" }}>{t("diet_filters")}</span>
          {DIETS.slice(0, 6).map((d) => (
            <button
              key={d} className="chip" aria-pressed={filters.has(d)}
              onClick={() => setFilters((f) => {
                const nf = new Set(f);
                if (nf.has(d)) nf.delete(d); else nf.add(d);
                return nf;
              })}
            >{dietLabel(d)}</button>
          ))}
          <button className="chip" aria-pressed={fastOnly} onClick={() => setFastOnly((v) => !v)}>
            <Ic name="clock" size={14} /> {t("fast_only")}
          </button>
        </div>
      </div>

      {list.length === 0 ? (
        <div className="card mt3" style={{ textAlign: "center", padding: 30 }}><p className="muted">{t("none_match")}</p></div>
      ) : (
        <div className="grid g3 mt3">
          {list.map((r) => {
            const svG = Math.max(1, servings[r.id] ?? r.serves);
            const n = sumNut(r.ing, svG);
            return (
              <div className="card" key={r.id} style={{ display: "flex", flexDirection: "column" }}>
                <Img src={r.img} alt={r.title} />
                <div className="row-b" style={{ alignItems: "flex-start" }}>
                  <div>
                    <h3 style={{ fontSize: 16.5 }}>{r.title}</h3>
                    <p className="small muted mt1" style={{ display: "flex", gap: 8, alignItems: "center" }}>
                      <span style={{ display: "inline-flex", gap: 4, alignItems: "center" }}><Ic name="clock" size={13} /> {r.mins} {t("mins")}</span>
                      <span>{r.diets.filter((d) => d !== "fast").slice(0, 3).map(dietLabel).join(" · ")}</span>
                    </p>
                  </div>
                </div>
                <div className="row-b mt2">
                  <div className="row">
                    <button className="icon-btn" style={{ width: 30, height: 30 }} onClick={() => setServings((s) => ({ ...s, [r.id]: Math.max(1, svG - 1) }))} aria-label="−"><Ic name="x" size={12} /></button>
                    <b className="tnum" style={{ minWidth: 44, textAlign: "center" }}>{svG} {t("servings")}</b>
                    <button className="icon-btn" style={{ width: 30, height: 30 }} onClick={() => setServings((s) => ({ ...s, [r.id]: svG + 1 }))} aria-label="+"><Ic name="plus" size={12} /></button>
                  </div>
                </div>
                <div className="nutbar mt2">
                  <div className="nut"><b className="tnum">{n.k}</b><span>{t("kcal")}</span></div>
                  <div className="nut"><b className="tnum">{n.p}g</b><span>{t("protein")}</span></div>
                  <div className="nut"><b className="tnum">{n.c}g</b><span>{t("carbs")}</span></div>
                  <div className="nut"><b className="tnum">{n.f}g</b><span>{t("fat")}</span></div>
                </div>
                <button className="btn btn-soft btn-sm mt2" style={{ marginTop: "auto" }} onClick={() => setOpenDish(openDish === r.id ? null : r.id)}>
                  {openDish === r.id ? t("hide_steps") : t("show_steps")}
                </button>
                {openDish === r.id ? (
                  <div className="mt2" style={{ fontSize: 13.5 }}>
                    <ol style={{ paddingLeft: 18, display: "grid", gap: 5 }}>
                      {r.steps.map((s, i) => <li key={i}>{s}</li>)}
                    </ol>
                    <p className="mt2 small muted"><b style={{ color: "var(--brand)" }}>{t("vitamins")}:</b> {r.vit}</p>
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}