@echo off
setlocal

set "SCRIPT_DIR=%~dp0"
set "PYTHONUTF8=1"
set "DEFAULT_SERVICE_ACCOUNT=C:\Users\CHOI\Documents\Playground\Secrets\code-lab-service-account.json"

if "%~1"=="" (
  echo Usage:
  echo   UPDATE_FIREBASE_USER.bat --login-id currentid [options]
  echo   UPDATE_FIREBASE_USER.bat --uid firebaseuid [options]
  echo.
  echo Example:
  echo   UPDATE_FIREBASE_USER.bat --login-id msu7563 --new-login-id msu9999
  echo   UPDATE_FIREBASE_USER.bat --login-id msu7563 --name "Updated Name"
  echo   UPDATE_FIREBASE_USER.bat --login-id msu7563 --class-ids "class-1-gangseo-b"
  echo.
  echo Default service account:
  echo   %DEFAULT_SERVICE_ACCOUNT%
  exit /b 1
)

python "%SCRIPT_DIR%firebase_update_user.py" --service-account "%DEFAULT_SERVICE_ACCOUNT%" %*
if errorlevel 1 (
  echo.
  echo Command failed.
  exit /b 1
)

echo.
echo Done.
