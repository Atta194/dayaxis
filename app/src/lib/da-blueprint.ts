/* DayAxis - printable "Home SOS" blueprint with diagrams (save as PDF via print). */
import { BLUEPRINT } from "./da-content";
import type { Lang } from "./da-types";

const DIAGRAMS: Record<string, string> = {
  breaker: `<svg viewBox="0 0 140 120" width="150" height="130" xmlns="http://www.w3.org/2000/svg"><rect x="28" y="10" width="84" height="100" rx="6" fill="#fff" stroke="#1E7A6B" stroke-width="3"/><rect x="40" y="20" width="60" height="13" rx="3" fill="none" stroke="#E8705F" stroke-width="3"/><rect x="40" y="38" width="60" height="13" rx="3" fill="#57BFA9" stroke="#1E7A6B" stroke-width="2"/><rect x="40" y="56" width="60" height="13" rx="3" fill="#57BFA9" stroke="#1E7A6B" stroke-width="2"/><rect x="40" y="74" width="60" height="13" rx="3" fill="none" stroke="#E8705F" stroke-width="3"/><rect x="40" y="92" width="60" height="8" rx="3" fill="#E9B44C" stroke="#1E7A6B" stroke-width="2"/></svg>`,
  pipe: `<svg viewBox="0 0 140 120" width="150" height="130" xmlns="http://www.w3.org/2000/svg"><path d="M10 55h90" stroke="#1E7A6B" stroke-width="10" stroke-linecap="round"/><circle cx="116" cy="55" r="14" fill="#fff" stroke="#E8705F" stroke-width="5"/><path d="M116 41v-12M116 69v8" stroke="#E8705F" stroke-width="4" stroke-linecap="round"/><circle cx="58" cy="82" r="3.4" fill="#57BFA9"/><circle cx="74" cy="94" r="3.4" fill="#57BFA9"/><circle cx="90" cy="82" r="3.4" fill="#57BFA9"/></svg>`,
  spray: `<svg viewBox="0 0 140 120" width="150" height="130" xmlns="http://www.w3.org/2000/svg"><rect x="50" y="40" width="40" height="62" rx="8" fill="#E9B44C" stroke="#1E7A6B" stroke-width="3"/><rect x="58" y="28" width="24" height="14" rx="4" fill="#fff" stroke="#1E7A6B" stroke-width="3"/><path d="M70 24v-8" stroke="#1E7A6B" stroke-width="4" stroke-linecap="round"/><circle cx="70" cy="10" r="4" fill="#E8705F"/><rect x="14" y="96" width="112" height="10" rx="5" fill="#57BFA9" stroke="#1E7A6B" stroke-width="2"/></svg>`,
  wrench: `<svg viewBox="0 0 140 120" width="150" height="130" xmlns="http://www.w3.org/2000/svg"><path d="M28 94 112 26" stroke="#1E7A6B" stroke-width="12" stroke-linecap="round"/><circle cx="24" cy="98" r="10" fill="#57BFA9" stroke="#1E7A6B" stroke-width="3"/><circle cx="116" cy="22" r="10" fill="#E8705F" stroke="#1E7A6B" stroke-width="3"/></svg>`,
  scales: `<svg viewBox="0 0 140 120" width="150" height="130" xmlns="http://www.w3.org/2000/svg"><path d="M70 14v56" stroke="#1E7A6B" stroke-width="5" stroke-linecap="round"/><path d="M34 26h72M34 26l-16 34M106 26l16 34" stroke="#1E7A6B" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/><path d="M18 60h64M122 60h-66" stroke="#1E7A6B" stroke-width="5"/><circle cx="50" cy="68" r="3" fill="#E8705F"/><circle cx="90" cy="68" r="3" fill="#E8705F"/><rect x="12" y="96" width="116" height="10" rx="3" fill="#E9B44C" stroke="#1E7A6B" stroke-width="2"/></svg>`,
  box: `<svg viewBox="0 0 140 120" width="150" height="130" xmlns="http://www.w3.org/2000/svg"><path d="M70 14 118 38v44L70 106 22 82V38z" fill="#fff" stroke="#1E7A6B" stroke-width="3" stroke-linejoin="round"/><path d="M22 38l48 24 48-24M70 62v44M70 62 118 38" fill="none" stroke="#57BFA9" stroke-width="3" stroke-linejoin="round"/><rect x="52" y="20" width="36" height="10" rx="2" fill="#E8705F"/></svg>`,
};

export function printBlueprint(lang: Lang, t: (k: string) => string): void {
  const reportId = "da-blueprint-print";
  document.getElementById(reportId)?.remove();
  const el = document.createElement("div");
  el.id = reportId;
  el.className = "print-report";
  const sections = BLUEPRINT.map(
    (bp) => `
      <section style="margin-top:18px;page-break-inside:avoid;">
        <h2 style="font-size:18px;color:#1E7A6B;border-bottom:2px solid #1E7A6B;padding-bottom:4px;">${t(bp.tradeKey)}</h2>
        <div style="display:flex;gap:14px;align-items:flex-start;flex-wrap:wrap;">
          ${DIAGRAMS[bp.svg] ?? ""}
          <div style="flex:1;min-width:230px;">
            ${bp.problems.map((p) => `
              <div style="margin-top:10px;">
                <b style="font-size:13px;">${p.issue}</b>
                <ol style="font-size:12px;margin:4px 0 0 18px;padding:0;">
                  ${p.steps.map((s) => `<li style="margin-top:2px;">${s}</li>`).join("")}
                </ol>
              </div>`).join("")}
          </div>
        </div>
      </section>`,
  ).join("");
  el.innerHTML = `
    <h1 style="font-size:22px;">${t("blueprint_title")}</h1>
    <p style="font-size:12px;color:#555;">${t("blueprint_note")}</p>
    ${sections}
    <p style="margin-top:16px;font-size:12px;font-weight:700;color:#1E7A6B;">${t("bp_pro")}</p>
    <p style="font-size:11px;color:#888;margin-top:10px;">DayAxis - ${new Date().toLocaleDateString()}</p>`;
  document.body.appendChild(el);
  window.print();
  setTimeout(() => el.remove(), 4000);
}