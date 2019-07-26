export declare type QQMapWXResponse = {
    status: number;
    message: string;
};
export declare type TFunc = (res: any) => void;
export declare type TPoint = {
    latitude: number;
    longitude: number;
};
export declare type TPoint2 = {
    lat: number;
    lng: number;
};
/**
 * 控制POI列表类型
 * http://lbs.qq.com/webservice_v1/guide-gcoder.html
 **/
export declare type TPOIOptions = {
    address_format?: 'short';
    radius?: BigInt;
    page_size?: BigInt;
    page_index?: BigInt;
    policy?: 1 | 2 | 3 | 4 | 5;
    category?: string;
};
export declare type TPolyfillParam = {
    success?: TFunc;
    fail?: TFunc;
    complete?: TFunc;
};
export declare type TAddressComponent = {
    nation: string;
    province: string;
    city: string;
    district?: string;
};
export declare type TAddressReference = {
    id: string;
    title?: string;
    location?: TPoint2;
    _distance?: number;
    _dir_desc?: string;
};
export declare type TCalculateDistance = QQMapWXResponse & {
    result: {
        elements: {
            from: TPoint2;
            to: TPoint2;
            distance: number;
            duration: number;
        }[];
    };
};
export declare type TReverseGeocoder = QQMapWXResponse & {
    result: {
        address: string;
        location: TPoint2;
        formatted_addresses?: {
            recommend?: string;
            rough?: string;
        };
        address_component: TAddressComponent & {
            street?: string;
            street_number?: string;
        };
        ad_info: TAddressComponent & {
            location: TPoint2;
            adcode: string;
            name: string;
            nation_code: string;
            city_code: string;
        };
        address_reference?: {
            famous_area: TAddressReference;
            town: TAddressReference;
            landmark_l1: TAddressReference;
            landmark_l2: TAddressReference;
            street: TAddressReference;
            street_number: TAddressReference;
            business_area: TAddressReference;
            crossroad: TAddressReference;
            water: TAddressReference;
        };
        poi_count?: number;
        pois?: (TAddressReference & {
            address?: string;
            category?: string;
        })[];
    };
};
export declare class QQMap {
    private APPKEY;
    private QQMapSDK;
    protected ERROR_CONF: {
        KEY_ERR: number;
        KEY_ERR_MSG: string;
        PARAM_ERR: number;
        PARAM_ERR_MSG: string;
        SYSTEM_ERR: number;
        SYSTEM_ERR_MSG: string;
        WX_ERR_CODE: number;
        WX_OK_CODE: number;
    };
    constructor();
    protected init(): void;
    getDistance(latFrom: number, lngFrom: number, latTo: number, lngTo: number): Promise<TCalculateDistance>;
    getLocation(lat: number, lng: number): Promise<TReverseGeocoder>;
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
    calculateDistance(options: {
        mode?: 'walking' | 'straight' | string;
        from?: TPoint;
        to: TPoint[] | {
            location: TPoint2;
        }[] | string;
        sig?: string;
    }): Promise<TCalculateDistance>;
    /**
     * 逆地址解析 小程序端 ONLY
     *
     * @param {Object} options 接口参数对象
     *
     * 请求参数结构可以参考
     * http://lbs.qq.com/webservice_v1/guide-gcoder.html
     */
    reverseGeocoder(options: {
        location?: TPoint;
        get_poi?: 1 | 0;
        poi_options?: TPOIOptions;
        coord_type?: BigInt;
        sig?: string;
    }): Promise<TReverseGeocoder>;
    /**
     * POI周边检索
     *
     * @param {Object} options 接口参数对象
     *
     * 参数对象结构可以参考
     * @see http://lbs.qq.com/webservice_v1/guide-search.html
     */
    search(options: {
        keyword: string;
        location?: TPoint;
        orderby?: '_distance' | string;
        filter?: string;
        distance?: number;
        auto_extend?: 0 | 1;
        region?: string;
        rectangle?: string;
        address_format?: string;
        sig?: string;
    }): Promise<QQMapWXResponse & {
        result: any;
    }>;
}
declare const _default: QQMap;
export default _default;
