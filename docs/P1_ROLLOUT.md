# P1 local verification and coordinated rollout

No command in this document authorizes production access, account changes, deployment, token revocation or Git publication. The emergency P0 public candidate remains pinned to its separately reviewed commit; it excludes this P1 rollout.

## 1. Reproduce the local cross-app check

Use Node 24, Java 21, the existing pinned Firebase CLI, and a reviewed sibling checkout named `PDF LAB` next to `CODE LAB`.

```powershell
npm ci --prefix tools/firebase-cli --ignore-scripts
npm ci --prefix tools/browser-tests --ignore-scripts
node tools/test-cross-app-local.mjs
```

On Windows the runner uses installed Edge. Linux CI installs the pinned Playwright Chromium binary with `node tools/browser-tests/node_modules/playwright/cli.js install --with-deps chromium` first. The test dependency uses the same exact Playwright build as the installed browser CLI; it is isolated from app dependencies.

The runner accepts no arguments, requires fixed loopback Auth/Firestore/Storage emulators and a demo project, substitutes synthetic browser Firebase configuration before startup, disables service workers, and blocks external requests except the apps' exact pinned Firebase CDN scripts. Only the demo Storage URL is redirected to the loopback emulator. The local server serves tracked public assets and synthetic configuration, never private exports or `.local` files. It creates synthetic accounts with in-memory random passwords and does not log credentials.

The test uses real app renderers, Firebase SDK writes and rules: PDF assignment → student partial CHECK submission → PDF response synchronization → rejected write/draft retention/retry → second-round candidate selection/generation → owner-scoped remote save/reload. A valid nonempty PREP candidate must survive the actual student read/normalizer. Administrator regressions run the actual JSON import builder, YouTube replacement, both video deletion paths and SDK reload; local unit checks also cover failed saves/retries, cancellation, stale sessions and legacy source aliases. It checks CHECK at 390/1280 CSS pixels and authenticated PREP delivery plus profile revocation. Synthetic video bytes verify delivery and denial, not codec playback. Existing separate tests cover Auth creation/rollback and Firestore/Storage scope matrices.

The workflow adds an isolated Windows CPython 3.14 hashed dependency installation/check. Cross-app Ubuntu testing is an explicit manual workflow input `pdf_lab_ref`, a reviewed 40-character PDF LAB SHA. It cannot run against unpublished local commits. Publishing both reviewed test branches and starting that workflow need separate approval. Neither job deploys. A Windows local pass is not an Ubuntu CI pass.

## 2. Prepare legacy candidates without applying them

`node tools/prepare-legacy-rollout.mjs PRIVATE_EXPORT.json REVIEWED_REPLACEMENTS.json` only reads local JSON and creates a new ignored `.local/legacy-plan-*` directory. It has no Firebase/network/credential or apply/delete capability. Keep its entire output private; it includes the source snapshot, proposed writes and rollback data. Before writing, it removes inherited Windows access and grants only the current user, SYSTEM and Administrators; it stops if that fails. Other platforms use the private temporary-directory/file modes. Protect the operator's input files separately.

Export input format: `{ "documents": [{ "collection": "portalPrepSets", "id": "example", "data": {} }] }`. Include the exact `users/{Auth UID}` profile snapshots needed for personal targets, as well as all source and destination documents. The tool cannot prove an export is current or that its document IDs are genuine Auth UIDs. Verify those separately under an approved operational inspection.

Review format: `{ "replacements": [{ "source": "portalPrepSets/example", "sourceHash": "SHA256 of JSON.stringify(original data)", "document": { "collection": "portalPrepSets", "id": "reviewed-target", "data": {} } }] }`. Use the exported `digest` helper to calculate hashes locally; never paste private JSON into a public issue. An empty replacements array produces an inventory with unresolved counts.

