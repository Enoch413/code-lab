# PREP Legacy Backup

- Backup date: `2026-04-19`
- Backup branch: `codex/prep-legacy-backup`
- Backup base commit: `9e6d9b9`

## Purpose

This backup preserves the current PREP implementation before the PREP overhaul.
The new PREP can be rebuilt freely while keeping a restorable copy of the old one.

## Backed Up Files

- `index.html`
- `rotation_prep.css`
- `rotation_prep_bundle.js`
- `rotation_prep_core.js`
- `rotation_prep_passages.js`
- `rotation_prep_ui.js`
- `rotation_portal.js`
- `rotation_portal_enhancements.js`
- `ROTATION_PREP_MOBILE.html`
- `session.json`

## Restore Options

### Option 1: Restore from branch

Use the backup branch if you want the exact repo state from before the PREP overhaul.

```powershell
git checkout codex/prep-legacy-backup
```

### Option 2: Restore selected files only

If the rest of the app should stay as-is and only PREP should be restored, copy the files in this folder back to the repo root.

Example:

```powershell
Copy-Item .\backups\prep-legacy-2026-04-19\rotation_prep_core.js .\rotation_prep_core.js -Force
Copy-Item .\backups\prep-legacy-2026-04-19\rotation_prep_ui.js .\rotation_prep_ui.js -Force
```

## Notes

- `session.json` is included so the old PREP data structure can also be restored.
- The backup branch is the safest full rollback point.
- This folder backup is the fastest partial restore point.
