import * as Mock from 'mockjs';
import Random from './Random';
// import write from './write';

export default async function getRecord(): Promise<Mock.MockjsMock> {
    const o: Mock.MockjsMock = Mock.mock({
        name: Random.shopName(),
        picture: Random.pic(),
        point: Random.point(),
        nation: '中国', // Random.region(),
        province: '广东省', // Random.province(),
        city: '深圳市', //  Random.city()
        type: Random.integer(0, 7),
        typeName: Random.tag(),
        contact: Random.telephone(),
        time_interval: Random.pick(['10:00-23:30', '09:00-23:00', '08:00-22:30', '24小时营业'])
    });

    return o;
}

// write(getRecord, 'database.json', 100, 'w');