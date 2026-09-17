# PANISA home

Thai task tracker and single bookmark entry point for the PANISA sales and ads report, hosted on the user's GitHub Pages without login at their explicit request. Open `report.html` for the portable interactive report. Its reviewed data covers 14–15 September 2026; this is a saved report, not a live connection. Customer names are replaced with anonymous conversation codes; contact details, private messages and account/order identifiers are excluded. The original private source stays outside this repository.

## Status contract

`tasks.json` is the durable shared status record. Only verified outcomes may be marked complete. Page views and passing a due date never mark work complete or advance the next scheduled run. Dates include the Bangkok offset. The page shows the recorded time separately from the time it fetched the record; an offline fetch must show an error instead of pretending to have checked live work.

Supported task states: scheduled, review, running, blocked, failed, complete. Completion requires `lastSuccessAt` and a sanitized result in `lastResult` and history. A recurring task returns to scheduled after verified success, retaining lastSuccessAt, lastResult and its completion history. Set nextRunAt from the confirmed schedule, not a guessed execution. If a task has started more than six hours ago without a final result, the page shows that the outcome is missing. An overdue scheduled task remains overdue until an actual status update.

Automated writers: pull latest source, preserve other tasks, update checkedAt/updatedAt, and append a factual history item. Record running before actual work and a final state afterward. Never publish customer identifiers, order identifiers, emails, phones, audience IDs, account IDs, internal file paths, credentials, private receipts or raw exports. Detailed evidence stays private; public results contain only a brief operational outcome. Push and verify Pages publication; a local edit is not an online update. Report any failed status publication in the original task.

This page reads the status file every five minutes while visible. It does not execute tasks or send background push notifications. The desktop automation needs its host available. No daily sales-report automation has been implied or added.

To preview, serve this directory over HTTP. No installation or build is needed.
