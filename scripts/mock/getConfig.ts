import axios from 'axios';

export default async function() {
    // https://developers.weixin.qq.com/miniprogram/dev/api-backend/open-api/access-token/auth.getAccessToken.html
    const grant_type = 'client_credential';
    const appid = 'wx99c122865feb72fa'; // AppID
    const secret = 'c3bdaa9d65d42f3b17f858fe0a814207'; // AppSecret
    const env = 'taro-gourmet-jfcsj'; // 云环境ID
    const access_token = (await axios.get('https://api.weixin.qq.com/cgi-bin/token', {
        params: { grant_type, appid, secret }
    })).data.access_token;
    return { grant_type, appid, secret, env, access_token };
}