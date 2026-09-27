import { RULES, detect } from "./rules.js";
import { d, iso, fmt, fmtShort, daysBetween, findDates } from "./dates.js";

const $ = s => document.querySelector(s);
const esc = t => String(t).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
let chosen = null, last = null;

const SAMPLE = `SOCIAL SECURITY ADMINISTRATION
Notice of Reconsideration

Date: September 13, 2026

We have reconsidered your claim for Supplemental Security Income. We have determined that you are not disabled under our rules. The determination we made before was correct.

If you disagree with this determination, you have the right to request a hearing before an administrative law judge. You have 60 days to ask for a hearing. The 60 days start the day after you receive this letter. We assume you got this letter 5 days after the date on it unless you show us you did not get it within the 5-day period.

(This is a SAMPLE letter for trying the tool. It is not a real notice.)`;

function todayUTC() { const n = new Date(); return new Date(Date.UTC(n.getFullYear(), n.getMonth(), n.getDate())); }

function renderCards() {
  $("#cards").innerHTML = RULES.map(r => `<button type="button" class="card" role="radio" aria-checked="false" data-id="${r.id}"><b>${esc(r.title)}</b><span>${esc(r.plain)}</span></button>`).join("");
}
function choose(id, why) {
  chosen = RULES.find(r => r.id === id);
  document.querySelectorAll(".card").forEach(c => c.setAttribute("aria-checked", c.dataset.id === id ? "true" : "false"));
  $("#datelabel").textContent = chosen.dateLabel + "?";
  $("#step2").hidden = false;
  if (why) $("#guessmsg").textContent = why;
  $("#date").focus();
}

function ics(rule, res) {
  const day = iso(res.deadline).replace(/-/g, "");
  const remind = iso(new Date(res.deadline.getTime() - 7 * 86400000)).replace(/-/g, "");
  const stamp = new Date().toISOString().replace(/[-:]/g, "").slice(0, 15) + "Z";
  const text = `${res.headline}. ${res.steps[0]} Free help: ${res.help.map(h => h.name + " (" + h.how + ")").join("; ")}.`;
  const ev = (uid, date, summary) => ["BEGIN:VEVENT", `UID:${uid}@deadline-decoder`, `DTSTAMP:${stamp}`,
    `DTSTART;VALUE=DATE:${date}`, `SUMMARY:${summary}`, `DESCRIPTION:${text.replace(/[,;]/g, m => "\\" + m)}`,
    "BEGIN:VALARM", "TRIGGER:-PT15H", "ACTION:DISPLAY", `DESCRIPTION:${summary}`, "END:VALARM", "END:VEVENT"];
  const lines = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Deadline Decoder//EN",
    ...ev(`${rule.id}-${day}`, day, `DEADLINE: ${res.headline}`),
    ...ev(`${rule.id}-${day}-wk`, remind, `One week left: ${res.headline}`), "END:VCALENDAR"];
  const blob = new Blob([lines.join("\r\n")], { type: "text/calendar" });
  const a = Object.assign(document.createElement("a"), { href: URL.createObjectURL(blob), download: `deadline-${iso(res.deadline)}.ics` });
  document.body.appendChild(a); a.click(); a.remove();
}

function summaryText(rule, res, left) {
  return `${res.headline}: by ${fmt(res.deadline)} (${left >= 0 ? left + " days from today" : "this date has passed"}).\n` +
    res.math.join(" ") + "\nNext: " + res.steps.slice(0, 2).join(" ") +
    "\nFree help: " + res.help.map(h => `${h.name} — ${h.how}`).join("; ") + "\n(From Deadline Decoder — general information, not legal advice.)";
}

function show() {
  if (!chosen) return;
  const v = $("#date").value;
  if (!v) { $("#date").focus(); return; }
  const res = chosen.compute(d(v));
  const left = daysBetween(todayUTC(), res.deadline);
  last = { rule: chosen, res, left };
  const cls = left < 0 ? "past" : left <= 7 ? "urgent" : "";
  const bigText = left < 0 ? "This deadline has passed" : left === 0 ? "Today is the last day" : left === 1 ? "1 day left" : `${left} days left`;
  const r = $("#result");
  r.className = "result " + cls;
  r.innerHTML = `
    <p class="kicker">${esc(chosen.title)}</p>
    <p class="big">${bigText}</p>
    <p class="when">${esc(res.headline)} by <b>${esc(fmt(res.deadline))}</b>.</p>
    ${left < 0 ? `<p><b>It may not be too late.</b> Most of these deadlines can be extended for "good cause" if you ask in writing and explain why. Call free legal aid today.</p>` : ""}
    <details class="math" open><summary>How we counted</summary><ol>${res.math.map(m => `<li>${esc(m)}</li>`).join("")}</ol></details>
    <p class="todo">What to do</p>
    <ol>${res.steps.map(s => `<li>${esc(s)}</li>`).join("")}</ol>
    <p class="todo">Free help</p>
    <ul class="helpers">${res.help.map(h => `<li><b>${esc(h.name)}</b><span>${esc(h.how)}</span></li>`).join("")}</ul>
    <div class="actions">
      <button type="button" id="cal">Add to my calendar</button>
      <button type="button" id="speak">Read it to me</button>
      <button type="button" id="copy">Copy for a helper</button>
      <button type="button" id="print">Print</button>
    </div>
    <details class="sources"><summary>Where these rules come from</summary><ul>${res.sources.map(s => `<li>${esc(s)}</li>`).join("")}</ul></details>`;
  r.hidden = false;
  $("#aibox").hidden = !$("#lettertext").value.trim();
  $("#cal").onclick = () => ics(chosen, res);
  $("#print").onclick = () => window.print();
  $("#copy").onclick = async () => { try { await navigator.clipboard.writeText(summaryText(chosen, res, left)); $("#copy").textContent = "Copied"; } catch { $("#copy").textContent = "Copy failed"; } };
  $("#speak").onclick = () => {
    if (!("speechSynthesis" in window)) { $("#speak").textContent = "Not supported here"; return; }
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(`${bigText}. ${res.headline} by ${fmt(res.deadline)}. ${res.math.join(" ")} What to do. ${res.steps.join(" ")}`);
    u.rate = 0.95; speechSynthesis.speak(u);
  };
  history.replaceState(null, "", `#${chosen.id}/${v}`);
  if (document.body.classList.contains("showsrc")) r.querySelector(".sources").open = true;
  r.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
  r.setAttribute("tabindex", "-1"); r.focus({ preventScroll: true });
}

