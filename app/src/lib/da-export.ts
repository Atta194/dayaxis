/* DayAxis export helpers: CSV (Google Sheets), PDF (print blueprint), JSON backup, email compose. */
import { copyText, dkey, download, parseKey } from "../lib/da-types";
import type { DoneRow, HomeData, Lang, Task } from "../lib/da-types";

const esc = (s: string | number) => `"${String(s ?? "").replace(/"/g, '""')}"`;

export function buildHistoryCSV(data: HomeData): string {
  const rows: (string | number)[][] = [
    ["date", "task", "category", "member", "time", "status", "repeat", "notes"],
  ];
  const byId = new Map(data.tasks.map((t) => [t.id, t]));
  const seen = new Set<string>();
  for (const c of [...data.completions].sort((a, b) => (a.on_date < b.on_date ? -1 : 1))) {
    const task = byId.get(c.task_id);
    if (!task) continue;
    seen.add(c.task_id);
    rows.push([c.on_date, task.title, task.category, task.member_id ?? "", fmt(task.time), c.kind, task.repeat, task.notes]);
  }
  for (const t of data.tasks) {
    if (seen.has(t.id)) continue;
    rows.push([t.task_date ?? "", t.title, t.category, t.member_id ?? "", fmt(t.time), t.status, t.repeat, t.notes]);
  }
  return "\uFEFF" + rows.map((r) => r.map(esc).join(",")).join("\r\n");
}

function fmt(time: string | null): string {
  return time && /^\d{2}:\d{2}/.test(time) ? time.slice(0, 5) : "";
}

export function downloadHistoryCSV(data: HomeData): void {
  download(`dayaxis-history-${dkey(new Date())}.csv`, buildHistoryCSV(data), "text/csv");
}

export function exportJSON(data: HomeData): void {
  const payload = {
    exported_at: new Date().toISOString(),
    app: "DayAxis",
    data: {
      members: data.members,
      tasks: data.tasks,
      completions: data.completions,
    },
  };
  download(`dayaxis-backup-${dkey(new Date())}.json`, JSON.stringify(payload, null, 2), "application/json");
}

export function parseBackup(json: string): { members: unknown[]; tasks: Task[]; completions: DoneRow[] } | null {
  try {
    const o = JSON.parse(json);
    if (!o || !o.data) return null;
    return {
      members: Array.isArray(o.data.members) ? o.data.members : [],
      tasks: Array.isArray(o.data.tasks) ? o.data.tasks : [],
      completions: Array.isArray(o.data.completions) ? o.data.completions : [],
    };
  } catch {
    return null;
  }
}

export function printReport(data: HomeData, lang: Lang, title: string): void {
  const dayNames = ["S", "M", "T", "W", "T", "F", "S"];
  const reportId = "da-print-report";
  document.getElementById(reportId)?.remove();
  const el = document.createElement("div");
  el.id = reportId;
  el.className = "print-report";
  const byId = new Map(data.tasks.map((t) => [t.id, t]));
  const rows = [...data.completions]
    .sort((a, b) => (a.on_date < b.on_date ? -1 : 1))
    .slice(-400)
    .map((c) => {
      const task = byId.get(c.task_id);
      const d = parseKey(c.on_date);
      return `<tr><td>${c.on_date} (${dayNames[d.getDay()]})</td><td>${esc(task?.title ?? "")}</td><td>${esc(task?.category ?? "")}</td><td>${fmt(task?.time)}</td><td>${c.kind}</td></tr>`;
    })
    .join("");
  el.innerHTML = `
    <h1>${esc(title)}</h1>
    <p>Exported ${new Date().toLocaleString()} · ${data.home_id.slice(0, 8)}…</p>
    <table>
      <thead><tr><th>Date</th><th>Task</th><th>Category</th><th>Time</th><th>Status</th></tr></thead>
      <tbody>${rows || `<tr><td colspan="5">-</td></tr>`}</tbody>
    </table>`;
  document.body.appendChild(el);
  window.print();
  setTimeout(() => el.remove(), 4000);
}

export function composeEmail(subject: string, body: string): void {
  const href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  window.location.href = href;
}

export async function copyCSV(data: HomeData, toast: (m: string) => void): Promise<void> {
  const csv = buildHistoryCSV(data);
  try {
    await copyText(csv);
    toast("Copied - paste it into Google Sheets (File → Paste).");
  } catch {
    downloadHistoryCSV(data);
    toast("Saved as CSV - open it with Google Sheets.");
  }
}