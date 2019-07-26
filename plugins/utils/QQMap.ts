import QQMapWX = require('../asset/qqmap-wx-jssdk1.2/qqmap-wx-jssdk');

export type QQMapWXResponse = {
    status: number;
    message: string;
}

// function Func(_res: any): void { /* console.log(res) */ }
export type TFunc = (res: any) => void;
/* 地点类型 */
export type TPoint = {
    latitude: number;
    longitude: number;
}
export type TPoint2 = {
    lat: number;
    lng: number;
}
/**
 * 控制POI列表类型
 * http://lbs.qq.com/webservice_v1/guide-gcoder.html
 **/
export type TPOIOptions = {
    address_format?: 'short'; // 返回短地址，缺省时返回长地址
    radius?: BigInt; // 半径，取值范围 1-5000（米）
    page_size?: BigInt; // 每页条数，取值范围 1-20
    page_index?: BigInt; // 页码，取值范围 1-20 注：分页时page_size与page_index参数需要同时使用
    policy?: 1 | 2 | 3 | 4 | 5; // 控制返回场景
    category?: string; // 指定分类，多关键词英文逗号分隔；（支持类别参见：附录 https://lbs.qq.com/webservice_v1/guide-appendix.html）
};
/* 回调处理类型 */
export type TPolyfillParam = {
    success?: TFunc;
    fail?: TFunc;
    complete?: TFunc;
}

export type TAddressComponent = {
    nation: string, province: string, city: string, district?: string
};

export type TAddressReference = {
    id: string, title?: string, location?: TPoint2, _distance?: number, _dir_desc?: string
};

export type TCalculateDistance = QQMapWXResponse & { result: {
    elements: {
        from: TPoint2,
        to: TPoint2,
        distance: number,
        duration: number,
    }[]
} };

export type TReverseGeocoder = QQMapWXResponse & { result: {
    address: string,
    location: TPoint2,
    formatted_addresses?: {
        recommend?: string, // 经过腾讯地图优化过的描述方式，更具人性化特点
        rough?: string, // 大致位置，可用于对位置的粗略描述
    },
    address_component: TAddressComponent & {
        street?: string, street_number?: string,
    },
    ad_info: TAddressComponent & {
        location: TPoint2, adcode: string, name: string, nation_code: string, city_code: string,
    },
    address_reference?: {
        famous_area: TAddressReference, town: TAddressReference,
        landmark_l1: TAddressReference, landmark_l2: TAddressReference,
        street: TAddressReference, street_number: TAddressReference,
        business_area: TAddressReference, crossroad: TAddressReference, water: TAddressReference,
    },
    poi_count?: number,
    pois?: (TAddressReference & { address?: string, category?: string })[],
} };

export class QQMap {
    private APPKEY: string = '6CDBZ-S54KQ-XZY5F-G2S4C-IUY55-YSFLS';

    private QQMapSDK: any;

    protected ERROR_CONF = {
        KEY_ERR: 311,
        KEY_ERR_MSG: 'key格式错误',
        PARAM_ERR: 310,
        PARAM_ERR_MSG: '请求参数信息有误',
        SYSTEM_ERR: 600,
        SYSTEM_ERR_MSG: '系统错误',
        WX_ERR_CODE: 1000,
        WX_OK_CODE: 200
    };

    constructor() {
        this.init();
    }

    protected init() {
        this.QQMapSDK = new QQMapWX({
            key: this.APPKEY
        });
    }

    public async getDistance(latFrom: number, lngFrom: number, latTo: number, lngTo: number): Promise<TCalculateDistance> {
    // public getDistance(options: { from: TPoint; to: TPoint; }) {
        return this.calculateDistance({
            from: {
                latitude: latFrom,
                longitude: lngFrom
            },
            to : [{
                latitude: latTo,
                longitude: lngTo
            }],
            mode: 'straight',
        });
    }

    public getLocation(lat: number, lng: number) {
        return this.reverseGeocoder({
            location: {
                latitude: lat,
                longitude: lng
            }
        });
    }

    /**
     * 用于单起点到多终点的路线距离(非直线距离)计算：
     * 支持两种距离计算方式：步行和驾车。
     * 起点到终点最大限制直线距离10公里。
     *
     * 新增直线距离计算。
     * 
     * @param {Object} options 接口参数对象
     * 
     * 请求参数结构可以参考
     * http://lbs.qq.com/webservice_v1/guide-distance.html
     */
    public async calculateDistance(options: {
        mode?: 'walking' | 'straight' | string; // default: walking
        from?: TPoint;
        to: TPoint[] | { location: TPoint2 }[] | string;
        sig?: string;
    }): Promise<TCalculateDistance> {
        // console.log(this.QQMapSDK, options);
        return new Promise((resolve: Function, reject: Function) => {
            const op: typeof options & TPolyfillParam = options;
            op.success = (res: TCalculateDistance) => resolve(res);
            op.fail = (err: QQMapWXResponse) => reject(err);
            op.complete = () => {}
            this.QQMapSDK.calculateDistance(options);
        });
    }

    // public direction(options) {}
    // public geocoder(options) {}
    // public getCityList(options) {}
    // public getDistrictByCityId(options) {}
    // public getSuggestion(options) {}

    /**
     * 逆地址解析 小程序端 ONLY
     *
     * @param {Object} options 接口参数对象
     * 
     * 请求参数结构可以参考
     * http://lbs.qq.com/webservice_v1/guide-gcoder.html
     */
    public async reverseGeocoder(options: {
        location?: TPoint; // 不输入坐标会自动调起微信定位
        get_poi?: 1 | 0; // 是否返回周边POI列表：1.返回；0不返回(默认)
        poi_options?: TPOIOptions; // 用于控制POI列表
        coord_type?: BigInt; // 坐标类型 default: 5
        sig?: string;
    }): Promise<TReverseGeocoder> {
        // console.log(options);
        return new Promise((resolve: Function, reject: Function) => {
            const op: typeof options & TPolyfillParam = options;
            op.success = (res: TReverseGeocoder) => resolve(res);
            op.fail = (err: QQMapWXResponse) => reject(err);
            op.complete = () => {}
            this.QQMapSDK.reverseGeocoder(options);
        });
    }
    
    /**
     * POI周边检索
     *
     * @param {Object} options 接口参数对象
     * 
     * 参数对象结构可以参考
     * @see http://lbs.qq.com/webservice_v1/guide-search.html
     */
    public async search(options: {
        keyword: string; // POI搜索关键字，用于全文检索字段
        location?: TPoint; // 不输入坐标会自动调起微信定位
        orderby?: '_distance' | string; // 排序，目前仅周边搜索（boundary=nearby） 支持按距离由近到远排序，默认取值：_distance
        filter?: string; // 筛选条件：最多支持五个分类 语法: https://lbs.qq.com/webservice_v1/guide-search.html#filter_detail
        distance?: number; // default: 1000
        auto_extend?: 0 | 1; // 取值1：默认值，若当前城市搜索无结果，则自动扩大范围；取值0：仅在当前城市搜索。
        region?: string; // 判断城市限定参数
        rectangle?: string; // 矩形限定坐标(暂时只支持字符串格式)
        address_format?: string;
        sig?: string;
    }): Promise<QQMapWXResponse & { result: any }> {
        return new Promise((resolve: Function, reject: Function) => {
            const op: typeof options & TPolyfillParam = options;
            op.success = (res: QQMapWXResponse & { result: any }) => resolve(res);
            op.fail = (err: QQMapWXResponse) => reject(err);
            op.complete = () => {}
            this.QQMapSDK.search(options);
        });
    };
}

export default new QQMap();