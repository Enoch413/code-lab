# Firebase User Update

Use this when a student wants to change login ID, name, class, role, or password-reset status.

## Files

- `tools/firebase_update_user.py`
- `tools/UPDATE_FIREBASE_USER.bat`
- `tools/UPDATE_FIREBASE_USER_DRYRUN.bat`

## What it updates

- Firebase Authentication user email
- Firebase Authentication display name
- Firebase Authentication disabled state
- Firestore `users/{uid}` document
- Optional TOOLS LAB visibility via `allowedLabs`

Because this project logs in with `loginId` but stores auth users as internal emails,
changing the login ID also changes the internal Firebase email:

- `msu7563` -> `msu7563@prep.local`

## Safe workflow

1. Run the dry-run BAT first
2. Check the output
3. Run the real BAT

## Common examples

### 1. Change login ID

```powershell
& "C:\Users\CHOI\Documents\CODE LAB\tools\UPDATE_FIREBASE_USER_DRYRUN.bat" --login-id msu7563 --new-login-id msu9999
& "C:\Users\CHOI\Documents\CODE LAB\tools\UPDATE_FIREBASE_USER.bat" --login-id msu7563 --new-login-id msu9999
```

### 2. Change displayed name

```powershell
& "C:\Users\CHOI\Documents\CODE LAB\tools\UPDATE_FIREBASE_USER_DRYRUN.bat" --login-id msu7563 --name "문시우"
& "C:\Users\CHOI\Documents\CODE LAB\tools\UPDATE_FIREBASE_USER.bat" --login-id msu7563 --name "문시우"
```

### 3. Move a student to another class

```powershell
& "C:\Users\CHOI\Documents\CODE LAB\tools\UPDATE_FIREBASE_USER_DRYRUN.bat" --login-id msu7563 --class-ids "class-2-gangseo-a"
& "C:\Users\CHOI\Documents\CODE LAB\tools\UPDATE_FIREBASE_USER.bat" --login-id msu7563 --class-ids "class-2-gangseo-a"
```

### 4. Make a user admin

```powershell
& "C:\Users\CHOI\Documents\CODE LAB\tools\UPDATE_FIREBASE_USER_DRYRUN.bat" --login-id passion413 --role admin --class-ids "class-1-gangseo-b|class-2-gangseo-a|class-1-seonbu|class-3-seonbu"
& "C:\Users\CHOI\Documents\CODE LAB\tools\UPDATE_FIREBASE_USER.bat" --login-id passion413 --role admin --class-ids "class-1-gangseo-b|class-2-gangseo-a|class-1-seonbu|class-3-seonbu"
```

### 4-1. Make a user a superadmin-style account

```powershell
& "C:\Users\CHOI\Documents\CODE LAB\tools\UPDATE_FIREBASE_USER_DRYRUN.bat" --login-id superadmin --role admin --admin-scope all --class-ids "class-1-gangseo-b|class-2-gangseo-a|class-1-seonbu|class-3-seonbu|class-1-gangseo-a|class-2-gangseo-b|class-1-danwon|class-2-danwon"
& "C:\Users\CHOI\Documents\CODE LAB\tools\UPDATE_FIREBASE_USER.bat" --login-id superadmin --role admin --admin-scope all --class-ids "class-1-gangseo-b|class-2-gangseo-a|class-1-seonbu|class-3-seonbu|class-1-gangseo-a|class-2-gangseo-b|class-1-danwon|class-2-danwon"
```

### 5. Force password reset again

```powershell
& "C:\Users\CHOI\Documents\CODE LAB\tools\UPDATE_FIREBASE_USER_DRYRUN.bat" --login-id msu7563 --password-reset-required true
& "C:\Users\CHOI\Documents\CODE LAB\tools\UPDATE_FIREBASE_USER.bat" --login-id msu7563 --password-reset-required true
```

### 6. Limit which TOOLS LAB buttons an admin can see

```powershell
& "C:\Users\CHOI\Documents\CODE LAB\tools\UPDATE_FIREBASE_USER_DRYRUN.bat" --login-id khe2016 --allowed-labs "word-lab,builder-lab"
& "C:\Users\CHOI\Documents\CODE LAB\tools\UPDATE_FIREBASE_USER.bat" --login-id khe2016 --allowed-labs "word-lab,builder-lab"
```

Notes:

- Missing `allowedLabs` means all LAB buttons stay visible
- `--allowed-labs ""` means show none
- `--allowed-labs "all"` means show all
- Supported values: `word-lab`, `pdf-lab`, `rotation-lab`, `builder-lab`, `pinpoint-lab`

### 7. Set a new temporary password

```powershell
& "C:\Users\CHOI\Documents\CODE LAB\tools\UPDATE_FIREBASE_USER_DRYRUN.bat" --login-id msu7563 --new-password pass5678 --password-reset-required true
& "C:\Users\CHOI\Documents\CODE LAB\tools\UPDATE_FIREBASE_USER.bat" --login-id msu7563 --new-password pass5678 --password-reset-required true
```

### 8. Disable login without deleting data

```powershell
& "C:\Users\CHOI\Documents\CODE LAB\tools\UPDATE_FIREBASE_USER_DRYRUN.bat" --login-id msu7563 --disabled true
& "C:\Users\CHOI\Documents\CODE LAB\tools\UPDATE_FIREBASE_USER.bat" --login-id msu7563 --disabled true
```

### 9. Re-enable login later

```powershell
& "C:\Users\CHOI\Documents\CODE LAB\tools\UPDATE_FIREBASE_USER_DRYRUN.bat" --login-id msu7563 --disabled false
& "C:\Users\CHOI\Documents\CODE LAB\tools\UPDATE_FIREBASE_USER.bat" --login-id msu7563 --disabled false
```

## Notes

- `class-ids` uses the real internal class IDs, not the Korean class name.
- The recommended order is always dry-run first, then real run.
- Service account path is already wired to:
  `C:\Users\CHOI\Documents\Playground\Secrets\code-lab-service-account.json`