function guess() {
  const text = $("#lettertext").value;
  const rule = detect(text);
  const dates = findDates(text);
  if (dates.length) $("#date").value = dates[0].iso;
  if (rule) choose(rule.id, `This looks like: ${rule.title}.${dates.length ? " We filled in the first date we found — check it." : ""}`);
  else $("#guessmsg").textContent = "We couldn't tell which letter this is. Pick the closest one above.";
}

async function explain() {
  const key = $("#apikey").value.trim(), text = $("#lettertext").value.trim();
  if (!key || !text) { $("#aimsg").textContent = "Paste the letter and your API key first."; return; }
  try { sessionStorage.setItem("dd-key", key); } catch {}
  $("#aimsg").textContent = "Asking Claude…"; $("#aiout").textContent = "";
  const sys = "You explain official letters to people who are stressed and may read at a 6th-grade level. " +
    "In plain, kind, short sentences: 1) what this letter is and who sent it, 2) what it is asking or telling the person, " +
    "3) the one or two things to do next, 4) what to have ready when calling for help. " +
    "Do NOT state or calculate any deadline date — the app computes deadlines from the law; you may say 'check your deadline above'. " +
    "Do not give legal advice; suggest free legal aid for decisions. Under 180 words.";
  try {
    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "content-type": "application/json", "x-api-key": key, "anthropic-version": "2023-06-01", "anthropic-dangerous-direct-browser-access": "true" },
      body: JSON.stringify({ model: "claude-haiku-4-5-20251001", max_tokens: 500, system: sys, messages: [{ role: "user", content: text.slice(0, 12000) }] }),
    });
    const j = await r.json();
    if (!r.ok) throw new Error(j?.error?.message || r.status);
    $("#aiout").textContent = (j.content || []).map(c => c.text || "").join("\n").trim();
    $("#aimsg").textContent = "Explained by Claude (Haiku 4.5). The deadline above is from the rules, not the AI.";
  } catch (e) { $("#aimsg").textContent = "Could not reach Claude: " + e.message; }
}

function init() {
  renderCards();
  $("#cards").addEventListener("click", e => { const c = e.target.closest(".card"); if (c) choose(c.dataset.id); });
  $("#go").onclick = show;
  $("#date").addEventListener("keydown", e => { if (e.key === "Enter") show(); });
  $("#guess").onclick = guess;
  $("#sample").onclick = () => { $("#lettertext").value = SAMPLE; guess(); };
  $("#explain").onclick = explain;
  try { const k = sessionStorage.getItem("dd-key"); if (k) $("#apikey").value = k; } catch {}
  $(".theme").onclick = () => {
    const root = document.documentElement, dark = root.dataset.theme ? root.dataset.theme === "dark" : matchMedia("(prefers-color-scheme: dark)").matches;
    root.dataset.theme = dark ? "light" : "dark";
  };
  // "…!" at the end of the hash = focus mode: only the result card (used for the demo video and for sharing)
  if (location.hash.endsWith("!")) { document.body.classList.add("focus"); history.replaceState(null, "", location.hash.slice(0, -1)); }
  if (location.hash.endsWith("+src")) { document.body.classList.add("focus", "showsrc"); history.replaceState(null, "", location.hash.slice(0, -4)); }
  if (location.hash === "#sample") { $("#pastebox").open = true; $("#lettertext").value = SAMPLE; guess(); show(); }
  const m = location.hash.match(/^#([a-z0-9-]+)\/(\d{4}-\d{2}-\d{2})$/);
  if (m && RULES.some(r => r.id === m[1])) { choose(m[1]); $("#date").value = m[2]; show(); }
  $("#build").textContent = "v0.1 · rules checked 2026-09-26";
}
init();
