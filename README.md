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
node tools/test-check-entry-loading.mjs
node tools/test-grammar-only-class.mjs
node tools/test-security-boundaries.mjs
node tools/test-student-creation-recovery.mjs
node tools/test-accessibility.mjs
```

The commands above use local mocks. Do not add `--rules` to the GRAMMAR test for an offline run; that option calls the production rules testing API.

For the browser accessibility regression, serve the app at `http://127.0.0.1:8000` and run:

```powershell
playwright-cli -s=codelab-a11y open --browser=msedge
playwright-cli -s=codelab-a11y run-code --filename=tools/test-accessibility-browser.js
playwright-cli -s=codelab-a11y close
```

The browser check uses synthetic local state, blocks production API requests and service workers, and verifies visible menu focus/contrast, keyboard trapping and password validation. It does not sign in to Firebase or save data.

## Private imports

Only the header-only `tools/firebase_bulk_users_template.csv` belongs in Git. Keep operational rosters, temporary passwords, backups and service-account keys outside the repository and web root. See [SECURITY.md](SECURITY.md) and [FIREBASE_BULK_USERS.md](FIREBASE_BULK_USERS.md).