Candidates must satisfy the single-class marker, matching root/payload IDs and assignment fields, active UID profile/class matching for personal targets, and PREP Storage class/document paths. PREP requires nonempty passages and one matching class assignment with nonempty, unique integer indexes within the passage range. Protected Storage URLs, including legacy URL aliases, require an explicitly reviewed object path; the tool does not infer a path from a URL. Root/nested path fields must agree. Unknown/mixed aggregate content requires manual review and splitting into independently reviewed payloads. The tool does not infer targets from names, grant access by adding a marker, or automatically copy mixed payloads. A passing schema validation cannot prove that prose, nested metadata or embedded URLs contain only the intended class's content: inspect every split payload privately. Remove obsolete bearer URLs from reviewed payloads and arrange separate token revocation; an explicit path does not invalidate an old URL.

Counsel slot candidates may only remove fields outside the existing public allowlist; ownership/reservation fields remain byte-for-value equivalent. Response ID candidates preserve the entire response and require `userId__checkSetId`. Destination collisions, stale source hashes and duplicate targets stop preparation. Conflicting answers require manual merge review. Old response deletion is deliberately absent: a separate approved cleanup must prevent duplicate analytics after a verified copy. Newly created target rollback likewise requires an approved delete; restoring originals alone does not remove new targets.

## 3. Authenticated Storage delivery

New PREP uploads persist Storage object paths without calling `getDownloadURL()`. The renderer recognizes same-bucket legacy Firebase/GCS URLs, removes bearer URLs from rendered sources, and fetches bytes with the current Auth ID token through the existing GRAMMAR download implementation. Wrong-bucket/invalid PREP paths fail closed. YouTube and external video behavior remains unchanged. There is loading/failure/retry feedback; navigation, rerendering and account reset abort pending loads and revoke blob URLs. Standalone HTML without Firebase login cannot open protected Storage videos.

This buffers the full video, like the existing GRAMMAR player. Large files can consume substantial memory; test representative approved files on physical mobile devices before rollout. Downloaded bytes cannot be recalled. Existing bearer URLs in Git, documents, browser history or other apps still work until independently revoked; changing the renderer/rules does not revoke those capabilities. Inventory all object metadata/download URLs privately, review consumers and replacement paths, and revoke/rotate tokens only after separate approval. Do not log URL query strings or tokens.

## 4. Operational gates — separate approval required

1. Complete the separately prepared P0 exposure/account/history response. Do not push `main`: its existing Pages trigger can publish an unintended build. Protect fresh exports and retain the original D-drive ZIP.
2. Under an approved read-only inspection, capture current profiles, legacy sources/destinations, slots/responses, object paths/token metadata, current rules and indexes. Confirm Auth UIDs, class mappings, target collisions and every split's content. Historical local snapshots cannot establish current production compatibility.
3. Rehearse the exact approved candidates with the local rules and both reviewed app revisions. Record source/destination hashes, rules/index hashes, app commits, expected write counts and rollback operations. Compare live preconditions again immediately before any approved write; stop on drift. Prepare a maintenance window to avoid incompatible old-client writes during transition.
4. Approve additive index creation separately and wait until the required indexes are ready. Emulator tests do not enforce all production composite indexes. Approve candidate writes separately; use only full-admin repair scope, conservative batches and preconditions. Verify each batch before continuing. No bulk reset/import, account changes or blanket access grants.
5. Approve a coordinated release of both apps and the reviewed CODE LAB Firestore/Storage rules. The old PDF LAB rule copies are historical snapshots and must not overwrite this candidate. Choose order/window explicitly: old clients can fail against new rules, while new apps cannot assume a completed migration. Do not release either half alone based on local success.
6. Approve synthetic operational test accounts and their cleanup separately. Verify full/limited admin and student login, account creation/failure recovery, assignment, submission/correction/save/retry, second-round generation, counseling reservations, protected video access/revocation, real Android/iOS media playback and printing. Verify Ubuntu CI with the same reviewed revisions. Stop rollout on a failed gate.
7. Approve token revocation after compatible delivery is in place. Preserve public-denial and permitted-access evidence without secrets. On failure, stop writes and disable the affected flow; prefer restoring data/app functionality under hardened rules over automatically reopening permissions. A rollback that weakens security needs its own review and approval.

Local work cannot close production migration, token revocation, live indexes, physical-device or remote-CI gates. Keep them open until evidence from the approved execution exists.
