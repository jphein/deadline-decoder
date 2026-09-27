# Every claim in the demo video, checked (2026-09-26 23:25 PDT)

Narration: `scripts/narration.txt` (Azure Dragon HD, Andrew). Each line below is the claim, the source, and the verdict.

| # | Claim in the narration | Source / check | Verdict |
|---|---|---|---|
| 02 | The builder's Social Security claim was denied a second time this month. | The builder's own SSI reconsideration notice, dated 2026-09-13. | ✅ |
| 02 | SSA's 60 days start 5 days after the date on the letter. | 20 CFR 416.1433(b) / 404.933(b): 60 days after receipt; 416.1401 / 404.901: receipt presumed 5 days after the notice date. The sample letter's own wording says the same. | ✅ |
| 02 | A deadline on a weekend moves to the next workday. | 20 CFR 404.3(b), 416.120(d): extended to the next full workday for a Saturday, Sunday, legal holiday or federal non-workday. | ✅ |
| 03 | Paste the words; it recognizes the letter and finds the date; nothing leaves the device. | `src/rules.js detect()`, `src/dates.js findDates()` (tests pass); the page makes no network request except fonts and the optional AI call the user triggers. | ✅ (fonts load from Google Fonts — no letter data is sent) |
| 04 | 52 days left; hearing by Tuesday, November 17. | Notice 2026-09-13 + 5 = 2026-09-18 (Fri) + 60 = 2026-11-17 (Tue, a workday). Test "SSA reconsideration dated 2026-09-13". "52 days left" is counted from 2026-09-26, the recording date. | ✅ — note: the days-left number is as of recording |
| 05 | One tap adds the deadline and a one-week reminder to the calendar; read aloud; copy; print. | `ics()` writes the deadline event plus a "one week left" event, each with an alarm; Web Speech API; clipboard; print CSS. Google Calendar and Outlook one-tap links added 23:20 (after the video). | ✅ |
| 06 | A California 3-day notice counts court days, not calendar days. | CCP § 1161(2) as amended by AB 2343 (eff. 2019-09-01): excludes Saturdays, Sundays and judicial holidays. | ✅ |
| 06 | Served the day before Thanksgiving, the 3 days run to Wednesday, December 2 (holiday, day after, weekend skipped). | Served Wed 2026-11-25; 11-26 Thanksgiving and 11-27 day after are CA judicial holidays (courts.ca.gov 2026 list); 11-28/29 weekend; court days 11-30, 12-1, 12-2. Test "3-day notice over Thanksgiving". | ✅ |
| 07 | Eviction papers now give 10 court days to respond, since a 2025 change in the law. | CCP § 1167 as amended by AB 2347 (signed 2024-09-24, effective 2025-01-01): 10 court days, weekends and judicial holidays excluded. | ✅ |
| 07 | Doing nothing means losing by default. | CCP § 1169: if the defendant does not respond in time, the court may enter default and judgment for possession. | ✅ |
| 08 | Medi-Cal and CalFresh notices give 90 days to ask for a hearing. | W&I Code § 10951 (90 days after the action; good cause to 180). LSNC CalFresh guide: within 90 days of the notice date. | ✅ |
| 08 | It explains how to keep benefits while you wait. | App text: ask before the effective date on the notice ("aid paid pending"). Federal basis: 42 CFR 431.230 (Medicaid benefits continue if the hearing is requested before the date of action); 7 CFR 273.15(k) (SNAP benefits continue if requested within the notice period). | ✅ (wording in the app is general and points to the notice's date) |
| 09 | Every rule cites its source (federal regulations, California codes, court holiday calendar). | Each rule's `sources` list in `src/rules.js`, shown under "Where these rules come from". | ✅ |
| 09 | The tests check the court holiday calendar day by day. | Test "CA 2026 court holidays match courts.ca.gov exactly" (14 dates). Holds for 2026; other years are computed and labelled. | ✅ (2026) |
| 09 | The optional Claude button explains the letter; the deadline never comes from the AI. | `explain()` system prompt forbids stating deadlines; the deadline is rendered from `rule.compute()` before and independent of the AI call. | ✅ |
| 10 | Free, static web app; works on any phone; keeps the letter on the device; built during LexHack. | No server; responsive layout checked at 390 px; repo first commit 2026-09-26 22:4x PDT, within the event window. | ✅ ("any phone" = any phone with a modern browser) |

**Nothing to correct in the video.** One caveat worth knowing: the "52 days left" and "67 days left" figures are counts from the recording date; the dates themselves are fixed and correct.
