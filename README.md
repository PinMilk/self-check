# self-check - 교육부 자가진단 자동화 라이브러리
[![TypeScript](https://img.shields.io/badge/Built%20with-Typescript-informational?logo=typescript)](https://www.typescriptlang.org/)
[![Passed](https://img.shields.io/badge/Build-Passed-success)](#)
[![License](https://img.shields.io/github/license/pinmilk/self-check)](./LICENSE)
- Note: It can stop working anytime.<br />
      Before using this app, please check the condition of you and run this app.
- 전달: 이 프로그램은 언제든지 작동을 멈출 수 있습니다.<br />
      이 앱을 사용하기 전, 반드시 자신의 건강 상태를 확인하고 실행해 주세요.
## 만들게 된 이유!
<img alt="result" src="./img/귀찮아.jpg" />

- 귀찮아요...
- 몸에 이상이 없다는 가정 하에 아침에 일어나서 자가진단 하랴, 조회 하랴 너무 힘듭니다!
- 원래 기존 사이트에 대한 자가진단 자동화 스크립트는 있었으나 자가진단 사이트가 바뀌게 되었어요! 그래서 이렇게 새로 만들게 되었습니다.
## 사용법

### 1. 저장소 복제
아래 명령어로 self-check 레포를 클론합니다.
```bash
git clone https://github.com/PinMilk/self-check
```
### 2. 코드 짜기
아래와 같이 코딩합니다.
예시입니다.
```typescript
import SelfChecker, {
    CheckResponse
} from './'; // 디렉토리 설정은 알아서.

// 일반적인 처리
new SelfChecker('이름' /* 이름 */, '******' /* 생년월일(6자리) */, 'XX고' /* 학교 이름 키워드 */, '경기' /* 지역 */, '고등학교' /* 학교급 */, '1234' /* 비밀번호 */)
    .check()
    .then(res => console.log(res))
    .catch(e => console.error(e));
```
### 3. TypeScript 빌드
이 레포가 있는 디렉토리에서 아래 명령어로 타입스크립트를 빌드해줍니다!
```bash
tsc
```
### 4. Enjoy
귀찮은 자가진단을 자동으로 할 수 있습니다!
## Parameter
| 파라미터 | 설명 | 타입 | 필수 여부 |
| -------- | ---- | ---- | --------- |
| `name` | 학생의 이름 | string | Y |
| `birthday` | 학생의 생일(6자리) | string | Y |
| `school` | 학교 이름 또는 검색 키워드 | string | Y |
| `region` | 지역명(이하 상세) | string | Y |
| `kind` | 학교급(이하 상세) | string | N |
| `password` | 비밀번호 | string | Y |
| `schoolCode` | 학교 코드 | string | N |
### 1. 지역명
| 값 | 지역 |
| -- | ---- |
| `서울` | 서울특별시 |
| `부산` | 부산광역시 |
| `대구` | 대구광역시 |
| `인천` | 인천광역시 |
| `광주` | 광주광역시 |
| `대전` | 대전광역시 |
| `울산` | 울산광역시 |
| `세종` | 세종특별자치시 |
| `경기` | 경기도 |
| `강원` | 강원도 |
| `충북` | 충청북도 |
| `충남` | 충청남도 |
| `전북` | 전라북도 |
| `전남` | 전라남도 |
| `경북` | 경상북도 |
| `경남` | 경상남도 |
| `제주` | 제주특별자치도 |
### 2. 학교급
`유치원, 초등학교, 중학교, 고등학교, 특수학교` 중 선택
## License
self-check is following MIT License.