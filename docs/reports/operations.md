# Daily NSF Operations Runbook

## Operational goals

- Keep daily report publication continuous and transparent.
- Preserve artifact diagnostics for every run.
- Support safe reruns and controlled rollback when publication errors occur.

## Definition of Done for a daily report release

- Daily `report.json` is generated and passes the report schema contract tests.
- Date-stamped page `docs/reports/daily/YYYY-MM-DD/index.html` is rendered from the same report payload.
- Required metrics are present: aggregate Lighthouse categories, accessibility impact estimates, URL run counts (`succeeded` / `failed` / `excluded`), and trend/history data.
- `docs/reports/history.json` is updated and respects configured lookback limits.
- Committed snapshot outputs and artifact manifest remain in sync for run date/id, hashes, and byte counts.
- Failure runs publish explicit failure report/page plus diagnostics artifact (no silent drop).
- Published HTML keeps accessibility landmarks and escapes external/user-provided text.
- Rerunning the same date safely overwrites snapshot output and deduplicates the history entry.
- Validation passes before merge: `npm test` and publishing smoke coverage.
- Final merge requires reviewer sign-off for report accuracy, publishability, and archive integrity.

## Routine execution

- Scheduled execution is handled by `.github/workflows/daily-scan.yml`.
- Manual rerun is available via workflow dispatch inputs:
  - `run_date`
  - `url_limit`
  - `traffic_window`
  - `dry_run`

## Local operator commands

- Dry run validation:
  - `npm run dry-run -- --source-file tests/fixtures/dap-sample.json`
- Full mock orchestration run:
  - `node src/cli/run-daily-scan.js --source-file tests/fixtures/dap-sample.json --scan-mode mock`
- Run a specific date:
  - `node src/cli/run-daily-scan.js --date 2026-02-21 --scan-mode mock --source-file tests/fixtures/dap-sample.json`
- Live scan with custom timeout:
  - `node src/cli/run-daily-scan.js --scan-mode live --timeout-ms 60000 --limit 10`


## Failure handling

When a run fails:

- Failure payload is written to `docs/reports/daily/YYYY-MM-DD/report.json`.
- Failure page is written to `docs/reports/daily/YYYY-MM-DD/index.html`.
- Diagnostics summary is written to `artifacts/YYYY-MM-DD/run-summary.json`.
- Workflow uploads the diagnostics bundle as a GitHub Actions artifact.

## Recovery and rollback

1. Inspect latest workflow run logs and uploaded artifact.
2. Confirm whether failure is environmental (transient) or functional (code/data contract).
3. For transient failures, rerun workflow dispatch for the same date.
4. For functional issues, fix on a branch and rerun manually in dry-run mode first.
5. If published snapshot is bad, revert only affected `docs/reports/` paths and re-run publish workflow.

## Safe config changes

- Edit `src/config/prevalence.yaml` for:
  - `scan.url_limit`
  - `scan.history_lookback_days`
  - `scan.traffic_window_mode`
  - impact prevalence rates and severity weights
- Validate with:
  - `npm test`
  - `npm run dry-run -- --source-file tests/fixtures/dap-sample.json`

## Troubleshooting notes

- Scanner execution failures are expected to produce partial reports rather than silent drops.
- Missing page-load counts are retained for diagnostics and excluded from weighted traffic math.
- Avoid empty snapshot commits: workflow already checks for docs changes before committing.
- **Lighthouse scan timeouts:** If most scans fail with timeout errors, increase the timeout value using `--timeout-ms` (default: 20000ms). Lighthouse scans typically require 45-60 seconds in production environments. The GitHub Actions workflow uses 60 seconds (`--timeout-ms 60000`).
