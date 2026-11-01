# Deadline Decoder — pitch outline

*LexHack 2026 Builders Fellowship · Jeffrey Hein · Grass Valley, California · November 2026*

## 1. The letter
A denial letter says "you have 60 days." It does not say the 60 days start five days after the date on the letter, or that a deadline on a Sunday moves to Monday. People miss hearings over arithmetic nobody explained. I know because it was my letter.

## 2. What it does
Pick the letter (or paste its words), enter one date. Deadline Decoder shows the real deadline in large type, every counting step, what to do next with the right form names, and where free help is. One tap adds the deadline and a one-week reminder to any calendar. Read-aloud and print are built in.

## 3. Why it is trustworthy
The deadline never comes from an AI. It comes from coded rules that cite their source: 20 CFR 404.933/416.1433, 404.901/416.1401, California CCP §§ 1161(2), 1167, W&I § 10951. California's 2026 court holidays are checked day by day in the test suite. The optional "Explain my letter" button uses Claude with the user's own key and only explains; it never counts.

## 4. Where it is today
v0.1 shipped at LexHack (Sept 2026): five letter types (two Social Security, two California eviction, one Medi-Cal/CalFresh), static site, no server, nothing stored, 10 passing tests, live at jphein.github.io/deadline-decoder. Paused since the hackathon; this fellowship restarts it.

## 5. Roadmap, 6 months
- Nov–Dec: EDD, Covered California and housing-authority notices; Spanish; attorney review of every rule (Legal Services of Northern California).
- Jan: embed on techempower.org; digital navigators use it with clients; anonymous counts of letters decoded.
- Feb–Apr: installable PWA with a benefits calendar (renewals, appeals); testing with 20 clients; a second state if a partner asks.

## 6. Distribution
TechEMPOWER is a Nevada County, California nonprofit I founded for digital equity. Its navigators already sit with people and their mail. The tool goes where the letters are opened.

## 7. What I am asking for
A mentor who has taken a civic-tech tool into legal-aid clinics; cloud credits for the Spanish and AI-explanation work; introductions to legal-aid reviewers. Ten hours a week from me, AGPL so any clinic can run its own copy.

## 8. Links
- Live: https://jphein.github.io/deadline-decoder/
- Code: https://github.com/jphein/deadline-decoder (AGPL-3.0)
- Devpost: https://devpost.com/software/deadline-decoder
