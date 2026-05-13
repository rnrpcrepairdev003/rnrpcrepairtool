"use client";

import { useEffect, useState } from "react";
import { Topbar } from "./Topbar";
import { Sidebar } from "./Sidebar";
import { Footer } from "./Footer";

type Settings = {
  webhook_configured: boolean;
  report_hour: string;
  intro_message: string;
};

type Status = "idle" | "saving" | "saved" | "error";

function SaveStatus({ status }: { status: Status }) {
  if (status === "saving") return <span className="text-xs text-slate-500">Saving…</span>;
  if (status === "saved") return <span className="text-xs text-emerald-400 font-medium">Saved</span>;
  if (status === "error") return <span className="text-xs text-red-400 font-medium">Failed to save</span>;
  return null;
}

function Row({ label, description, children }: { label: string; description?: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[280px_1fr] gap-8 py-6 border-b border-slate-800/60 last:border-0">
      <div>
        <p className="text-sm font-medium text-slate-200">{label}</p>
        {description && <p className="text-xs text-slate-500 mt-1 leading-relaxed">{description}</p>}
      </div>
      <div className="flex flex-col gap-2">{children}</div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-10">
      <h2 className="text-[11px] font-semibold text-slate-500 uppercase tracking-widest mb-1">{title}</h2>
      <div className="border border-slate-800 rounded-xl bg-slate-900/40 px-6 divide-y divide-slate-800/60">
        {children}
      </div>
    </div>
  );
}

