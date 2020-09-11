import { SelfChecker } from "./"; // 디렉토리 설정은 알아서.
import * as FS from "fs";

const example: any = JSON.parse(FS.readFileSync("./example.json", {
    encoding: "utf-8"
}));

new SelfChecker(example.name /* 이름 */, example.birth /* 생년월일(6자리) */, example.school /* 학교 이름 키워드 */, example.region /* 지역 */, example.kind /* 학교급 */)
    .check()
    .then(res => console.log(res))
    .catch(e => console.error(e));

new SelfChecker('조한별' /* 이름 */, '040114' /* 생년월일(6자리) */, '평택기' /* 학교 이름 키워드 */, '경기' /* 지역 */, '고등학교' /* 학교급 */)
    .check()
    .then(res => console.log(res))
    .catch(e => console.error(e));
