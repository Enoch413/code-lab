# Firebase 학생 계정 일괄 생성

이 도구는 한 번의 실행으로 아래 작업을 처리합니다.

- Firebase Authentication 이메일/비밀번호 계정 생성
- Firestore `users` 문서 생성 또는 갱신

학생은 앱에서 `student01` 같은 아이디만 입력하지만, Firebase Auth 내부에는 아래처럼 저장됩니다.

- `student01` -> `student01@prep.local`

## 준비물

1. Firebase 서비스 계정 JSON
2. 학생 목록 CSV
3. Python 3
4. `firebase-admin` 패키지

## 1. 서비스 계정 JSON 받기

Firebase Console에서:

1. 프로젝트 설정
2. `서비스 계정`
3. `새 비공개 키 생성`
4. JSON 다운로드

이 파일은 매우 중요하므로 외부 공유 금지입니다.

## 2. 패키지 설치

```powershell
cd C:\Users\CHOI\Documents\CODE LAB\tools
python -m pip install -r .\requirements-firebase-admin.txt
```

## 3. CSV 준비

파일:

- [C:\Users\CHOI\Documents\CODE LAB\tools\firebase_bulk_users_template.csv](C:\Users\CHOI\Documents\CODE LAB\tools\firebase_bulk_users_template.csv)
- [C:\Users\CHOI\Documents\CODE LAB\tools\students_import.csv](C:\Users\CHOI\Documents\CODE LAB\tools\students_import.csv)

컬럼:

- `loginId`: 로그인 아이디
- `name`: 표시 이름
- `studentId`: 학생용 표시 ID
- `classIds`: 반 ID. 여러 개면 `|` 로 구분
- `allowedLabs`: 관리자 TOOLS 화면에서 보일 LAB 목록. 여러 개면 `|` 로 구분
- `initialPassword`: 초기 비밀번호
- `role`: `student` 또는 `admin`
- `adminScope`: `assigned` 또는 `all`
- `passwordResetRequired`: `true` 또는 `false`

예시:

```csv
loginId,name,studentId,classIds,allowedLabs,initialPassword,role,adminScope,passwordResetRequired
student01,홍길동,student01,class-1-gangseo-b,,pass1234,student,assigned,true
khe2016,김하은,khe2016,class-1-danwon|class-2-danwon,word-lab|pdf-lab,pass1234,admin,assigned,true
superadmin,최고 관리자,superadmin,class-1-gangseo-b|class-2-gangseo-a,all,fhaktj1619!,admin,all,true
```

설명:

- `student` 는 항상 `adminScope=assigned` 로 처리됩니다
- `admin + assigned` 는 담당 반만 운영하는 일반 선생님 계정입니다
- `admin + all` 은 최고관리자처럼 전체 반을 보는 계정입니다

## 4. 실행

```powershell
cd C:\Users\CHOI\Documents\CODE LAB\tools
python .\firebase_bulk_users.py --csv .\students_import.csv --service-account C:\path\to\service-account.json
```

또는 배치 파일:

```powershell
& "C:\Users\CHOI\Documents\CODE LAB\tools\CREATE_FIREBASE_USERS.bat" "C:\Users\CHOI\Documents\CODE LAB\tools\students_import.csv"
```

기본 서비스 계정을 아래에 두었다면 두 번째 인자를 생략해도 됩니다.

- [C:\Users\CHOI\Documents\Playground\Secrets\code-lab-service-account.json](C:\Users\CHOI\Documents\Playground\Secrets\code-lab-service-account.json)

## 5. 먼저 드라이런

```powershell
python .\firebase_bulk_users.py --csv .\students_import.csv --service-account C:\path\to\service-account.json --dry-run
```

또는:

```powershell
& "C:\Users\CHOI\Documents\CODE LAB\tools\CREATE_FIREBASE_USERS_DRYRUN.bat" "C:\Users\CHOI\Documents\CODE LAB\tools\students_import.csv"
```

## 6. 기존 계정 처리

기존 Auth 계정이 이미 있으면:

- 기본값은 Firestore `users` 문서만 갱신
- 비밀번호는 유지

기존 계정 비밀번호까지 CSV 값으로 강제 갱신하려면:

```powershell
python .\firebase_bulk_users.py --csv .\students_import.csv --service-account C:\path\to\service-account.json --update-passwords
```

## 주의

- `classIds` 는 PREP/CHECK 마스터 세션의 반 ID와 반드시 같아야 합니다
- 내부 로그인 도메인은 현재 `prep.local` 을 사용합니다
