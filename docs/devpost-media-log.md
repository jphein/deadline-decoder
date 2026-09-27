# Devpost media update — 2026-09-26 23:15 PDT (Vesper)

Submission: LexHack 2026 → Deadline Decoder (id 1200540), status SUBMITTED, unchanged.
Public page: https://devpost.com/software/deadline-decoder

## Image gallery (Project details), uploaded in this order
| # | File | Devpost photo id | Caption |
|---|------|------------------|---------|
| 1 | 1-ssa-deadline.png | 5397760 | Your real deadline, with the math shown |
| 2 | 2-three-day-notice-court-days.png | 5397789 | A 3-day notice counts court days: Thanksgiving week |
| 3 | 3-eviction-summons.png | 5397802 | Eviction papers: 10 court days to respond |
| 4 | 4-actions-and-free-help.png | 5397803 | What to do, free help, calendar, read aloud |
| 5 | 5-paste-a-letter.png | 5397804 | Paste a letter and it recognizes it |

Saved with "Save & continue". Story, Built with tags and links were not touched. Video demo link left empty.

## Thumbnail (Project overview)
1-ssa-deadline.png uploaded via "Edit thumbnail", then saved. The My projects card shows it.

## Verification
- The public page carousel opens on image 1 (SSA, 52 days left). Screenshot: `docs/devpost-public-page-2026-09-26.jpg`
- The thumbnail on the My projects card changed from the placeholder to the SSA image.

## Notes for next time
- Devpost's gallery input is jQuery-fileupload: the `input[type=file]` is replaced after each upload, so re-read its ref before every file.
- The `find` tool failed with a 429 (it runs a model). `read_page filter=all` exposes the file inputs; `filter=interactive` hides them.
- The Chrome renderer froze for about 30 s twice (screenshot timeouts) during uploads. read_page kept working.
- No terms boxes, Submit/Unsubmit, settings or logins were touched.

## YouTube demo — published 2026-09-26 ~23:28 PDT (Vesper)
- **URL:** https://www.youtube.com/watch?v=M2PIIdwoVzs (short: https://youtu.be/M2PIIdwoVzs; the ID has two capital I's, read from the DOM, not the screenshot)
- **Channel:** TechEmpowerOrg (@techempowerorg, UCWDcTi3Hz08p1UonlG4xDrg). This was the active Studio channel; no switch needed.
- **Visibility:** Public. YouTube oEmbed confirmed it at 23:28:38 PDT.
- Source file: scratch/video/out/deadline-decoder-demo.mp4 (3.0 MB; YouTube reports 2:08)
- Title: "Deadline Decoder — your real deadline, with the math shown (LexHack 2026)"
- Description: the "What it does" intro sentence with its bullet list plus the "Letters in v0.1" sentence, then the Try it and Code links, then the AI and tool disclosure paragraph verbatim.
- Settings: Not made for kids; paid promotion = No; category Science & Technology (changed from the channel default Nonprofits & Activism). Monetization and channel settings were not touched. "Publish to subscriptions feed and notify subscribers" was left at its default (on).
- **AI-use question:** answered **No**. YouTube's three triggers are a real person made to say something, altered real footage, or a realistic fake scene. None fits a screen recording with a synthetic narrator who isn't impersonating anyone. The description already discloses the synthetic narration. Flip to Yes in Studio if JP prefers the label.
- Devpost "Video demo link" set to the watch URL and saved (submission 1200540). Nothing else changed. The public page embeds the video at the top: docs/devpost-video-embed-2026-09-26.jpg
