@echo off
setlocal

set "SCRIPT_DIR=%~dp0"
set "PYTHONUTF8=1"
set "DEFAULT_SERVICE_ACCOUNT=C:\Users\CHOI\Documents\Playground\Secrets\code-lab-service-account.json"

if "%~1"=="" (
  echo Usage:
  echo   CREATE_FIREBASE_USERS.bat "students_import.csv" ["service-account.json"]
  echo.
  echo Example:
  echo   CREATE_FIREBASE_USERS.bat "%SCRIPT_DIR%students_import.csv"
  echo   CREATE_FIREBASE_USERS.bat "%SCRIPT_DIR%students_import.csv" "C:\path\to\service-account.json"
  echo.
  echo Default service account:
  echo   %DEFAULT_SERVICE_ACCOUNT%
  exit /b 1
)

set "CSV_PATH=%~1"
set "SERVICE_ACCOUNT=%~2"
if "%SERVICE_ACCOUNT%"=="" set "SERVICE_ACCOUNT=%DEFAULT_SERVICE_ACCOUNT%"

if not exist "%CSV_PATH%" (
  echo CSV file not found:
  echo   %CSV_PATH%
  exit /b 1
)

if not exist "%SERVICE_ACCOUNT%" (
  echo Service account file not found:
  echo   %SERVICE_ACCOUNT%
  exit /b 1
)

python "%SCRIPT_DIR%firebase_bulk_users.py" --csv "%CSV_PATH%" --service-account "%SERVICE_ACCOUNT%"
if errorlevel 1 (
  echo.
  echo Command failed.
  exit /b 1
)

echo.
echo Done.
