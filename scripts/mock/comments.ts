import * as Mock from 'mockjs';
import Random from './Random';
// import write from './write';

// 需要添加更多评论
const COMMENTS = [
    '店员服务态度好，环境好，很喜欢，过来这边都会进来买，而且比大商场还便宜多了。好开心',
];

export default (ids: string[]) => async (): Promise<Mock.MockjsMock> => {
    const o: Mock.MockjsMock = Mock.mock({
        // shopid: await Random.shopid(),
        shopid: Random.pick(ids),
        name: Random.cname(),
        icon: Random.pic(), // 需要改成用户头像
        time: <number><unknown>(new Date()) - Random.integer(0, 1000 * 60 * 60 * 24 * 30),
        text: Random.pick(COMMENTS),
        score: Random.integer(1, 10),
        imgs: new Array(Random.integer(0, 9)).fill('').map(() => Random.pic())
    });

    return o;
}

// write(getRecord, 'database-comments.json', 100, 'w');