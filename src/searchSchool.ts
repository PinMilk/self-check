import Axios from 'axios';

export class SchoolFinder {
    protected name: string;
    protected region: string;
    protected kind: string;
    protected schoolCode: any;
    protected schoolKind: any;

    constructor(name: string, region: string, kind: string) {
        this.name = name;
        this.region = region;
        this.kind = kind;
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

    public async find() {
        const result: any = (await Axios.get(`https://hcs.eduro.go.kr/school?orgName=${encodeURI(this.name)}&lctnScCode=${this.schoolCode[this.region]}&schulCrseScCode=${this.schoolKind[this.kind]}`, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X)\
                    AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1'
            }
        })).data.schulList[0];
        return result;
    }

    public async getCode() {
        const result: string = (await this.find()).orgCode;
        return result;
    }
}
