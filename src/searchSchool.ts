import Axios, {
    AxiosResponse,
    AxiosRequestConfig
} from 'axios';

class SchoolFinder {
    protected name: string;
    protected region: string;
    protected kind: string;
    protected schoolCode: any = {
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
    protected schoolKind: any = {
        "유치원": "1",
        "초등학교": "2",
        "중학교": "3",
        "고등학교": "4",
        "특수학교": "5"
    };
    /**
     * 
     * @param name School name
     * @param region School region
     * @param kind School kind
     */
    constructor(name: string, region: string, kind: string) {
        this.name = name;
        this.region = region;
        this.kind = kind;
    }
    /**
     * 
     * @param url request url
     * @param config request config
     */
    private async request(url: string, config: AxiosRequestConfig): Promise<AxiosResponse> {
        return await Axios.get(url, config);
    }
    /**
     * 
     * @returns School info
     */
    public async find(): Promise<SchoolInfo> {
        const url: string = `https://hcs.eduro.go.kr/v2/searchSchool?lctnScCode=${this.schoolCode[this.region]}${this.schoolKind[this.kind] ? '&schulCrseScCode=' + this.schoolKind[this.kind] : ''}&orgName=${encodeURI(this.name)}`;
        const headers: any = {
            'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X)\
                    AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1'
        };
        const response: AxiosResponse = await this.request(url, { headers });
        const document: any = response.data;
        const result: any = document.schulList[0];
        return result;
    }
    /**
     * 
     * @returns School code
     */
    public async getCode(): Promise<string> {
        const schoolCode: string = (await this.find()).orgCode;
        return schoolCode;
    }
}

interface SchoolInfo {
    orgCode: string;
    kraOrgNm: string;
    engOrgNm: string;
    insttClsfCode: string;
    lctnScCode: string;
    lctnScNm: string;
    sigCode: string;
    juOrgCode: string;
    schulKndScCode: string;
    orgAbrvNm01: string;
    orgAbrvNm02: string;
    endYmd: string;
    orgUon: string;
    updid: string;
    mdfcDtm: string;
    atptOfcdcConctUrl: string;
    addres: string;
}

export {
    SchoolFinder,
    SchoolInfo
}

new SchoolFinder('평택기', '경기', '고등학교').find().then(res => console.log(res)).catch(e => console.log(e))
