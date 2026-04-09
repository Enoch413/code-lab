# PREP / CHECK Firebase 설정

## 1. Firebase 프로젝트 만들기
- Firebase 콘솔에서 새 프로젝트 생성
- Authentication에서 `이메일/비밀번호` 로그인 활성화
- Firestore Database 생성

## 2. 웹 앱 등록
- 웹 앱을 추가한 뒤 Firebase 설정값을 복사
- [firebase-config.js](C:\Users\CHOI\Documents\CODE LAB\firebase-config.js)에 붙여 넣기

## 3. Firestore 규칙 적용
- [firestore.rules](C:\Users\CHOI\Documents\CODE LAB\firestore.rules) 파일 내용을 Firestore Rules에 적용

## 4. 관리자 계정 만들기
- 먼저 사이트에서 계정을 하나 회원가입
- Firestore `users/{uid}` 문서에서 `role` 값을 `admin`으로 변경

## 5. CHECK 문제 편집
- [check_data.json](C:\Users\CHOI\Documents\CODE LAB\check_data.json) 수정
- 모든 답안을 다 적고 `모든 답안 제출`을 누르면 정답과 해설이 한 번에 표시됨
