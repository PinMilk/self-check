import * as Forge from 'node-forge';
import { SchoolFinder } from './searchSchool';
import Axios from 'axios';

export class SelfChecker {
    protected url: any;
    protected name: string;
    protected birthday: string;
    protected school: string;
    protected region: string;
    protected kind: string;

    /**
     * 
     * @param name - 이름(주민등록상의 이름)
     * @param birthday - 생년월일(주민등록상)
     * @param school - 학교명(재학중인 학교)
     * @param region - 학교가 있는 지역(광역시, 도 단위)
     * @param kind - 학교 급(초등학교, 중학교, 고등학교, 특수학교)
     * 
     * @returns {void}
     */
    constructor(name: string, birthday: string, school: string, region: string, kind: string) {
        this.url = {
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
                "/loginwithschool",
                "/registerServey"
            ]
        };
        this.name = name;
        this.birthday = birthday;
        this.school = school;
        this.region = region;
        this.kind = kind;
    }

    private encrypt(str: string) {
        const pem: string = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA81dCnCKt0NVH7j5Oh2+S
GgEU0aqi5u6sYXemouJWXOlZO3jqDsHYM1qfEjVvCOmeoMNFXYSXdNhflU7mjWP8
jWUmkYIQ8o3FGqMzsMTNxr+bAp0cULWu9eYmycjJwWIxxB7vUwvpEUNicgW7v5nC
wmF5HS33Hmn7yDzcfjfBs99K5xJEppHG0qc+q3YXxxPpwZNIRFn0Wtxt0Muh1U8a
vvWyw03uQ/wMBnzhwUC8T4G5NclLEWzOQExbQ4oDlZBv8BM/WxxuOyu0I8bDUDdu
tJOfREYRZBlazFHvRKNNQQD2qDfjRz484uFs7b5nykjaMB9k/EJAuHjJzGs9MMMW
tQIDAQAB
-----END PUBLIC KEY-----`;
        /*  I got this PEM key with this code
            Buffer.from(
                Forge.util.hexToBytes(
                    '30820122300d06092a864886f70d01010105000382010f003082010a0282010100f357429c22add0d547ee3e4e876f921a0114d1aaa2e6eeac6177a6a2e2565ce9593b78ea0ec1d8335a9f12356f08e99ea0c3455d849774d85f954ee68d63fc8d6526918210f28dc51aa333b0c4cdc6bf9b029d1c50b5aef5e626c9c8c9c16231c41eef530be91143627205bbbf99c2c261791d2df71e69fbc83cdc7e37c1b3df4ae71244a691c6d2a73eab7617c713e9c193484459f45adc6dd0cba1d54f1abef5b2c34dee43fc0c067ce1c140bc4f81b935c94b116cce404c5b438a0395906ff0133f5b1c6e3b2bb423c6c350376eb4939f44461164195acc51ef44a34d4100f6a837e3473e3ce2e16cedbe67ca48da301f64fc4240b878c9cc6b3d30c316b50203010001'
                ), 'binary'
            ).toString('base64')
        */
        const publicKey: Forge.pki.rsa.PublicKey = Forge.pki.publicKeyFromPem(pem);
        const result: string = Buffer.from(publicKey.encrypt(str, "RSAES-PKCS1-V1_5"), 'ascii').toString('base64');
        return result;
    }

    private async getSchoolCode(name: string, region: string, kind: string) {
        const result: string = (await new SchoolFinder().getCode(name, region, kind));
        return result;
    }

    private async login() {
        const token: string = (await Axios.post(`${this.url[this.region]}${this.url.path[0]}`, {
            "orgcode": await this.getSchoolCode(this.school, this.region, this.kind),
            "name": this.encrypt(Buffer.from(this.name).toString('binary')),
            "birthday": this.encrypt(this.birthday)
        }, {
            headers: {
                "Accept": "application/json, text/plain, */*",
                "Accept-Encoding": "gzip, deflate, br",
                "Accept-Language": "en-GB,en;q=0.9,ko-KR;q=0.8,ko;q=0.7,ja-JP;q=0.6,ja;q=0.5,zh-TW;q=0.4,zh;q=0.3,en-US;q=0.2",
                "Cache-Control": "no-cache",
                "Connection": "keep-alive",
                "Content-type": "application/json; Charset=UTF-8",
                "Host": this.url[this.region].replace('https://', ''),
                "Origin": "https://hcs.eduro.go.kr",
                "Pragma": "no-cache",
                "Referer": "https://hcs.eduro.go.kr/",
                "Sec-Fetch-Dest": "empty",
                "Sec-Fetch-Mode": "cors",
                "Sec-Fetch-Site": "same-site",
                "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X)\
                        AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1"
            }
        })).data.token;
        return token;
    }

    /**
     * @returns {string} - time
     */
    public async check() {
        const result = (await Axios.post(`${this.url[this.region]}${this.url.path[1]}`, {
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
            "deviceuuid": ""
        }, { headers: { "Authorization": await this.login() }})).data.inveYmd;
        return result;
    }
}