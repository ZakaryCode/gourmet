/**
 * 向云开发指定集合写入数据
 */
import axios from 'axios';
import * as Mock from 'mockjs';
import getConfig from './getConfig';

var access_token: string | undefined;
var env: string | undefined;
export default async function upload(getData: () => Promise<Mock.MockjsMock>, collection: string, count: number = 10) {
    if (!access_token) {
        const config = await getConfig();
        access_token = config.access_token;
        env = config.env;
    }
    let arr: Mock.MockjsMock[] = [];
    for (let index = 0; index < count; index++) {
        arr.push(await getData());
    }
    const o = (await axios.post(`https://api.weixin.qq.com/tcb/databaseadd?access_token=${access_token}`, {
        env, query: `db.collection("${collection}").add({data: ${JSON.stringify(arr)}})`,
    })).data;
    console.log(`插入数据到集合: ${collection} -- ${o.errmsg}`, o.id_list);
    // return o.errcode === 0;
    return o.id_list;
}