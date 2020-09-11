import Axios from 'axios';

export class SchoolFinder {
    private schoolCode: any;
    private schoolKind: any;

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

    public async find(name: string, location: string, kind: string) {
        const result: any[] = (await Axios.get(`https://hcs.eduro.go.kr/school?orgName=${encodeURI(name)}&lctnScCode=${this.schoolCode[location]}&schulCrseScCode=${this.schoolKind[kind]}`, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X)\
                    AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1'
            }
        })).data.schulList;
        return result;
    }

    public async getCode(name: string, location: string, kind: string) {
        const result: string = (await this.find(name, location, kind))[0].orgCode;
    return result;
    }
}
