# Deadline Decoder

**Got a letter with a deadline? Find out how much time you really have.**

Government and court letters count days in ways that trip people up: mailing days, court days, holidays.
Deadline Decoder asks what kind of letter you got and one date, then shows your real deadline in plain
words, **with the math shown**, what to do next, and where to get free help. It adds the deadline to Google Calendar or Outlook in one tap, or downloads an
iCalendar (.ics) file with a one-week reminder for Apple Calendar and anything else, reads everything aloud, and prints a one-page summary.

Built for **LexHack 2026 — Access to Justice & Civic Tech**.

## Letters it handles (v0.1)
| Letter | Rule | Source |
|---|---|---|
| Social Security reconsideration denial → ask for a hearing | 60 days after receipt; receipt presumed 5 days after the notice date; a weekend/federal-holiday deadline moves to the next workday | 20 CFR 404.933, 416.1433, 404.901, 416.1401, 404.3(b), 416.120(d) |
| Social Security initial denial → ask for reconsideration | same counting | 20 CFR 404.909, 416.1409 |
| California 3-day notice to pay rent or quit | 3 court days; weekends and judicial holidays excluded; day of service excluded | CCP § 1161(2) (AB 2343, eff. 9/1/2019), § 12, § 135 |
| California eviction Summons (unlawful detainer) | 10 court days to respond after personal service | CCP § 1167 (AB 2347, eff. 1/1/2025) |
| Medi-Cal / CalFresh Notice of Action → state hearing | 90 days from the notice date (good cause to 180); ask before the effective date to keep benefits | W&I Code § 10951; LSNC CalFresh guide |

California 2026 court holidays are checked against courts.ca.gov day by day in the tests; other years
are computed from the statute and the result says so.

## Why the AI is optional
An optional "Explain my letter" button sends the pasted text to Claude (Haiku 4.5) with the user's own
API key, kept only in the browser tab. **The deadline never comes from the AI** — it comes from the rules
above, so it cannot be hallucinated. Nothing leaves the device unless the user asks for that explanation.

## Run it
It is a static site: open `index.html` through any web server (`python3 -m http.server`).
Tests: `npm test` (Node 20+, no dependencies).

## Tech stack
HTML, CSS, vanilla JavaScript (ES modules), Node's built-in test runner. Fonts: Atkinson Hyperlegible
(designed for low-vision readers) and Fraunces, from Google Fonts. Web Speech API for read-aloud.
Optional: Anthropic Messages API (Claude Haiku 4.5) with a user-supplied key. Demo narration: Azure AI Speech (Dragon HD voice).

## Not legal advice
General information only. Delivery method and personal circumstances can change a deadline; every result
links to free legal aid.

## License
AGPL-3.0-or-later © 2026 Jeffrey Pine Hein. See [LICENSE](LICENSE).
