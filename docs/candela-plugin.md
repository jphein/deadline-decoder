# Deadline Decoder as a Candela plugin

Candela (techempower-org/candela) is TechEMPOWER's Android app. It already has most of the
pieces this tool needs on a phone:

| Deadline Decoder needs | Candela already has |
|---|---|
| Read the letter | `source-ocr`: photograph a paper letter, on-device OCR |
| Read the result aloud | neural TTS (Piper, Kokoro, Azure HD), sentence highlighting |
| Put the deadline on a calendar | `source-calendar` reads `CalendarContract`; an `ACTION_INSERT` intent writes an event with no extra permission |
| Explain the letter in plain words | per-book AI chat (BYOK, seven providers) |
| Turn it on or off | `@SourcePlugin` + KSP registration, one card in Settings → Plugins |

## Shape

A new module `source-deadlines`, `@SourcePlugin(id = "deadlines", displayName = "My deadlines")`.

1. **Scan.** The user scans a letter with the existing OCR flow, or picks the letter type and
   types one date.
2. **Decode.** `detect(text)` picks the rule; `findDates(text)` pulls the notice date. The user
   confirms both. The deadline comes from coded rules, never from the AI.
3. **Each letter is a "fiction", and each section is a "chapter":** your deadline, how it was
   counted, what to do, free help. Candela narrates it like any book.
4. **Calendar.** One tap inserts the deadline plus a reminder one week before, through the
   system calendar's insert screen.
5. **Agenda.** The existing calendar agenda then reads the deadline back each morning.

## Port

`src/dates.js` and `src/rules.js` are 282 lines of pure functions with no DOM, so they port
to Kotlin (`java.time.LocalDate`) directly. `tests/dates.test.mjs` becomes a JUnit test in
`core-source-testkit`, with the same fixtures. That includes the 2026 California judicial
holidays checked against courts.ca.gov. Keep one source of truth: a JSON fixture file both
test suites read, so the web and Android rules can't drift apart.

## Open questions for JP

- Should it be on by default? Candela turns OCR on by default for discoverability.
- Should it go in the TechEMPOWER-first home as its own tile, or only as a source?
- Should it share one rules fixture with the techempower.org notice-decoder page (the website
  version relayed to techempower-14)?
