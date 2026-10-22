# CODE LAB PREP

Firebase login-based PREP/CHECK web app for CODE LAB.

## Main files

- `index.html`
- `session.json`
- `check_data.json`
- `rotation_portal.js`
- `rotation_prep_core.js`
- `rotation_prep_ui.js`
- `rotation_prep.css`
- `firebase-config.js`

## Notes

- Student and admin auth uses Firebase Authentication.
- User profiles and CHECK submissions are stored in Firestore.
- Do not commit local secret files such as `.env.local`.

## Local checks

PREP automatic watch tracking is a local implementation pending a separately approved coordinated release. `functions/` adds a Node 22 callable `recordPrepWatch` in `asia-northeast3`, with exact dependency versions and a lockfile. It records into server-only `prepWatchProgress`, `prepWatchSessions` (one active session per Auth UID), and `prepWatchVideoMetadata`. Existing `prepVideoProgress` manual records are not rewritten, deleted, or promoted to verified completion. Instructor screens label old manual completion separately, including its original timestamp when automatic progress also exists. The client removes the manual completion action. Authentication, disabled profile, reviewed material assignment, passage assignment, video identity/version and request sequence are checked on every accepted server update. The server clock limits credit; seeks, buffering/paused intervals, duplicate retries and long gaps cannot create arbitrary credit. Real playback seconds and non-overlapping video coverage are separate. Completion requires 95% coverage and reaching the end. Telemetry cannot prove attention or prevent a determined user from simulating plausible playback over real time.

YouTube uses the official IFrame Player API. The backend obtains duration through the YouTube Data API and caches it by video identity/version; it never trusts student-supplied duration or completion. A future operational rollout requires a server-only `YOUTUBE_DATA_API_KEY` secret, API/quota and Firebase billing review, the callable, new read-only progress rules and the new `prepWatchProgress` set/class index, followed by a newly reviewed public release pin. No key belongs in `firebase-config.js`, Git, logs, or the Pages artifact. File uploads measure duration before uploading and save it in the instructor-managed material's `video.durationSeconds`. Existing native-video material without trusted duration must be reviewed before tracking can start; public MP4 and Vimeo embeds remain viewable but are not certified by this implementation. Existing video versions/progress remain stored when a video changes.

Only acknowledged server progress is shown as automatic completion. One in-flight request is stored locally under an Auth-UID- and tab-specific key and retried idempotently after failure/reopening. Playback is sampled every five seconds while playing, with state changes saved separately. Offline time and gaps longer than fifteen seconds cannot be backfilled as verified viewing; the UI explains this. Navigation/unload can lose the final unsent interval (normally up to five seconds); previously acknowledged progress remains on the server. New sessions invalidate another tab's session. Paused/ended unchanged states do not generate recurring writes. Do not clear browser storage before retrying an unacknowledged request. External YouTube-app playback cannot be tracked.

Saving a title or a different URL for the same YouTube video preserves its progress identity, including an empty legacy version. Replacing the video starts a new identity. Playback-rate transitions close the preceding interval using the previous rate and the server clock. Late acknowledgements after navigation update the same account/session's progress cache and visible passage list without repainting another player or account. Archive JSON and both Excel progress tables distinguish automatic, unverified manual and missing records; they retain playback seconds, unique coverage, duration, coverage percentage and separate automatic/manual completion timestamps. Unmeasured manual times are not reported as zero.

During a pending response, captured playback events retain their position, rate, state and monotonic capture time in order. Samples declare a bounded interval (`elapsedSeconds`); this untrusted interval consumes a server-measured time budget and cannot add time to it. Paused/buffered intervals consume time without earning credit, duplicate retries add no budget, and server gaps over fifteen seconds discard the budget. Samples without the optional interval retain the previous receipt-time behavior. The native player handles `waiting` and `playing` separately so polling cannot resume a buffered player prematurely. The event queue is in memory and capped at 32 snapshots; overflow discards uncertified intervals and resumes from a seek baseline. Only the one in-flight request is durable across reloads, so leaving during a delayed response may lose additional queued intervals.

To validate this implementation locally, install the locked server and browser dependencies, use Java 21 on PATH and Node 22 for the callable emulator, then run:

