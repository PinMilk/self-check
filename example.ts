import { SelfChecker } from "./"; // 디렉토리 설정은 알아서.
// import * as FS from "fs";

// const example: any = JSON.parse(FS.readFileSync("./example.json").toString('utf-8'));

// new SelfChecker(example.name, example.birthday, example.school, example.region, example.kind)
//     .check()
//     .then(res => console.log(res))
//     .catch(e => console.error(e));

new SelfChecker('조한별' /* 이름 */, '040114' /* 생년월일(6자리) */, '평택기' /* 학교 이름 키워드 */, '경기' /* 지역 */, '고등학교' /* 학교급 */)
    .check()
    .then(res => console.log(res))
    .catch(e => console.error(e));