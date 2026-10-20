# Firebase 학생 계정 일괄 생성

이 도구는 Auth 계정과 Firestore `users` 프로필을 생성·갱신합니다. 학생 로그인 ID는 내부적으로 `example-student@prep.local` 같은 이메일로 변환됩니다.

## 명단과 초기 비밀번호 보관

- Git에는 `tools/firebase_bulk_users_template.csv`의 헤더만 보관합니다. 실제 명단·초기 비밀번호·서비스 계정 키를 저장소에 넣지 마세요.
- 실제 CSV는 저장소와 웹 서버 경로 밖의 접근 제한된 로컬 폴더에 보관합니다. `backups`, `.local`, `private`, `secrets`와 tools의 운영 CSV는 Git에서 제외됩니다.
- 신규 계정마다 서로 다른 12자 이상의 임시 비밀번호를 사용하고 `passwordResetRequired=true`로 지정하세요. 공개된 공통 비밀번호는 제공하지 않습니다.
- 기존에 공개된 자료는 파일 삭제만으로 Git 이력·배포 사본에서 없어지지 않습니다. 이력 정리와 기존 계정 자격증명 대응은 별도 승인된 운영 작업입니다.

## 준비와 CSV 작성

Python과 `tools/requirements-firebase-admin.txt`의 의존성이 필요합니다. 헤더 템플릿을 안전한 로컬 폴더로 복사한 후 관리자가 실제 값을 입력합니다.

| 컬럼 | 용도 |
|---|---|
| loginId / name / studentId | 로그인 ID, 표시 이름, 학생 표시 ID |
| classIds | 내부 반 ID, 여러 개는 `|`로 구분 |
| allowedLabs | 관리자 LAB 목록, 여러 개는 `|`로 구분 |
| initialPassword | 개인별 임시 비밀번호, 12자 이상 |
| role | student 또는 admin |
| adminScope | assigned 또는 all; 학생은 assigned |
| passwordResetRequired | 신규 계정은 true |

반 ID는 저장소 밖의 비공개 반 ID 관리 자료를 확인하세요. 서비스 계정 JSON도 저장소 밖에 보관합니다.

## 명령 형식

아래 경로는 자리표시자입니다. 실제 명단과 키 경로를 넣어 드라이런 결과를 검토한 뒤 실행합니다. 드라이런도 Auth 조회 등 운영 읽기를 할 수 있으므로 완전한 오프라인 검사가 아닙니다.

```powershell
python .\tools\firebase_bulk_users.py --csv "C:\private\student-import.csv" --service-account "C:\private\service-account.json" --dry-run
```

쓰기 실행은 같은 명령에서 `--dry-run`을 제거합니다. `CREATE_FIREBASE_USERS_DRYRUN.bat`와 `CREATE_FIREBASE_USERS.bat`에도 명단·키 경로를 인자로 넘길 수 있습니다.

기존 계정은 기본적으로 프로필만 갱신하고 Auth 비밀번호는 유지합니다. `--update-passwords`는 기존 비밀번호를 바꾸는 옵션이므로 별도 계정 변경 작업에서만 사용합니다.

## 관리자 웹 화면의 학생 CSV

학생 변동 CSV의 `initialPassword`는 신규 학생에게만 필수입니다. 기존 학생은 비워도 되며 이 화면은 기존 비밀번호를 변경하지 않습니다. 신규 학생의 비밀번호는 Auth 생성에만 전달하며 Firestore 프로필·현재 CSV 내보내기·콘솔에 기록하지 않습니다. 전체 반영이 끝나면 업로드 상태에서도 제거합니다. 입력 CSV 원본은 관리자가 안전하게 보관해야 합니다.

웹 화면에서 신규 Auth 생성 후 프로필 저장이 실패하면 같은 UID를 서버에서 다시 확인합니다. 요청한 프로필이 이미 저장됐다면 성공으로 처리하고, 프로필이 없다고 확인된 경우에만 이번에 만든 Auth 계정을 취소해 같은 CSV를 재시도할 수 있게 합니다. 서버 확인 실패·다른 프로필 존재·계정 취소 실패는 UID와 복구 필요 안내를 표시합니다. 이 경우 반복 적용하지 말고 별도 승인된 계정 복구 작업으로 확인해야 합니다. 기존 계정을 이메일로 찾아 자동 삭제하거나 로그인하지 않습니다. 앞선 CSV 행은 이미 적용됐을 수 있으며, 이 보완은 배치 전체의 원자적 취소를 보장하지 않습니다. Python 일괄 도구의 생성 로직은 이번 웹 화면 보완 대상에 포함하지 않습니다.
