/* DayAxis - Me view: members, preferences, reminders, data/account, feedback. */
import { useRef, useState } from "react";

import { LANGS } from "../lib/da-content";
import { isDaError } from "../lib/da-client";
import { PlansPanel, SponsorPanel } from "./da-plans";
import { useCtx } from "./da-ctx";
import { Avatar, Ic, Stars } from "./da-ui";
import { LS, lsGet, lsSet } from "../lib/da-types";

const COLORS = ["#1E7A6B", "#E8705F", "#E9B44C", "#8A5BB1", "#2E5FA3", "#4C9E6F", "#B3568B", "#8A6D1E"];

export default function Profile() {
  const { data, act, t, lang, setLang, theme, setTheme, viewMode, setViewMode, toast, memberId, setMemberId, refresh, installApp, setView } = useCtx();
  const [newMember, setNewMember] = useState("");
  const [renaming, setRenaming] = useState<number | null>(null);
  const [renameVal, setRenameVal] = useState("");
  const [fbRating, setFbRating] = useState(5);
  const [fbText, setFbText] = useState("");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [lead, setLead] = useState(Number(lsGet(LS.reminderLead, "5")) || 5);
  const fileRef = useRef<HTMLInputElement>(null);
  const [showAccount, setShowAccount] = useState(data.account_email != null);
  const amOwner = memberId != null && (data.members.find((x) => x.id === memberId)?.is_owner === 1);
  const [pwOld, setPwOld] = useState("");
  const [pwNew, setPwNew] = useState("");
  const [phoneV, setPhoneV] = useState("");
  const [phoneCode, setPhoneCode] = useState("");
  const [otpSentCode, setOtpSentCode] = useState("");
  const [phoneMode, setPhoneMode] = useState(false);

  const notifyOn = lsGet(LS.notify) === "1";
  const voiceOn = lsGet(LS.voiceRem) === "1";

  const setNotify = async (on: boolean) => {
    if (on && "Notification" in window) {
      const p = await Notification.requestPermission();
      if (p !== "granted") { toast("Notifications blocked by the browser", "warn"); return; }
    }
    lsSet(LS.notify, on ? "1" : "0");
    toast(t("pref_changed"));
  };
  const setVoice = (on: boolean) => { lsSet(LS.voiceRem, on ? "1" : "0"); toast(t("pref_changed")); };
  const setLeadV = (n: number) => { setLead(n); lsSet(LS.reminderLead, String(n)); toast(t("pref_changed")); };
  const changeLang = (l: typeof lang) => { setLang(l); lsSet(LS.lang, l); toast(t("pref_changed")); };

  const avg = data.feedback.length
    ? Math.round((data.feedback.reduce((a, b) => a + b.rating, 0) / data.feedback.length) * 10) / 10
    : 0;

  const restoreFile = (f: File) => {
    const reader = new FileReader();
    reader.onload = async () => {
      const bk = await import("../lib/da-export").then((m) => m.parseBackup(String(reader.result ?? "")));
      if (!bk) { toast("backup invalid", "warn"); return; }
      let n = 0;
      for (const m of bk.members as { name?: string; color?: string }[]) {
        if (m?.name) { await act.addMember(m.name, m.color ?? COLORS[0], memberId); n++; }
      }
      for (const tk of bk.tasks) {
        if (!tk?.title) continue;
        await act.updateTask({ ...tk, checklist: Array.isArray(tk.checklist) ? tk.checklist : [], id: tk.id });
        n++;
      }
      toast(`${t("import_json")}: ${n}`);
    };
    reader.readAsText(f);
  };

  return (
    <div>
      <h1 className="h-display">{t("nav_me")}</h1>

      <div className="card mt3">
        <div className="row-b">
          <div>
            <h3 className="h-sec"><Ic name="users" /> {t("members")}</h3>
            <p className="small muted mt1 tnum">{t("guests_cap").replace("{n}", String(data.members.length))}</p>
          </div>
          {amOwner ? (
            data.members.length >= 5 ? (
              <span className="small muted">{t("max_guests")}</span>
            ) : (
              <div className="row">
                <input className="input" style={{ width: 150 }} placeholder={t("add_member")} value={newMember}
                  onChange={(e) => setNewMember(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter" && newMember.trim()) { void act.addMember(newMember.trim(), COLORS[data.members.length % COLORS.length], memberId); setNewMember(""); toast(t("added")); } }} />
                <button className="btn btn-primary btn-sm" onClick={() => { if (newMember.trim()) { void act.addMember(newMember.trim(), COLORS[data.members.length % COLORS.length], memberId); setNewMember(""); toast(t("added")); } }}>
                  <Ic name="plus" /> {t("add_member")}
                </button>
              </div>
            )
          ) : (
            <span className="small muted">{t("no_admin")}</span>
          )}
        </div>
        <div className="grid mt2" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))" }}>
          {data.members.map((m) => (
            <div key={m.id} className="card card-soft row" style={{ padding: 12, cursor: "pointer" }}
              onClick={() => { setMemberId(m.id); lsSet(LS.guest, String(m.id)); toast(`${t("switch_to")} ${m.name}`); }}>
              <Avatar name={m.name} color={m.color} size={40} />
              <span className="flex1" style={{ minWidth: 0 }}>
                <span style={{ fontWeight: 700, fontSize: 14, display: "block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {m.name} {memberId === m.id ? <span style={{ color: "var(--brand)" }}>✓</span> : null}
                </span>
                {m.is_owner === 1 ? (
                  <span className="small" style={{ color: "var(--brand)", fontWeight: 700 }}>{t("owner_badge")}</span>
                ) : (
                  <span style={{ fontSize: 11.5, color: "var(--ink3)" }}>{t("guest")}</span>
                )}
              </span>
              {renaming === m.id ? (
                <input className="input" style={{ width: 90, padding: "6px 8px", fontSize: 13 }} value={renameVal} autoFocus
                  onChange={(e) => setRenameVal(e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                  onKeyDown={(e) => { if (e.key === "Enter") { void act.renameMember(m.id, renameVal, memberId); setRenaming(null); } }}
                  onBlur={() => setRenaming(null)} />
              ) : null}
              {amOwner ? (
                <>
                  <button className="icon-btn" style={{ width: 30, height: 30 }} title={t("edit")}
                    onClick={(e) => { e.stopPropagation(); setRenaming(m.id); setRenameVal(m.name); }}>
                    <Ic name="user" size={14} />
                  </button>
                  {m.is_owner !== 1 ? (
                    <button className="icon-btn" style={{ width: 30, height: 30, color: "var(--danger)" }} title={t("delete")}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (window.confirm(t("sure_delete"))) {
                          void act.deleteMember(m.id, memberId);
                          if (memberId === m.id) setMemberId(null);
                          toast(t("delete"));
                        }
                      }}>
                      <Ic name="trash" size={14} />
                    </button>
                  ) : null}
                </>
              ) : null}
            </div>
          ))}
        </div>
      </div>

      <PlansPanel />
      <SponsorPanel />

      <div className="grid mt2" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", alignItems: "start" }}>
        <div className="card">
          <h3 className="h-sec"><Ic name="sun" /> {t("theme")}</h3>
          <div className="row mt2">
            <button className="chip" aria-pressed={theme !== "dark"} onClick={() => setTheme("light")}><Ic name="sun" size={14} /> {t("light")}</button>
            <button className="chip" aria-pressed={theme === "dark"} onClick={() => setTheme("dark")}><Ic name="moon" size={14} /> {t("dark")}</button>
          </div>
          <h3 className="h-sec mt3"><Ic name="globe" /> {t("language")}</h3>
          <div className="lang-pick mt2">
            {LANGS.map((l) => (
              <button key={l.id} className="chip" aria-pressed={lang === l.id} onClick={() => changeLang(l.id)}>{l.native}</button>
            ))}
          </div>
          <h3 className="h-sec mt3"><Ic name="file" /> {t("view_mode")}</h3>
          <div className="row mt2">
            {(["cards", "list", "compact"] as const).map((v) => (
              <button key={v} className="chip" aria-pressed={viewMode === v} onClick={() => { setViewMode(v); lsSet(LS.view, v); }}>
                {t(`view_${v}`)}
              </button>
            ))}
          </div>
        </div>

        <div className="card">
          <h3 className="h-sec"><Ic name="bell" /> {t("reminders")}</h3>
          <div className="check-row mt2">
            <input type="checkbox" checked={notifyOn} onChange={(e) => void setNotify(e.target.checked)} />
            <span>{t("enable_notifications")}</span>
          </div>
          <div className="check-row mt1">
            <input type="checkbox" checked={voiceOn} onChange={(e) => setVoice(e.target.checked)} />
            <span>{t("voice_reminders")}</span>
          </div>
          <div className="field mt2">
            <label>{t("reminder_lead")}: {lead} {t("mins")}</label>
            <input type="range" min={1} max={30} value={lead} onChange={(e) => setLeadV(Number(e.target.value))} />
          </div>
          <p className="small muted mt2">Reminders fire while DayAxis is open (or installed as an app). Every task that has a time and is not done gets a sound + spoken name.</p>
        </div>

        <div className="card">
          <h3 className="h-sec"><Ic name="download" /> {t("data")}</h3>
          <p className="small muted mt1">{t("data_note")}</p>
          <div className="row mt2">
            <button className="btn btn-sm" onClick={() => void import("../lib/da-export").then((m) => m.downloadHistoryCSV(data))}><Ic name="download" /> CSV</button>
            <button className="btn btn-sm" onClick={() => void import("../lib/da-export").then((m) => m.printReport(data, lang, "DayAxis report"))}><Ic name="file" /> PDF</button>
            <button className="btn btn-sm" onClick={() => void import("../lib/da-export").then((m) => m.exportJSON(data))}><Ic name="download" /> JSON</button>
            <button className="btn btn-sm" onClick={() => fileRef.current?.click()}><Ic name="upload" /> {t("import_json")}</button>
            <input ref={fileRef} type="file" accept="application/json" style={{ display: "none" }} onChange={(e) => { const f = e.target.files?.[0]; if (f) restoreFile(f); e.target.value = ""; }} />
          </div>
          {installApp ? (
            <button className="btn btn-primary mt2" onClick={installApp}><Ic name="download" /> Install DayAxis as an app</button>
          ) : null}
          <p className="small muted mt2" style={{ maxWidth: 420 }}>Install DayAxis to your home screen. With a service worker on board it opens instantly and stays usable offline with your last synced data.</p>
          <div className="row-b mt3" style={{ alignItems: "center" }}>
            <h3 className="h-sec" style={{ fontSize: 15 }}>{t("your_account")}</h3>
            {data.account_email ? (
              <span className="chip chip-tag" style={{ cursor: "default" }}>
                {data.account_email}{data.account_role === "admin" ? ` · ${t("owner_badge")}` : ""}
              </span>
            ) : null}
          </div>
          {data.account_email ? (
            <div className="mt2" style={{ display: "grid", gap: 9 }}>
              <div className="field">
                <label>{t("verify_phone")}</label>
                {data.account_phone_verified === 1 ? (
                  <span className="chip chip-tag mt1" style={{ cursor: "default", color: "var(--ok)", alignSelf: "flex-start" }}>{t("phone_ok")}</span>
                ) : (
                  <>
                    <div className="row" style={{ flexWrap: "nowrap" }}>
                      <input className="input flex1" placeholder={t("phone")} value={phoneV} onChange={(e) => setPhoneV(e.target.value)} />
                      <button className="btn btn-soft btn-sm" onClick={async () => {
                        const res = await act.requestOtp(phoneV.trim());
                        const code = res.ok && res.data && typeof (res.data as { code?: unknown }).code === "string" ? (res.data as { code: string }).code : "";
                        setOtpSentCode(code);
                        toast(code ? t("otp_sent_note") : "network", "warn");
                      }}>{t("verify_phone")}</button>
                    </div>
                    {otpSentCode ? (
                      <>
                        <div className="row mt1" style={{ flexWrap: "nowrap" }}>
                          <input className="input" style={{ width: 130 }} placeholder={t("otp_code")} value={phoneCode} onChange={(e) => setPhoneCode(e.target.value)} />
                          <button className="btn btn-primary btn-sm" onClick={async () => {
                            const res = await act.verifyOtp(phoneV.trim(), phoneCode.trim());
                            if (res.ok) { setPhoneCode(""); setOtpSentCode(""); toast(t("phone_ok")); }
                            else toast(res.error === "bad-otp" ? t("otp_code") : res.error, "warn");
                          }}><Ic name="check" size={14} /></button>
                        </div>
                        <p className="small muted tnum" style={{ wordBreak: "break-all" }}>Code: {otpSentCode} · {t("otp_sent_note")}</p>
                      </>
                    ) : null}
                  </>
                )}
              </div>
              <div className="field">
                <label>{t("change_password")}</label>
                <div className="row">
                  <input className="input" style={{ width: 130 }} placeholder={t("old_pass")} type="password" value={pwOld} onChange={(e) => setPwOld(e.target.value)} />
                  <input className="input" style={{ width: 130 }} placeholder={t("new_pass")} type="password" value={pwNew} onChange={(e) => setPwNew(e.target.value)} />
                  <button className="btn btn-primary btn-sm" onClick={async () => {
                    if (pwNew.length < 6) { toast(t("new_pass"), "warn"); return; }
                    const res = await act.changePassword(pwOld, pwNew);
                    if (res.ok) { setPwOld(""); setPwNew(""); toast(t("pref_changed")); }
                    else toast(res.error === "wrong-credentials" ? t("old_pass") : res.error, "warn");
                  }}><Ic name="check" size={14} /> {t("save")}</button>
                </div>
              </div>
              <button className="btn btn-danger btn-sm" style={{ justifySelf: "start" }} onClick={async () => { await act.logout(); toast(t("logout")); }}>
                <Ic name="logout" /> {t("logout")}
              </button>
            </div>
          ) : (
            <div className="mt2" style={{ display: "grid", gap: 9 }}>
              <div className="row">
                <button className="chip" aria-pressed={!phoneMode} onClick={() => setPhoneMode(false)}>Gmail / Email</button>
                <button className="chip" aria-pressed={phoneMode} onClick={() => setPhoneMode(true)}>{t("phone_signup")}</button>
              </div>
              {phoneMode ? (
                <input className="input" placeholder={t("phone")} value={phoneV} onChange={(e) => setPhoneV(e.target.value)} />
              ) : (
                <input className="input" placeholder={t("email_ph")} type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
              )}
              <input className="input" placeholder={t("passcode")} type="password" value={pass} onChange={(e) => setPass(e.target.value)} />
              <p className="small muted">{t("account_note")}</p>
              <div className="row">
                <button className="btn btn-primary btn-sm" onClick={async () => {
                  const digits = phoneV.replace(/\D/g, "");
                  const ident = phoneMode ? `${digits}@phone.dayaxis` : email;
                  const okId = phoneMode ? digits.length >= 5 : ident.trim().length > 3;
                  const r = okId && pass.length >= 6 ? await act.signup(ident, pass) : { ok: false as const, error: "short" };
                  if (r.ok) {
                    toast(t("welcome")); setEmail(""); setPass(""); void refresh();
                    const role = r.data && "account_role" in r.data ? r.data.account_role : null;
                    setView(role === "admin" ? "admin" : "dash");
                  }
                  else toast(r.error === "email-exists" ? "Account exists - sign in" : r.error, "warn");
                }}>{t("signup")}</button>
                <button className="btn btn-sm" onClick={async () => {
                  const digits = phoneV.replace(/\D/g, "");
                  const ident = phoneMode ? `${digits}@phone.dayaxis` : email;
                  const okId = phoneMode ? digits.length >= 5 : ident.trim().length > 3;
                  const r = okId && pass.length >= 6 ? await act.login(ident, pass) : { ok: false as const, error: "short" };
                  if (r.ok) {
                    toast(t("welcome")); setEmail(""); setPass(""); void refresh();
                    const role = r.data && "account_role" in r.data ? r.data.account_role : null;
                    setView(role === "admin" ? "admin" : "dash");
                  }
                  else toast(r.error === "wrong-credentials" ? "Wrong email or code" : r.error, "warn");
                }}>{t("login")}</button>
              </div>
              <button className="btn" style={{ justifySelf: "start" }} onClick={async () => {
                const res = await act.googleStart();
                const url = !isDaError(res) && res.data && typeof (res.data as { url?: unknown }).url === "string" ? (res.data as { url: string }).url : null;
                if (url) { window.location.href = url; return; }
                const m = isDaError(res) && res.data && typeof (res.data as { message?: unknown }).message === "string"
                  ? (res.data as { message: string }).message
                  : isDaError(res) ? res.error : "error";
                toast(m || "error", "warn");
              }}>
                <Ic name="globe" size={15} /> {t("continue_google")}
              </button>
              <button className="btn" style={{ justifySelf: "start", justifyContent: "flex-start" }} onClick={() => toast("Apple sign-in is wired - connect the Apple Services ID in Settings to enable it.", "warn")}>
                Apple · {t("login")}
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="card mt2">
        <div className="row-b">
          <div>
            <h3 className="h-sec"><Ic name="star" /> {t("feedback")}</h3>
            <p className="small muted mt1">{t("feedback_note")}</p>
          </div>
          {data.feedback.length ? (
            <div className="row">
              <Stars value={Math.round(avg)} size={16} />
              <b className="tnum">{avg}</b>
              <span className="muted small">{t("from")} {data.feedback.length} {t("feedbacks")}</span>
            </div>
          ) : null}
        </div>
        <div className="mt2" style={{ maxWidth: 520 }}>
          <Stars value={fbRating} onChange={setFbRating} size={22} />
          <textarea className="textarea mt2" value={fbText} onChange={(e) => setFbText(e.target.value)} placeholder="…" maxLength={2000} />
          <button className="btn btn-primary mt2" onClick={async () => {
            await act.sendFeedback(fbRating, fbText);
            setFbText(""); setFbRating(5);
            toast(t("thanks_feedback"));
          }}><Ic name="heart" /> {t("send_feedback")}</button>
        </div>
        {data.feedback.length ? (
          <div className="mt3" style={{ display: "grid", gap: 8 }}>
            {data.feedback.slice(0, 5).map((f) => (
              <div key={f.id} style={{ borderTop: "1px solid var(--line)", paddingTop: 8 }}>
                <div className="row"><Stars value={f.rating} size={12} /><span className="small muted">{f.at?.slice(0, 10)}</span></div>
                {f.text ? <p className="small mt1">{f.text}</p> : null}
              </div>
            ))}
          </div>
        ) : null}
      </div>

      <p className="small muted mt3" style={{ maxWidth: 560 }}>{t("about")}</p>
    </div>
  );
}