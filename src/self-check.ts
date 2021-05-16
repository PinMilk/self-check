import * as Forge from 'node-forge';
import {
    SchoolFinder,
    SearchConfig
} from './searchSchool';
import Axios, {
    AxiosRequestConfig,
    AxiosResponse
} from 'axios';

class SelfChecker {
    private url: any = {
        '서울': 'https://senhcs.eduro.go.kr',
        '부산': 'https://penhcs.eduro.go.kr',
        '대구': 'https://dgehcs.eduro.go.kr',
        '인천': 'https://icehcs.eduro.go.kr',
        '광주': 'https://genhcs.eduro.go.kr',
        '대전': 'https://djehcs.eduro.go.kr',
        '울산': 'https://usehcs.eduro.go.kr',
        '세종': 'https://sjehcs.eduro.go.kr',
        '경기': 'https://goehcs.eduro.go.kr',
        '강원': 'https://kwehcs.eduro.go.kr',
        '충북': 'https://cbehcs.eduro.go.kr',
        '충남': 'https://cnehcs.eduro.go.kr',
        '전북': 'https://jbehcs.eduro.go.kr',
        '전남': 'https://jnehcs.eduro.go.kr',
        '경북': 'https://gbehcs.eduro.go.kr',
        '경남': 'https://gnehcs.eduro.go.kr',
        '제주': 'https://jjehcs.eduro.go.kr',
        'path': [
            '/v2/findUser',
            '/v2/validatePassword',
            '/v2/selectUserGroup',
            '/v2/getUserInfo',
            '/registerServey'
        ]
    };
    private name: string;
    private birthday: string;
    private school: string;
    private region: string;
    private kind: string;
    private password: string;
    private schoolCode: string;
    private userPNo: string = '';
    private hostURI: string;
    /**
     * 
     * @param name - 이름(주민등록상의 이름)
     * @param birthday - 생년월일(주민등록상)
     * @param school - 학교명(재학중인 학교)
     * @param region - 학교가 있는 지역(광역시, 도 단위)
     * @param kind - 학교 급(초등학교, 중학교, 고등학교, 특수학교)
     * @param password - 자가진단 비밀번호(4자리 숫자)
     * @param schoolCode - 학교 코드
     * @constructor
     */
    constructor(config: CheckConfig) {
        this.name = config.name;
        this.birthday = config.birthday;
        this.school = config.school;
        this.region = config.region;
        this.kind = config.kind || '';
        this.password = config.password;
        this.schoolCode = config.schoolCode || '';
        this.hostURI = this.url[config.region];
        return this;
    }
    /**
     * 
     * @param message An message to be encrypted
     * @private
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
        const result: string = Buffer.from(publicKey.encrypt(message, 'RSAES-PKCS1-V1_5'), 'ascii').toString('base64');
        return result;
    }
    /**
     * 
     * @returns this
     * @private
     */
    private async getSchoolCode(): Promise<SelfChecker> {
        const config: SearchConfig = {
            name: this.school,
            region: this.region,
            kind: this.kind
        };
        this.schoolCode = this.schoolCode || await new SchoolFinder(config).getCode();
        return this;
    }
    /**
     * 
     * @param url Request url
     * @param data Request data
     * @param config Request config
     */
    private async request(url: string, data: any, config: AxiosRequestConfig): Promise<AxiosResponse> {
        return await Axios.post(url, data, config);
    }
    /**
     * 
     * @returns token
     * @private
     */
    private async getFirstToken(): Promise<string> {
        const url: string = this.url[this.region] + this.url.path[0];
        await this.getSchoolCode();

        const config: AxiosRequestConfig = {
            headers: {
                'Content-type': 'application/json; Charset=UTF-8',
                'Origin': 'https://hcs.eduro.go.kr',
                'Referer': 'https://hcs.eduro.go.kr/',
                'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1'
            }
        };
        const data: any = {
            'orgCode': this.schoolCode,
            'name': this.encrypt(Buffer.from(this.name).toString('binary')),
            'birthday': this.encrypt(this.birthday),
            'stdntPNo': null,
            'loginType': 'school'
        };
        const response: AxiosResponse = await this.request(url, data, config);
        const document: any = response.data;
        this.school = document.orgName;
        const token: string = document.token;
        return token;
    }
    /**
     * 
     * @returns token
     * @private
     */
    private async getSecondToken(): Promise<string> {
        const requestToken: string = await this.getFirstToken();
        const url: string = this.url[this.region] + this.url.path[1];
        const config: AxiosRequestConfig = {
            headers: {
                'Authorization': requestToken,
                'Content-type': 'application/json; Charset=UTF-8',
                'Origin': 'https://hcs.eduro.go.kr',
                'Referer': 'https://hcs.eduro.go.kr/',
                'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1'
            }
        };
        const data: any = {
            'password': this.encrypt(this.password),
            'deviceUuid': ''
        };
        const response: AxiosResponse = await this.request(url, data, config);
        const document: any = response.data;
        return document;
    }
    /**
     * 
     * @returns token
     * @private
     */
    public async getThirdToken(): Promise<string> {
        const requestToken: string = await this.getSecondToken();
        const url: string = this.url[this.region] + this.url.path[2];
        const config: AxiosRequestConfig = {
            headers: {
                'Authorization': requestToken,
                'Content-type': 'application/json; Charset=UTF-8',
                'Origin': 'https://hcs.eduro.go.kr',
                'Referer': 'https://hcs.eduro.go.kr/',
                'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1'
            }
        };
        const response: AxiosResponse = await this.request(url, {}, config);
        const document: any = response.data;
        this.userPNo = document[0].userPNo
        const token: string = document[0].token;
        return token;
    }
    /**
     * 
     * @returns Check response
     */
    public async check(): Promise<CheckResponse> {
        const token: string = await this.getThirdToken();
        // Checking information
        const name: string = this.name;
        const birthday: string = this.birthday;
        const school: string = this.school;
        const region: string = this.region;
        const kind: string = this.kind;
        const schoolCode: string = this.schoolCode;

        const url: string = this.url[this.region] + this.url.path[4];
        const config: AxiosRequestConfig = {
            headers: {
                'Authorization': token,
                'Content-type': 'application/json; Charset=UTF-8',
                'Origin': 'https://hcs.eduro.go.kr',
                'Referer': 'https://hcs.eduro.go.kr/',
                'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1'
            }
        };
        const data: any = {
            'rspns01': '1',
            'rspns02': '1',
            'rspns03': null,
            'rspns04': null,
            'rspns05': null,
            'rspns06': null,
            'rspns07': null,
            'rspns08': null,
            'rspns09': '0',
            'rspns10': null,
            'rspns11': null,
            'rspns12': null,
            'rspns13': null,
            'rspns14': null,
            'rspns15': null,
            'rspns00': 'Y',
            'deviceuuid': '',
            'upperToken': token,
            'upperUserNameEncpt': name
        };
        const response: AxiosResponse = await this.request(url, data, config);
        const document: any = response.data;

        const checkTime: string = document.inveYmd;
        const result: CheckResponse = {
            name,
            birthday,
            school,
            region,
            kind,
            checkTime,
            schoolCode
        };
        return result;
    }
}

interface CheckInfo {
    name: string;
    birthday: string;
    school: string;
    region: string;
    kind?: string;
    schoolCode?: string;
}

interface CheckResponse extends CheckInfo {
    checkTime: string;
}

interface CheckConfig extends CheckInfo{
    password: string;
}

export {
    SelfChecker,
    SchoolFinder,
    CheckInfo,
    CheckResponse,
    CheckConfig
}
