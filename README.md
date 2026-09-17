# PANISA home

Thai task tracker and bookmark entry point on the owner's GitHub account, moeionblog-create. The public homepage contains sanitized task status only. On 17 September 2026 the owner requested Google login for the sales/ads report and restoring original customer names behind that login.

`report.html` now forwards to the protected report on the owner's Cloudflare Workers account: https://panisa-private-report.moeionblog.workers.dev/report.html. Existing query parameters (tab/date) are preserved. The report accepts only the owner's verified Google account. Private HTML, datasets, customer identifiers and credentials must NEVER be uploaded to this repository. Earlier public report revisions contain anonymized data only.

This change is authentication and access routing, not a data refresh. The saved report still covers 14–15 September 2026.

## Status contract

`tasks.json` is the durable shared status record. Only verified outcomes may be marked complete. Page views and passing a due date never mark work complete or advance the next scheduled run. Dates include the Bangkok offset. The page shows the recorded time separately from the time it fetched the record; an offline fetch must show an error instead of pretending to have checked live work.

Supported task states: scheduled, review, running, blocked, failed, complete. Completion requires `lastSuccessAt` and a sanitized result in `lastResult` and history. A recurring task returns to scheduled after verified success, retaining lastSuccessAt, lastResult and its completion history. Set nextRunAt from the confirmed schedule, not a guessed execution. If a task has started more than six hours ago without a final result, the page shows that the outcome is missing. An overdue scheduled task remains overdue until an actual status update.

Automated writers: pull latest source, preserve other tasks, update checkedAt/updatedAt, and append a factual history item. Record running before actual work and a final state afterward. Never publish customer identifiers, order identifiers, emails, phones, audience IDs, account IDs, internal file paths, credentials, private receipts or raw exports. Detailed evidence stays private; public results contain only a brief operational outcome. Push and verify Pages publication; a local edit is not an online update. Report any failed status publication in the original task.

This page reads the status file every five minutes while visible. It does not execute tasks or send background push notifications. The desktop automation needs its host available. No daily sales-report automation has been implied or added.

To preview, serve this directory over HTTP. No installation or build is needed.

