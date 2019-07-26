import * as Mock from 'mockjs';
import o = require('./data.json');
import axios from 'axios';
import getConfig from './getConfig';

var access_token: string | undefined;
var env: string | undefined;

type TMockRandom = Mock.MockjsRandom & { extend: Function; [key: string]: Function };

const Random: TMockRandom = <TMockRandom>Mock.Random;

var ShopIDs: string[] = [];

Random.extend({
    shopName: function() {
        const shopNames = o.map(e => e["店名"]);
        return this.pick(shopNames);
    },
    point: function() {
        const point = {
            "coordinates":[Random.float(11346, 11437, 5, 7) / 100, Random.float(2227, 2252, 5, 7) / 100],
            // "coordinates":[Random.float(-179, 179, 5, 7), Random.float(-89, 89, 5, 7)],
            "type":"Point",
        };
        return point;
    },
    tag: function() {
        const tag = o.map(e => e["商铺标签"]);
        return this.pick(tag);
    },
    telephone: function() {
        let phonenumber = '13';
        for (let index = 0; index < 9; index++) {
            phonenumber += Random.character('number');
        }
        return phonenumber;
    },
    pic: function() {
        const pic = o.map(e => e["商铺图片"]);
        return this.pick(pic);
    },
    shopid: async function() {
        if (!access_token) {
            const config = await getConfig();
            access_token = config.access_token;
            env = config.env;
        }
        const count = (await axios.post(`https://api.weixin.qq.com/tcb/databasecount?access_token=${access_token}`, {
            env, query: 'db.collection("portal").where({}).get()',
        })).data.count;
        const ids: string[] = ShopIDs;
        if (count === ids.length) {
            return this.pick(ids);
        }
        for (let index = 0; index < count;) {
            const o = (await axios.post(`https://api.weixin.qq.com/tcb/databasequery?access_token=${access_token}`, {
                env, query: `db.collection("portal").where({}).skip(${index}).get()`,
            })).data;
            const pager = o.pager;
            try {
                index = pager.Offset + pager.Limit;
                const data: string[] = o.data;
                for (let i = 0; i < data.length; i++) {
                    const d = JSON.parse(data[i]);
                    if (!ids.includes(d['_id']))
                        ids.push(d['_id']);
                }
            } catch (error) {
                console.log(error, pager);
            }
        }
        return this.pick(ids);
    }
});

export default Random;