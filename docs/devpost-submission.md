# Devpost submission — Deadline Decoder (LexHack 2026)

**Project name:** Deadline Decoder

**Tagline (short summary):** Got a letter with a deadline? Find out how much time you really have — in plain words, with the math shown.

**Track:** Access to Justice & Civic Tech

## Inspiration
This started with a real letter. The builder is a disability claimant; this month Social Security denied his claim a second time. The letter said he had 60 days to ask for a hearing. It did not say that the 60 days start five days after the date printed on the letter, or that a deadline landing on a weekend moves to the next workday. Working that out took an evening of reading federal regulations. Most people who get these letters are sick, stressed, poor, or all three, and a missed deadline is usually permanent. The same trap is in California eviction notices, where "three days" means three *court* days and a holiday weekend can add four more.

## What it does
You pick the kind of letter you got (or paste its words and it recognizes the letter and finds the date), enter one date, and Deadline Decoder shows:
- **your real deadline and how many days are left**, in large type;
- **how it counted** — every step, including mailing presumptions and each skipped weekend and court holiday, so a legal aid worker can check it in seconds;
- **what to do**, in order, with the right form names (HA-501, SSA-561, UD-105, FW-001);
- **free help** — Legal Services of Northern California, LawHelpCA, the courts' Self-Help Guide, 211, Social Security;
- one tap to **add the deadline and a one-week reminder to your calendar** (.ics), **read everything aloud**, **copy a summary for a helper**, or **print**.

Letters in v0.1: Social Security reconsideration denial (ask for a hearing), Social Security initial denial (ask for reconsideration), California 3-day notice to pay rent or quit, California eviction Summons (unlawful detainer), and Medi-Cal/CalFresh Notice of Action (state hearing).

An optional **"Explain my letter"** button uses Claude (Haiku 4.5) with the user's own API key to explain the whole letter at a 6th-grade reading level. The deadline never comes from the AI. It comes from coded rules, so it cannot be hallucinated.

## How we built it
A static web app — HTML, CSS and vanilla JavaScript modules, no framework, no server, nothing stored. The deadline logic is pure functions (`src/dates.js`, `src/rules.js`) with each rule citing its source:
- 20 CFR 404.933 / 416.1433 (60 days after receipt), 404.901 / 416.1401 (receipt presumed 5 days after the notice date), 404.3(b) / 416.120(d) (weekend and federal-holiday rollover);
- California Code of Civil Procedure § 1161(2) as amended by AB 2343 (3-day notices exclude weekends and judicial holidays), § 1167 as amended by AB 2347 effective Jan. 1, 2025 (10 court days to respond to an unlawful detainer), §§ 12 and 135;
- Welfare and Institutions Code § 10951 (90 days to request a state hearing; good cause to 180).
Court and federal holidays are computed from the statutes, and the 2026 California judicial holidays are checked day by day against the Judicial Council's calendar in the test suite (Node's built-in test runner, 10 tests). The interface uses Atkinson Hyperlegible, a typeface designed for low-vision readers, large touch targets, light and dark themes, reduced-motion support, and a print layout.

## Challenges
Getting the counting rules exactly right, and being honest about the limits: the tool assumes personal service for eviction papers (substituted service adds days) and says so; holidays for years not yet published are computed and labelled as such.

## Accomplishments we're proud of
Every result shows its work. A deadline tool that cannot explain itself is one more letter people cannot read.

## What we learned
The hard part of "access to justice" is often arithmetic nobody explains.

## What's next
More letters (EDD, Covered California, housing authority notices), Spanish, a benefits calendar that reminds people when to apply and renew, and a version embedded in techempower.org, a Nevada County nonprofit that publishes plain-language benefits guides.

## Built with
HTML · CSS · JavaScript (ES modules) · Node.js test runner · Web Speech API · iCalendar (.ics) · Anthropic Claude API (Haiku 4.5, optional, bring-your-own-key) · Google Fonts (Atkinson Hyperlegible, Fraunces) · Piper TTS (demo narration) · GitHub Pages

## Links
- Code: https://github.com/jphein/deadline-decoder
- Live demo: https://jphein.github.io/deadline-decoder/ (try `#sample`)
- Video: [JP uploads the mp4 to YouTube (unlisted) or Loom and pastes the link]

## AI and tool disclosure
The code was written during LexHack with an AI coding assistant (Claude), directed by the entrant. The optional in-app explanation uses the Anthropic Claude API with the user's own key. Demo narration is synthetic (Piper TTS).
