"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SchoolFinder = void 0;
const axios_1 = __importDefault(require("axios"));
class SchoolFinder {
    constructor() {
        this.schoolCode = {
            "서울": "01",
            "부산": "02",
            "대구": "03",
            "인천": "04",
            "광주": "05",
            "대전": "06",
            "울산": "07",
            "세종": "08",
            "경기": "10",
            "강원": "11",
            "충북": "12",
            "충남": "13",
            "전북": "14",
            "전남": "15",
            "경북": "16",
            "경남": "17",
            "제주": "18"
        };
        this.schoolKind = {
            "유치원": "1",
            "초등학교": "2",
            "중학교": "3",
            "고등학교": "4",
            "특수학교": "5"
        };
    }
    find(name, location, kind) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = (yield axios_1.default.get(`https://hcs.eduro.go.kr/school?orgName=${encodeURI(name)}&lctnScCode=${this.schoolCode[location]}&schulCrseScCode=${this.schoolKind[kind]}`, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X)\
                    AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1'
                }
            })).data.schulList;
            return result;
        });
    }
    getCode(name, location, kind) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = (yield this.find(name, location, kind))[0].orgCode;
            return result;
        });
    }
}
exports.SchoolFinder = SchoolFinder;
