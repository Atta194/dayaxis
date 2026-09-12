/* DayAxis - Assist view: lightbulb smart help, photo scan (OCR), emergency, tips. */
import { useState } from "react";

import { EMERGENCY, TIPS, smartReply } from "../lib/da-content";
import { useCtx } from "./da-ctx";
import { Ic } from "./da-ui";
import { speechInput } from "../lib/da-types";

export default function Assist() {
  const { t, lang, toast } = useCtx();
  const [q, setQ] = useState("");
  const [answer, setAnswer] = useState<{ answer: string; from: string } | null>(null);
  const [busy, setBusy] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [recog, setRecog] = useState("");
  const [catFilter, setCatFilter] = useState<string>("all");
  const [listening, setListening] = useState(false);

  const ask = (text: string) => {
    if (!text.trim()) return;
    const r = smartReply(text, lang);
    setAnswer({ answer: r.answer, from: text.trim() });
  };

  const onFile = async (file: File) => {
    setScanning(true);
    setAnswer(null);
    setRecog("");
    try {
      const text = await ocrImage(file, (p) => setQ(`OCR ${Math.round(p * 100)}%`));
      setRecog(text.slice(0, 600));
      setQ("");
      if (text.trim()) {
        const r = smartReply(text, lang);
        setAnswer({ answer: r.answer, from: text.trim().slice(0, 160) });
        toast(t("scanned_done"));
      } else {
        setAnswer({ answer: `${t("scanned_done")} -`, from: "" });
      }
    } catch {
      toast("OCR unavailable - check the connection and try again", "warn");
    } finally {
      setScanning(false);
    }
  };

  const startVoice = () => {
    if (listening) return;
    setListening(true);
    const stop = speechInput((text) => { setListening(false); ask(text); }, lang);
    setTimeout(stop, 7000);
  };

  const tips = catFilter === "all" ? TIPS : TIPS.filter((x) => x.cat === catFilter);
  const cats = ["all", "meal", "medicine", "childcare", "exercise", "family", "break", "general"];

  return (
    <div>
      <div className="row-b">
        <div>
          <h1 className="h-display">{t("nav_assist")}</h1>
          <p className="muted mt1" style={{ fontSize: 14.5 }}>{t("scan_hint")}</p>
        </div>
      </div>

      {/* hero input */}
      <div className="assist-hero mt3">
        <div className="row" style={{ position: "relative", zIndex: 1, flexWrap: "nowrap" }}>
          <Ic name="bulb" size={22} />
          <input
            className="input flex1" placeholder={t("ask_text")} value={q}
            style={{ border: "none" }} disabled={scanning}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && !scanning) { ask(q); setQ(""); } }}
          />
          <button className="btn btn-accent" style={{ background: "#fff", color: "var(--brand)", borderColor: "#fff" }} disabled={scanning}
            onClick={() => { ask(q); setQ(""); }}>
            <Ic name="spark" />
          </button>
        </div>
        <div className="row mt2" style={{ position: "relative", zIndex: 1 }}>
          <label className="btn" style={{ background: "rgba(255,255,255,0.18)", color: "#fff", borderColor: "rgba(255,255,255,0.35)" }}>
            <Ic name="cam" /> {scanning ? t("scanning") : t("scan_photo")}
            <input type="file" accept="image/*" style={{ display: "none" }} onChange={(e) => { const f = e.target.files?.[0]; if (f) void onFile(f); e.target.value = ""; }} />
          </label>
          <button className="btn" style={{ background: "rgba(255,255,255,0.18)", color: "#fff", borderColor: "rgba(255,255,255,0.35)" }} onClick={startVoice}>
            <Ic name="mic" /> {listening ? t("speak") : t("speak")}
          </button>
        </div>
      </div>

      {/* answer */}
      {answer ? (
        <div className="card mt3" style={{ borderLeft: "4px solid var(--brand)" }}>
          {answer.from ? <p className="small muted" style={{ fontStyle: "italic" }}>“{answer.from}”</p> : null}
          <p className="mt1" style={{ fontSize: 14.5 }}>{answer.answer}</p>
        </div>
      ) : null}
      {recog ? (
        <div className="card card-soft mt2">
          <h4 className="small" style={{ color: "var(--ink2)", textTransform: "uppercase", letterSpacing: "0.04em" }}>{t("scanned_done")}</h4>
          <p className="small muted mt1" style={{ whiteSpace: "pre-wrap", maxHeight: 120, overflow: "auto" }}>{recog}</p>
        </div>
      ) : null}

      {/* emergency */}
      <div className="mt4">
        <h2 className="h-sec"><Ic name="alert" /> {t("emergency")}</h2>
        <p className="small muted mt1">{t("emergency_dial")}</p>
        <div className="emergency mt2">
          {EMERGENCY.map((e) => (
            <a key={e.key} className={e.cls} href={`tel:${e.num}`}>
              <Ic name={e.key === "sos" ? "alert" : e.key === "med" ? "heart" : e.key === "police" ? "shield" : "alert"} />
              {e.key === "sos" ? t("sos") : e.key === "med" ? t("med") : e.key === "police" ? t("police") : t("fire")}
              <span className="tnum">{e.num}</span>
            </a>
          ))}
        </div>
        <div className="row mt2">
          <a className="btn" href="mailto:?subject=DayAxis%20quick%20message&body="><Ic name="mail" /> {t("quick_email")}</a>
          <a className="btn" href="sms:"><Ic name="mic2" /> {t("quick_sms")}</a>
          <a className="btn" href="tel:"><Ic name="phone" /> {t("direct_call")}</a>
        </div>
      </div>

      {/* tips */}
      <div className="mt4">
        <h2 className="h-sec"><Ic name="bulb" /> {t("tips_title")}</h2>
        <p className="muted small mt1">{t("tip_general")}</p>
        <div className="row mt2">
          {cats.map((c) => (
            <button key={c} className="chip" aria-pressed={catFilter === c} onClick={() => setCatFilter(c)}>
              {c === "all" ? t("all_good").slice(0, 3) : t(`nav_${c === "general" ? "assist" : c}`)}
            </button>
          ))}
        </div>
        <div className="grid g3 mt3">
          {tips.map((tip) => (
            <div className="card" key={tip.id} onClick={() => toast(tip.title)} style={{ cursor: "pointer" }}>
              <h3 style={{ fontSize: 14.5 }}>{tip.title}</h3>
              <p className="small muted mt1">{tip.body}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

declare global {
  interface Window { Tesseract?: unknown }
}

async function loadScript(src: string): Promise<void> {
  if (document.querySelector(`script[src="${src}"]`)) return;
  await new Promise<void>((res, rej) => {
    const s = document.createElement("script");
    s.src = src; s.async = true;
    s.onload = () => res(); s.onerror = () => rej(new Error("load"));
    document.head.appendChild(s);
  });
}

async function ocrImage(file: File, onProgress: (p: number) => void): Promise<string> {
  await loadScript("https://cdn.jsdelivr.net/npm/tesseract.js@5.1.1/dist/tesseract.min.js");
  const T = (window.Tesseract as {
    recognize: (f: File, lang: string, opts: { logger: (m: { status: string; progress: number }) => void }) => Promise<{ data: { text: string } }>;
  });
  const r = await T.recognize(file, "eng+rus", {
    logger: (m) => { if (m.status === "recognizing text") onProgress(m.progress); },
  });
  return (r.data.text ?? "").trim();
}