export function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [webhookUrl, setWebhookUrl] = useState("");
  const [webhookConfigured, setWebhookConfigured] = useState(false);
  const [webhookStatus, setWebhookStatus] = useState<Status>("idle");
  const [reportHour, setReportHour] = useState("8");
  const [reportStatus, setReportStatus] = useState<Status>("idle");
  const [introMessage, setIntroMessage] = useState("");
  const [introSaveStatus, setIntroSaveStatus] = useState<Status>("idle");
  const [introSendStatus, setIntroSendStatus] = useState<Status>("idle");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordStatus, setPasswordStatus] = useState<Status>("idle");
  const [passwordError, setPasswordError] = useState("");

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((data: Settings) => {
        setWebhookConfigured(data.webhook_configured ?? false);
        setReportHour(data.report_hour ?? "8");
        setIntroMessage(data.intro_message ?? "");
      })
      .finally(() => setLoading(false));
  }, []);

  async function save(key: string, value: string, setStatus: (s: Status) => void) {
    setStatus("saving");
    const res = await fetch("/api/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ [key]: value }),
    });
    setStatus(res.ok ? "saved" : "error");
    setTimeout(() => setStatus("idle"), 2500);
  }

  async function sendIntro() {
    setIntroSendStatus("saving");
    const res = await fetch("/api/settings/send-intro", { method: "POST" });
    setIntroSendStatus(res.ok ? "saved" : "error");
    setTimeout(() => setIntroSendStatus("idle"), 3000);
  }

  async function changePassword() {
    setPasswordError("");
    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError("All fields are required");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match");
      return;
    }
    if (newPassword.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      return;
    }
    setPasswordStatus("saving");
    const verifyRes = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: currentPassword, verifyOnly: true }),
    });
    if (!verifyRes.ok) {
      setPasswordStatus("error");
      setPasswordError("Current password is incorrect");
      setTimeout(() => setPasswordStatus("idle"), 2500);
      return;
    }
    const res = await fetch("/api/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ app_password: newPassword }),
    });
    if (res.ok) {
      setPasswordStatus("saved");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } else {
      setPasswordStatus("error");
      setPasswordError("Failed to update password");
    }
    setTimeout(() => setPasswordStatus("idle"), 2500);
  }

  const inputCls = "w-full bg-slate-800/60 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-slate-500 transition-colors";
  const btnPrimary = "px-4 py-2 bg-brand text-white text-sm font-medium rounded-lg hover:opacity-90 disabled:opacity-40 transition-opacity";
  const btnSecondary = "px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 text-sm font-medium rounded-lg disabled:opacity-40 transition-colors";

  return (
    <div className="bg-slate-950 flex flex-col h-screen">
      <Topbar label="Settings" total={0} high={0} medium={0} low={0} pending={0} reviewed={0} lastUpdated={null} hiddenCount={0} onHidden={() => {}} />
      <div className="flex flex-1 min-h-0 overflow-hidden">
        <Sidebar />
        <main className="flex-1 min-h-0 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center h-full text-slate-600 text-sm">Loading…</div>
          ) : (
            <div className="px-10 py-8 max-w-4xl">
              <h1 className="text-lg font-semibold text-slate-100 mb-8">Settings</h1>

              {/* Google Chat */}
              <Section title="Google Chat">
                <Row label="Webhook URL" description="The URL where reports and notifications are sent. Paste a new URL to update it — the current value is never displayed for safety.">
                  {webhookConfigured && (
                    <p className="text-xs text-emerald-400 font-medium">✓ Webhook is configured — paste a new URL below to replace it</p>
                  )}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={webhookUrl}
                      onChange={(e) => setWebhookUrl(e.target.value)}
                      placeholder="https://chat.googleapis.com/v1/spaces/..."
                      className={inputCls}
                    />
                    <button onClick={() => { if (webhookUrl.trim()) save("google_chat_webhook_url", webhookUrl, setWebhookStatus); }} disabled={webhookStatus === "saving" || !webhookUrl.trim()} className={btnPrimary}>
                      Save
                    </button>
                  </div>
                  <SaveStatus status={webhookStatus} />
                </Row>

                <Row label="Space Intro Message" description="The message sent to the Google Chat space to introduce the bot. Edit and save first, then send.">
                  <textarea
                    value={introMessage}
                    onChange={(e) => setIntroMessage(e.target.value)}
                    rows={8}
                    className={`${inputCls} font-mono text-xs resize-y`}
                  />
                  <div className="flex items-center gap-3 mt-1">
                    <button onClick={() => save("intro_message", introMessage, setIntroSaveStatus)} disabled={introSaveStatus === "saving"} className={btnPrimary}>
                      Save Message
                    </button>
                    <button onClick={sendIntro} disabled={introSendStatus === "saving"} className={btnSecondary}>
                      {introSendStatus === "saving" ? "Sending…" : introSendStatus === "saved" ? "Sent!" : "Send to Space"}
                    </button>
                    <SaveStatus status={introSaveStatus} />
                    {introSendStatus === "saved" && <span className="text-xs text-emerald-400 font-medium">Sent — go pin it</span>}
                    {introSendStatus === "error" && <span className="text-xs text-red-400 font-medium">Failed — check webhook URL</span>}
                  </div>
                </Row>
              </Section>

              {/* Report Schedule */}
              <Section title="Report Schedule">
                <Row label="Daily report time" description="The time the priority queue report is automatically sent to Google Chat each morning (Palm Desert local time).">
                  <div className="flex items-center gap-3">
                    <select
                      value={reportHour}
                      onChange={(e) => setReportHour(e.target.value)}
                      className="bg-slate-800/60 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-slate-500"
                    >
                      {Array.from({ length: 13 }, (_, i) => i + 6).map((h) => (
                        <option key={h} value={String(h)}>
                          {h === 12 ? "12:00 PM" : h < 12 ? `${h}:00 AM` : `${h - 12}:00 PM`}
                        </option>
                      ))}
                    </select>
                    <button onClick={() => save("report_hour", reportHour, setReportStatus)} disabled={reportStatus === "saving"} className={btnPrimary}>
                      Save
                    </button>
                    <SaveStatus status={reportStatus} />
                  </div>
                </Row>
              </Section>

              {/* Security */}
              <Section title="Security">
                <Row label="Change Password" description="Update the app login password. The new password takes effect immediately without redeploying.">
                  <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} placeholder="Current password" className={inputCls} />
                  <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="New password" className={inputCls} />
                  <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm new password" className={inputCls} />
                  {passwordError && <p className="text-xs text-red-400">{passwordError}</p>}
                  <div className="flex items-center gap-3 mt-1">
                    <button onClick={changePassword} disabled={passwordStatus === "saving"} className={btnPrimary}>
                      {passwordStatus === "saving" ? "Updating…" : "Update Password"}
                    </button>
                    <SaveStatus status={passwordStatus} />
                  </div>
                </Row>
              </Section>
            </div>
          )}
        </main>
      </div>
      <Footer />
    </div>
  );
}
