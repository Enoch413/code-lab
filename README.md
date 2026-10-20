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

```powershell
node tools/test-local.mjs
```

This runs syntax checks and twelve offline regression suites with Node 24. The old GRAMMAR `--rules` production API mode has been removed; extra arguments fail before tests start.

For Firestore and Storage rules, install Firebase CLI **15.34.0** and Java **21**. Set `JAVA_HOME` and prepend its `bin` directory to `PATH` in the current terminal if Java 11 is the default, then run:

```powershell
node tools/test-rules-local.mjs
```

The runner accepts no arguments, uses `firebase.local.json`, and starts only loopback Firestore (8786) and Storage (9298) emulators for `demo-codelab-reaudit`. It runs `tools/test-rules-suites.mjs`, which executes the Firestore and Storage checks in sequence. Tests refuse unexpected emulator endpoints. They never use the production project or CLI login credentials for data access. No production project alias or deployment configuration is supplied. Emulator permission checks do not prove that production composite indexes are installed.

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
- These rules govern authenticated Storage requests. Existing Firebase download-token URLs remain bearer links, including URLs produced by the current PREP upload code's `getDownloadURL()`. Rule changes alone do not revoke them. The Storage regression explicitly documents that boundary using a synthetic token without printing it. Token inventory/revocation and a future authenticated PREP delivery flow require separate work; no production token or object was changed.
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
