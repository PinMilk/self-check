import * as Forge from "node-forge";
import { SchoolFinder } from "./searchSchool";
import Axios, { AxiosRequestConfig, AxiosResponse } from "axios";

export class SelfChecker {
    protected url: any = {
        "서울": "https://senhcs.eduro.go.kr",
        "부산": "https://penhcs.eduro.go.kr",
        "대구": "https://dgehcs.eduro.go.kr",
        "인천": "https://icehcs.eduro.go.kr",
        "광주": "https://genhcs.eduro.go.kr",
        "대전": "https://djehcs.eduro.go.kr",
        "울산": "https://usehcs.eduro.go.kr",
        "세종": "https://sjehcs.eduro.go.kr",
        "경기": "https://goehcs.eduro.go.kr",
        "강원": "https://kwehcs.eduro.go.kr",
        "충북": "https://cbehcs.eduro.go.kr",
        "충남": "https://cnehcs.eduro.go.kr",
        "전북": "https://jbehcs.eduro.go.kr",
        "전남": "https://jnehcs.eduro.go.kr",
        "경북": "https://gbehcs.eduro.go.kr",
        "경남": "https://gnehcs.eduro.go.kr",
        "제주": "https://jjehcs.eduro.go.kr",
        "path": [
            "/v2/findUser",
            "/registerServey"
        ]
    };
    protected name: string;
    protected birthday: string;
    protected school: string;
    protected region: string;
    protected kind: string;
    protected schoolCode: string;
    /**
     * 
     * @param name - 이름(주민등록상의 이름)
     * @param birthday - 생년월일(주민등록상)
     * @param school - 학교명(재학중인 학교)
     * @param region - 학교가 있는 지역(광역시, 도 단위)
     * @param kind - 학교 급(초등학교, 중학교, 고등학교, 특수학교)
     * @param schoolCode - 학교 코드
     * 
     * @returns void
     */
    constructor(name: string, birthday: string, school: string, region: string, kind: string = '', schoolCode: string = '') {
        this.name = name;
        this.birthday = birthday;
        this.school = school;
        this.region = region;
        this.kind = kind;
        this.schoolCode = schoolCode;
    }
    /**
     * 
     * @param message an message to be encrypted
     */
    private encrypt(message: string): string {
        const pem: string = '-----BEGIN PUBLIC KEY-----' + '\n' +
            'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA81dCnCKt0NVH7j5Oh2+S' + '\n' +
            'GgEU0aqi5u6sYXemouJWXOlZO3jqDsHYM1qfEjVvCOmeoMNFXYSXdNhflU7mjWP8' + '\n' +
            'jWUmkYIQ8o3FGqMzsMTNxr+bAp0cULWu9eYmycjJwWIxxB7vUwvpEUNicgW7v5nC' + '\n' +
            'wmF5HS33Hmn7yDzcfjfBs99K5xJEppHG0qc+q3YXxxPpwZNIRFn0Wtxt0Muh1U8a' + '\n' +
            'vvWyw03uQ/wMBnzhwUC8T4G5NclLEWzOQExbQ4oDlZBv8BM/WxxuOyu0I8bDUDdu' + '\n' +
            'tJOfREYRZBlazFHvRKNNQQD2qDfjRz484uFs7b5nykjaMB9k/EJAuHjJzGs9MMMW' + '\n' +
            'tQIDAQAB' + '\n' +
            '-----END PUBLIC KEY-----';
        const publicKey: Forge.pki.rsa.PublicKey = Forge.pki.publicKeyFromPem(pem);
        const result: string = Buffer.from(publicKey.encrypt(message, "RSAES-PKCS1-V1_5"), "ascii").toString("base64");
        return result;
    }
    /**
     * 
     * @returns school code
     */
    private async getSchoolCode(): Promise<string> {
        return (this.schoolCode ? this.schoolCode : await new SchoolFinder(this.school, this.region, this.kind).getCode());
    }
    /**
     * 
     * @param url url string
     * @param data request data
     * @param config request config
     */
    private async request(url: string, data: any, config: AxiosRequestConfig): Promise<AxiosResponse<any>> {
        return await Axios.post(url, data, config);
    }
    /**
     * 
     * @returns token
     */
    private async getToken(): Promise<string> {
        const url: string = this.url[this.region] + this.url.path[0];
        const data: any = {
            "orgCode": await this.getSchoolCode(),
            "name": this.encrypt(Buffer.from(this.name).toString("binary")),
            "birthday": this.encrypt(this.birthday),
            "stdntPNo": null,
            "loginType":"school"
        };
        const headers: any = {
            "Accept": "application/json, text/plain, */*",
            "Accept-Encoding": "gzip, deflate, br",
            "Accept-Language": "en-GB,en;q=0.9,ko-KR;q=0.8,ko;q=0.7,ja-JP;q=0.6,ja;q=0.5,zh-TW;q=0.4,zh;q=0.3,en-US;q=0.2",
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "Content-type": "application/json; Charset=UTF-8",
            "Origin": "https://hcs.eduro.go.kr",
            "Pragma": "no-cache",
            "Referer": "https://hcs.eduro.go.kr/",
            "Sec-Fetch-Dest": "empty",
            "Sec-Fetch-Mode": "cors",
            "Sec-Fetch-Site": "same-site",
            "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X)\
                    AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1"
        };
        const response: AxiosResponse = await this.request(url, data, { headers });
        const document: any = response.data;
        const token: string = document.token;
        return token;
    }
    /**
     * @returns time
     */
    public async check(): Promise<string> {
        const token: string = await this.getToken();
        const url: string = this.url[this.region] + this.url.path[1];
        const data: any = {
            "rspns01": "1",
            "rspns02": "1",
            "rspns03": null,
            "rspns04": null,
            "rspns05": null,
            "rspns06": null,
            "rspns07": "0",
            "rspns08": "0",
            "rspns09": "0",
            "rspns10": null,
            "rspns11": null,
            "rspns12": null,
            "rspns13": null,
            "rspns14": null,
            "rspns15": null,
            "rspns00": "Y",
            "deviceuuid": "",
            "upperToken": token,
            "upperUserNameEncpt": this.name
        };
        const headers: any = {
            "Accept": "application/json, text/plain, */*",
            "Accept-Encoding": "gzip, deflate, br",
            "Accept-Language": "en-GB,en;q=0.9,ko-KR;q=0.8,ko;q=0.7,ja-JP;q=0.6,ja;q=0.5,zh-TW;q=0.4,zh;q=0.3,en-US;q=0.2",
            "Authorization": token,
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "Content-type": "application/json; Charset=UTF-8",
            "Origin": "https://hcs.eduro.go.kr",
            "Pragma": "no-cache",
            "Referer": "https://hcs.eduro.go.kr/",
            "Sec-Fetch-Dest": "empty",
            "Sec-Fetch-Mode": "cors",
            "Sec-Fetch-Site": "same-site",
            "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X)\
                    AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1"
        };
        const response: AxiosResponse = await this.request(url, data, { headers });
        const document: any = response.data;
        const time: string = document.inveYmd;
        return time;
    }
}
