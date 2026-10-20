# Private data and local security checks

- Publish only the empty import template. Keep real rosters and credentials outside this repository and the web root, with access limited to the operator.
- `backups/`, `.local/`, `private/`, `secrets/`, and operational CSV files under `tools/` are ignored. An ignore does not protect a file already committed: review `git status` before committing.
- New student accounts require an individual temporary password of at least 12 characters. No shared initial password or built-in preview account is supplied. Keep `passwordResetRequired=true` for new accounts.
- The administrator student CSV uses `initialPassword` only for new accounts. Existing-account updates do not reset passwords. Passwords are passed separately to Auth and are not written to Firestore profiles or current-roster exports.
- If a new student's profile write fails, creation reads that UID from the server before taking action. A matching committed profile counts as success; a confirmed absent profile permits deleting only the Auth user returned by this attempt. Failed/uncertain reads, conflicting profiles or failed compensation stop with a recovery-required UID. Do not repeatedly apply the CSV in that state. Secondary Auth sign-out and app cleanup are attempted on every exit; cleanup failure does not turn an already saved profile into a failed creation. This is compensation across two services, not an atomic transaction.
- `escapeJs` is specifically for a single-quoted JavaScript string inside a double-quoted HTML event attribute. It encodes both contexts, including ampersands to prevent entity decoding from reintroducing quotes. Do not use it for URLs, raw HTML or complete JavaScript expressions. New UI should prefer DOM event listeners.
- Firestore document IDs take precedence over an untrusted `id` field in question and counsel records.

Run `node tools/test-security-boundaries.mjs` for synthetic local checks. These tests do not access production Firebase or create real accounts.

Run `node tools/test-student-creation-recovery.mjs` for synthetic failed-write, lost-response, compensation, existing-account protection and partial-batch retry checks. They do not initialize a real Firebase SDK.

## Previously published data

Removing working copies does not remove historical commits, GitHub copies or existing deployments, and it does not revoke old passwords. Inventory and credential response, Git-history cleanup and deployment require a separately reviewed operational change. Preserve restricted originals before cleanup. Do not rewrite shared history or reset production accounts as part of a local code fix.