```powershell
npm ci --prefix functions --ignore-scripts
npm ci --prefix tools/browser-tests --ignore-scripts
node tools/test-prep-watch.mjs
node tools/test-prep-watch-fixes.mjs
node tools/test-prep-watch-transitions.mjs
node tools/test-prep-watch-local.mjs
```

The fixed runner starts only loopback demo Auth, Firestore and Functions emulators (`9098`, `8786`, `5001`). It temporarily creates a dummy ignored `.secret.local`, refuses to overwrite an existing one and removes its own file afterward. Emulator duration lookup requires synthetic preseeded metadata and refuses external API calls. Browser regressions exercise the actual renderer/tracker and real callable at 390/1280px with a synthetic YouTube player, and a native-video event adapter; external network requests are blocked. This does not certify physical-device playback, actual media decoding, YouTube ad behavior, production API credentials, production billing/quotas or the deployed function. Each accepted sample normally reads four Firestore documents and writes two; transaction retries and startup add work, so review expected concurrency and costs before rollout. `firebase.local.json` remains a demo test configuration and must not be used to deploy the shared project. The public artifact allowlist and fixed historical release sources are unchanged; `functions/` is also excluded from the local asset server. Provider contracts: [IFrame Player API](https://developers.google.com/youtube/iframe_api_reference), [trusted video duration](https://developers.google.com/youtube/v3/docs/videos#contentDetails.duration), [Firebase callable protocol](https://firebase.google.com/docs/functions/callable).

```powershell
node tools/test-local.mjs
```

This runs syntax checks and eighteen offline regression suites with Node 24, including the four PREP watch-fix groups, four delayed-event/buffering groups and the restricted emergency-release artifact checks. The old GRAMMAR `--rules` production API mode has been removed; extra arguments fail before tests start.

For Firestore and Storage rules, use the project-local Firebase CLI **15.34.0** lock and Java **21**. Set `JAVA_HOME` and prepend its `bin` directory to `PATH` in the current terminal if Java 11 is the default, then run:

```powershell
npm ci --prefix tools/firebase-cli --ignore-scripts
node tools/test-tooling.mjs
node tools/test-rules-local.mjs
```

The runner accepts no arguments, uses `firebase.local.json`, and starts only loopback Firestore (8786) and Storage (9298) emulators for `demo-codelab-reaudit`. It runs `tools/test-rules-suites.mjs`, which executes the Firestore and Storage checks in sequence. Tests refuse unexpected emulator endpoints. They never use the production project or CLI login credentials for data access. No production project alias or deployment configuration is supplied. Emulator permission checks do not prove that production composite indexes are installed. Both local runners invoke `tools/firebase-cli` directly, preserving the old global installation. The validated overrides and limitations are recorded in `tools/firebase-cli/README.md`.

For real SDK Auth/profile recovery checks, install the same **10.12.5** SDK used by the application into ignored test storage, then run:

```powershell
npm install --prefix .local/firebase-sdk --ignore-scripts --save-exact --no-audit --no-fund firebase@10.12.5
node tools/test-auth-integration-local.mjs
```

This fixed runner starts only Auth (9098) and Firestore (8786) demo emulators. The actual student-creation function runs against real SDK Auth and Firestore with synthetic accounts and in-memory random passwords. It checks administrator session preservation, compensation/retry, lost acknowledgements, uncertain reads and transactions. The secondary app initializes Auth only, matching the application; initializing unused Firestore in that app caused the earlier test-cleanup timeout. A VM-only serialization adapter bridges object prototypes without replacing SDK network calls. Browser interaction and production login are outside this check. The SDK version is preserved, not upgraded; the CLI-only advisory result does not certify the separate test SDK dependency tree.

The GitHub workflow runs these same local checks without secrets or deployment steps. Python admin tools retain their existing architecture and `firebase-admin==7.7.0`. `tools/requirements-firebase-admin.txt` declares the direct dependency; `tools/requirements-firebase-admin.lock` pins the 35 resolved distributions with hashes, preserving the locally installed versions. The lock was installed and checked in a separate Windows CPython 3.14 environment; other interpreter/platform combinations have not been verified. For a fresh development environment, install with:

```powershell
python -m venv .venv
.venv\Scripts\python.exe -m pip install --require-hashes -r tools/requirements-firebase-admin.lock
.venv\Scripts\python.exe -m pip check
```

Do not run roster import, account update or exam reset tools as a smoke test. Locked versions and verified hashes improve reproducibility; they do not certify that dependencies have no vulnerabilities.

Serve public assets at `http://127.0.0.1:8000` in another terminal with `python tools/serve-local.py`. The server uses the Git tracked-file list and excludes tools, hidden files, private documents and backups; newly created application assets must be tracked before it serves them. Do not use a generic repository-wide file server.

For the browser regressions, use the installed Playwright CLI:

```powershell
playwright-cli -s=codelab-a11y open --browser=msedge
playwright-cli -s=codelab-a11y run-code --filename=tools/test-accessibility-browser.js
playwright-cli -s=codelab-a11y run-code --filename=tools/test-p1-browser.js
playwright-cli -s=codelab-a11y run-code --filename=tools/test-session-recovery-browser.js
playwright-cli -s=codelab-a11y run-code --filename=tools/test-grammar-recovery-browser.js
playwright-cli -s=codelab-a11y run-code --filename=tools/test-check-practice-browser.js
playwright-cli -s=codelab-a11y run-code --filename=tools/test-prep-entry-browser.js
playwright-cli -s=codelab-a11y close
```

The browser check uses synthetic local state, blocks production API requests and service workers, and verifies visible menu focus/contrast, keyboard trapping and password validation. It does not sign in to Firebase or save data.

The P1 browser check verifies PREP title/link drafts during saving, failure and success, preservation of other rows, dynamic button decoration settling to zero idle mutations, and the disabled exam reset button.

Session recovery checks cover server-confirmed PREP reads, cached/offline failures, credential and profile completion order, CHECK entry/save transitions and scoped equality queries. Auth feedback checks connect the real observer, router, screen and error output: current profile/disabled-account notices survive sign-out notification timing, retries and logout clear old notices, and late sign-out completions preserve newer feedback. The browser check includes the real Firebase SDK with networking disabled, synthetic Auth events, stale credential/form completion, CHECK failure/retry, and all three admin dialogs discarding private drafts and releasing keyboard focus on logout at desktop and mobile widths, including saving/loading states.

GRAMMAR progress stores unsent changes synchronously under an Auth-UID-specific device key before the normal eight-second network timer. The pending records omit profile name, email, login ID, student ID and class assignments. Reload/offline recovery and an online event retry only the current student's records, merging watched ranges and completion with the latest server document in a transaction. Acknowledgements leave newer unsent changes intact. The player labels pending synchronization; device-storage failure shows a warning. Clearing browser storage before synchronization discards that unsent progress. Simultaneous localStorage writes from different tabs are not transactional; serialized tab updates and server transaction merges are tested.

CHECK is a self-study and second-round wrong-question practice record, not an official or server-certified grade. Subjective questions retain the existing student's right/wrong self-marking. Own-record Firestore writes can still forge grading flags; the emulator test documents that boundary rather than claiming to block it. Unknown grading is excluded from correct/wrong lists, and submission summaries are derived from answers. Screens and Excel exports state the practice purpose. Normal objective/self-marked grading, answer corrections, wrong-question lists and exported purpose labels are tested; the external PDF LAB generation pipeline is outside this repository's local checks.

Seven authentication functions have one authoritative declaration in `rotation_portal.js`; three CHECK persistence/normalization functions have one in `rotation_portal_enhancements.js`. The existing route wrapper and HTML script order remain intact. Other UI overrides are outside this cleanup. Single-set editor reads request one server-confirmed document, retain the existing authenticated REST fallback and local preview mode, and discard results after a session change. Aggregate callers still use their existing scoped list queries.

After authentication, the home or required-password-reset screen opens immediately; PREP synchronization is not a login dependency. Firebase startup also skips the legacy static `session.json` bootstrap, which remains available in local preview mode. Entering PREP shows loading/error/retry feedback in its existing screen and hides previous content until ready. Independent material sources and server-confirmed progress load in parallel under one 20-second deadline, and only the current complete result installs the bundle, inventory and progress. Timeouts keep previous data intact and discard late results; screen/account/request changes cannot pull navigation back. History restoration and refresh reuse PREP entry when loading or failed. The browser check exercises stalled PREP alongside CHECK/GRAMMAR, timeout/retry, keyboard feedback and logout at 390/1280px with synthetic services and a controlled expiry. In-flight SDK reads are not forcibly canceled by the timeout; their late results are ignored.

## Authorization and assignment contract

- Active full administrators retain full access. Active limited instructors query records and materials by assigned `classIds`, in groups of 30, with document-ID deduplication. Students query their own records by Auth UID.
- Disabled profiles cannot access protected Firestore records or learning material. Their own profile remains readable so the app can explain the disabled state. New students start with no class assignments.
- The local `storage.rules` candidate starts from the previously preserved shared Storage rules. It requires a current active profile. PREP reads and limited-instructor create/update/delete requests bind `prep-videos/{classId}/{setId}/...` to the reviewed single-class `portalPrepSets/{setId}` document: class members can read class assignments, personal targets use Auth UIDs, and limited instructors stay within their assigned class. This includes metadata updates, preventing instructors from issuing download links for unreadable legacy or mismatched files. Full administrators retain repair access to legacy files. GRAMMAR reads require a student's `all` or exact object-path grant; management requires full-admin scope and the existing email allowlist. Active PDF LAB administrators retain shared-library image access. MIME and size limits are unchanged. Regression checks include replacement/deletion, token-metadata updates, range reads, permission revocation with an existing token, missing profiles, legacy material and shared image flows.
- These rules govern authenticated Storage requests. PREP now stores object paths without calling `getDownloadURL()` and uses the existing authenticated GRAMMAR downloader for protected video bytes. Same-bucket legacy Storage URLs are normalized to authenticated paths; invalid paths fail closed. Navigation/account reset cancels loads and releases blob URLs. Existing bearer links outside this renderer still require a separate token inventory/revocation; neither rules nor this client change revokes them. Video buffering and physical-mobile playback remain rollout checks. See [P1 rollout](docs/P1_ROLLOUT.md) for local cross-app tests and operational gates.
- Reviewed PREP/CHECK documents expose canonical root fields: `accessSchemaVersion: 1`, `classIds`, `assignmentMode` (`class` or `personal`) and `targetUserIds` (Auth UIDs). New saves contain one class per document. Students query reviewed class assignments and their own reviewed personal assignments separately. Limited instructors cannot read or promote unreviewed legacy material. Personal uploads without Auth UIDs fail explicitly; names, login IDs and email addresses are not authorization keys.
- `portalContent` aggregate documents are full-admin-only. A client-side filter cannot protect data already downloaded. GRAMMAR permission controls require both full-admin scope and the existing manager allowlist. PDF LAB retry ownership rules remain intact.
- Counseling request text is private to its owner and scoped instructors. Public slot occupancy uses a field allowlist for request/owner IDs, class IDs, time and status. Legacy slots with extra private fields remain readable only to their owner and scoped instructors/full admins; existing status-only updates preserve those fields without making them public. New private fields are rejected. Other users fail closed when such an unsafe legacy slot is encountered; reviewed cleanup is a separate operational task.
- CHECK answer changes merge into the latest document in a transaction; only changed questions are submitted. Entry commits the set, answers and drafts together after all reads succeed; failures preserve the previous consistent view and explain how to retry. Late saves cannot repaint another set/account. Noncanonical legacy response IDs require reviewed conversion rather than starting a second editable response.
- Specific student/set reads combine their equality filters with the user's server-side scope. Aggregate callers keep their full authorized scope. `firestore.indexes.json` includes the three equality/class-scope indexes for GRAMMAR progress, PREP progress and CHECK responses; production installation is a separate rollout step.

Firestore queries must satisfy their rules, because [rules are not result filters](https://firebase.google.com/docs/firestore/security/rules-query). CHECK and counseling writes follow [Firestore transaction requirements](https://firebase.google.com/docs/firestore/manage-data/transactions), including reading all documents before writing.

## Before any future production rollout

These local changes must not be deployed by themselves over unreviewed legacy data:

1. Obtain an authorized export separately and preserve its original hash and private storage location. Do not download production data as part of local tests or place exports in the web root.
2. Inspect legacy `portalContent/prep-session`, `check-data` and `prep-classes`. Split aggregate material into managed `portalPrepSets`/`portalCheckSets` documents. Each class document's payload must contain only that class's material. A shared document is appropriate only when the entire payload is intentionally shared with every assigned class.
3. Review each document before setting `accessSchemaVersion: 1`; do not bulk-stamp legacy content. Normalize root assignment fields. Resolve personal targets to verified Auth UIDs; ambiguous name-only matches must stop for manual review. Existing documents without the reviewed schema marker, and class documents missing `assignmentMode`, will not appear in new student or limited-instructor queries until reviewed. Keep aggregate originals private and unchanged until conversion is approved and validated.
4. Check legacy CHECK response IDs and progress records missing `classIds`. Owners/full administrators can still read their own/all records, while limited-instructor queries deliberately exclude records without class scope. Prepare a reviewed conversion plan without rewriting history during a browser read.
5. Reconcile `firestore.rules`, `firestore.indexes.json`, the local `storage.rules` candidate and the new assignment contract with the shared PDF LAB owner. PDF LAB material delivery must adopt the reviewed single-class schema before a coordinated rollout; its existing deliveries do not automatically acquire the marker. Verify equivalent synthetic workflows for both apps. PREP Storage paths must resolve to the actual reviewed material document ID and class; legacy or sanitized IDs require a reviewed mapping or path migration before student/instructor access can be expected. Existing download-token URLs need separate inventory/revocation and a compatible authenticated delivery plan. The Storage candidate is not deployed; do not deploy either app's older Storage copy over it.
6. Only after separate approval, coordinate data preparation, required indexes, rules and app rollout. Keep an explicit rollback plan. This repository's CI and local runners cannot perform those actions.

Browser exam reset is intentionally disabled. The existing administrative reset script is a separate, destructive operational tool; it was not run by these local checks. A downloaded archive alone is not proof of a recoverable backup.

## Private imports

Only the header-only `tools/firebase_bulk_users_template.csv` belongs in Git. Keep operational rosters, temporary passwords, backups and service-account keys outside the repository and web root. See [SECURITY.md](SECURITY.md) and [FIREBASE_BULK_USERS.md](FIREBASE_BULK_USERS.md).

## Emergency public-release preparation

`node tools/build-public.mjs` creates a fresh ignored `.local/public-release-*/site` directory from the fixed, reviewed P0 commit in `tools/public-release.json`. It copies only 18 explicit application assets and generates empty `session.json`, empty `check_data.json`, and `.nojekyll`. It does not copy the working directory, legacy learning passwords, tools, documents, backups or Firebase rules. The source preserves the previously deployed Firestore contract; it intentionally excludes the later P1 rollout. The two tracked static data files are also empty to prevent raw GitHub exposure on a future push; their originals were preserved in restricted ignored storage. Local JSON preview now requires an operator-selected private file. Local HTML/CSS/PWA dependencies and secret markers are checked before output. Known private roster/password comparisons are an additional operator-only check, not a universal PII detector.

Run `node tools/test-public-release.mjs` for synthetic forbidden-file, credential, legacy-data and broken-dependency cases. Its shared CSV policy rejects every tracked `.csv` path regardless of case except the exact `tools/firebase_bulk_users_template.csv` path, whose contents must be the existing header only. Tests include renamed/nested/uppercase CSV paths and single-line data disguised as a template; failures withhold contents. The regression CI fetches the local history needed for the fixed source commit, but does not build/upload/deploy an artifact. If approved history cleanup changes that commit ID, update and review the manifest; never silently fall back to HEAD.

The manual P0 release workflow is prepared locally at `.github/workflows/pages-emergency.yml`. It runs only by `workflow_dispatch` on `main`, uploads only the generated `site` directory, and deploys through the protected `github-pages` environment. It has not been committed, pushed or run. G2 switched Pages to Actions and configured the `main` branch restriction and required reviewer `Enoch413` on 2026-10-21; recheck those settings before an approved release. A push does not trigger this release workflow. Run `node tools/test-tooling.mjs` after the pinned local tooling installation for workflow protection regression checks. See [the exposure response plan](docs/PUBLIC_EXPOSURE_RESPONSE.md) for separate commit/push/deployment approvals and account/history/cache work. Building this candidate does not revoke credentials, remove public Git history or change live Pages.
