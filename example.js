"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require("./"); // 디렉토리 설정은 알아서.
const FS = __importStar(require("fs"));
const example = JSON.parse(FS.readFileSync("./example.json").toString('utf-8'));
new _1.SelfChecker(example.name, example.birthday, example.school, example.region, example.kind)
    .check()
    .then(res => console.log(res))
    .catch(e => console.error(e));
new _1.SelfChecker('조한별' /* 이름 */, '040114' /* 생년월일(6자리) */, '평택기' /* 학교 이름 키워드 */, '경기' /* 지역 */, '고등학교' /* 학교급 */)
    .check()
    .then(res => console.log(res))
    .catch(e => console.error(e));
