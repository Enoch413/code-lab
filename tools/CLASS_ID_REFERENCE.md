# 반 ID 기준

학생 계정의 `classIds`, PREP 마스터 세션, CHECK 마스터 세션은 같은 반 ID를 써야 합니다.

현재 기준:

- `1강서B` -> `class-1-gangseo-b`
- `2강서A` -> `class-2-gangseo-a`
- `1선부` -> `class-1-seonbu`
- `3선부` -> `class-3-seonbu`
- `1강서A` -> `class-1-gangseo-a`
- `2강서B` -> `class-2-gangseo-b`
- `1단원` -> `class-1-danwon`
- `2단원` -> `class-2-danwon`

## CSV 예시

```csv
loginId,name,studentId,classIds,initialPassword,role,adminScope,passwordResetRequired
msu7563,문시우,msu7563,class-1-gangseo-b,pass1234,student,assigned,true
yeg8475,유은결,yeg8475,class-2-gangseo-a,pass1234,student,assigned,true
nyj4995,남예준,nyj4995,class-1-seonbu,pass1234,student,assigned,true
hsy8406,황서연,hsy8406,class-3-seonbu,pass1234,student,assigned,true
khe2016,khe2016,khe2016,class-1-danwon|class-2-danwon|class-1-gangseo-a|class-2-gangseo-b,pass1234,admin,assigned,true
superadmin,최고 관리자,superadmin,class-1-gangseo-b|class-2-gangseo-a|class-1-seonbu|class-3-seonbu|class-1-gangseo-a|class-2-gangseo-b|class-1-danwon|class-2-danwon,fhaktj1619!,admin,all,true
```

## 메모

- 학생은 `adminScope=assigned` 로 두면 됩니다
- 일반 선생님은 `role=admin`, `adminScope=assigned`
- 최고관리자는 `role=admin`, `adminScope=all`
- 여러 반을 맡으면 `classIds` 를 `|` 로 구분해서 입력합니다
