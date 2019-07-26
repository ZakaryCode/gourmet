import * as fs from 'fs';
import WXServerSDK = require('wx-server-sdk');

export type WXServerResponse = {
    errCode: number;
    errMsg: string;
}

export type TUploadFile = {
    fileID: string;
    statusCode: number;
}

export type TFileSource = {
    fileContent: Buffer;
    statusCode: number;
}

export type TTempFile = TFile & { tempFileURL: string };

export type TFile = {
    fileID: string;
    status: number; // Success: 0
    errMsg: string;
}

export class WXServer {
    private WXServerSDK: typeof WXServerSDK = WXServerSDK;
    public openapi: {
        customerServiceMessage: {
            setTyping: any;
            uploadTempMedia: any;
            getTempMedia: any;
            send: any;
        };
        templateMessage: {
            send: any;
        };
    };
    constructor(options?: TOptions) {
        this.init(options);
    }
    public init(options?: TOptions): void {
        this.WXServerSDK.init(options);
        this.openapi = WXServerSDK.openapi;
    }
    public getWXContext(): TWXContext {
        return this.WXServerSDK.getWXContext();
    }
    public updateConfig(options?: TOptions): void {
        this.WXServerSDK.updateConfig(options);
    }
    public callFunction(name: string, data?: TData): Promise<{
        errMsg: string;
        requestID: string;
        result: any;
    }> {
        return this.WXServerSDK.callFunction(name, data);
    }
    public getVoIPSign(groupId: string, nonce: string, timestamp: number): Promise<{signature: string}> {
        return this.WXServerSDK.getVoIPSign(groupId, nonce, timestamp);
    }
    public async uploadFile(cloudPath: string, fileContent: Buffer | fs.ReadStream): Promise<TUploadFile | WXServerResponse> {
        return this.WXServerSDK.uploadFile(cloudPath, fileContent);
    }
    public async downloadFile(fileID: string): Promise<TFileSource | WXServerResponse> {
        return this.WXServerSDK.downloadFile(fileID);}
    public async getTempFileURL(fileList: string[]): Promise<TTempFile[] | WXServerResponse> {
        return this.WXServerSDK.getTempFileURL(fileList);
    }
    public async deleteFile(fileList: string[]): Promise<TFile[] | WXServerResponse> {
        return this.WXServerSDK.deleteFile(fileList);
    }
    public database(options?: TOptions2): TDatabase {
        return this.WXServerSDK.database(options);
    }
}

export default new WXServer();

export type TOptions = {
    env?: string | TENV; // 1.选填 2.默认值:default 3.默认环境配置，传入字符串形式的环境 ID 可以指定所有服务的默认环境，传入对象可以分别指定各个服务的默认环境
}
export type TOptions2 = {
    env?: string; // 环境 ID
}
export type TENV = {
    database?: string; // 1.选填 2.默认值:default 3.数据库 API 默认环境配置
    storage?: string; // 1.选填 2.默认值:default 3.存储 API 默认环境配置
    functions?: string; // 1.选填 2.默认值:default 3.云函数 API 默认环境配置
}
export type TWXContext = {
    OPENID: string; // 1.小程序用户 openid 2.字段存在条件:小程序端调用云函数时
    APPID: string; // 1.小程序 AppID 2.字段存在条件:小程序端调用云函数时
    UNIONID: string; // 1.小程序用户 unionid 2.默认值: 3.字段存在条件:小程序端调用云函数，并且满足 unionid 获取条件时
    ENV: string; // 1.云函数所在环境的 ID 2.默认值:无 3.最低版本:0.6.0
    SOURCE: TSOURCE; // 1.调用来源（云函数本次运行是被什么触发） ID 2.默认值:无 3.最低版本:0.7.0
}
export enum TSOURCE {
    'wx_devtools', // 微信 IDE 调用
    'wx_client', // 微信小程序调用
    'wx_http', // 微信 HTTP API 调用
    'wx_unknown', // 微信未知来源调用
    string // 非微信端触发
}

export type TSqlFunc = {
    /**
     * 获取集合数据，或获取根据查询条件筛选后的集合数据。
     * 如果没有指定 limit，则默认最多取 20 条记录。
     * 如果没有指定 skip，则默认从第 0 条记录开始取，skip 常用于分页。
     */
    get(): Promise<TResult>
    // 更新一条、多条记录
    update(options: TRecord): Promise<TResultUpdate>
    // 删除一条、多条记录
    remove(options: TRecord): Promise<TResultRemove>
};

export type TDatabase = TSqlFunc & {
    // [key: string]: any;
    createCollection(): Promise<{ errMsg: string }>
    collection(name: string): TCollection;
    command: TCommand;
    aggregate: TAggregate;
    RegExp(initOptions: IInitOptions): DBRegExp;
    serverDate(options?: {
        offset?: number; // 引用的服务端时间偏移量，毫秒为单位，可以是正数或负数
    }): ServerDate;
    Geo: TGeo;
}

export type TCollection = TSqlFunc & {
    // 获取记录的引用
    doc(id: string | number): TDocument // 方法接受一个 id 参数，指定需引用的记录 ID
    // 在集合上新增记录
    add(options: TRecord): Promise<TResultAdd>
    // 统计集合记录数或统计查询语句对应的结果记录数，云函数端因属于管理端，因此可以统计所有集合的记录数（小程序端统计会受限于权限，一个用户仅能统计其有读权限的记录数。）
    count(): Promise<TResultCount>
    // 指定筛选条件
    where(rule: TData | { description: DBRegExp }): TQuery
    // 指定查询排序条件: fieldName 用于定义需要排序的字段; order 定义排序顺序
    orderBy(fieldName: string, order: 'asc' | 'desc' ): TCollection | TQuery
    // 指定查询结果集数量上限 方法接受一个必填参数 max 用于定义最大结果集返回数量，上限 100
    limit(max: number): TCollection | TQuery
    // 指定查询返回结果时从指定序列后的结果开始返回，常用语分页
    skip(offset: number): TCollection | TQuery
    // definition 指定返回结果中记录需返回的字段
    field(definition: { key: boolean }): TCollection | TQuery | TDocument
}

export type TQuery = TSqlFunc & {
    // 统计集合记录数或统计查询语句对应的结果记录数，云函数端因属于管理端，因此可以统计所有集合的记录数（小程序端统计会受限于权限，一个用户仅能统计其有读权限的记录数。）
    count(): Promise<TResultCount>
    // 指定查询排序条件: fieldName 用于定义需要排序的字段; order 定义排序顺序
    orderBy(fieldName: string, order: string): TCollection | TQuery
    // 指定查询结果集数量上限 方法接受一个必填参数 max 用于定义最大结果集返回数量，上限 100
    limit(max: number): TCollection | TQuery
    // 指定查询返回结果时从指定序列后的结果开始返回，常用语分页
    skip(offset: number): TCollection | TQuery
    // definition 指定返回结果中记录需返回的字段
    field(definition: { key: boolean }): TCollection | TQuery | TDocument
};

export type TDocument = TSqlFunc & {
    // 替换更新一条记录
    set(options: TRecord): Promise<TResultSet>
    // 统计集合记录数或统计查询语句对应的结果记录数，云函数端因属于管理端，因此可以统计所有集合的记录数（小程序端统计会受限于权限，一个用户仅能统计其有读权限的记录数。）
    count(): Promise<TResultCount>
    // definition 指定返回结果中记录需返回的字段
    field(definition: { key: boolean }): TCollection | TQuery | TDocument
}

export type TData = { [key: string]: any };

export type TRecord = {
    data: TData; // 需要“增、删、改、查”记录的对象
}

export type TResult = {
    data: TData[]; // 记录的数据，是一个 Object
}

export type TResultAdd = {
    _id: String | Number; // 新增的记录的 ID
}

export type TResultUpdate = {
    stats: { // 更新结果的统计
      updated: number; // 成功更新的记录数量
    }
}

export type TResultSet = {
    _id:	String | Number; //	记录的 ID
    stats: {  // 更新结果的统计，其中包含的字段见下方 stats 的定义
      updated: number;  // 成功更新的记录数量，若指定的 _id 已存在则为 1，否则为 0
      created: number;  // 成功更新的记录数量，若指定的 _id 已存在则为 0，否则为 1
    }
}

export type TResultRemove = {
    stats: { // 更新结果的统计
      removed: number // 成功删除的记录数量
    }
}

export type TResultCount = {
    total: number; // 结果数量
}

export interface IInitOptions {
    regexp: string // 正则表达式，字符串形式
    options: string // flags，包括 i, m, s 但前端不做强限制
}

export type DBRegExp = any;

export type ServerDate = any;

export type TGeo = {
    Point: (longitude: number, latitude: number) => TPoint; // 点
    LineString: (points: TPoint[]) => TLineString; // 线段
    Polygon: (lineStrings: TLineString[]) => TPolygon; // 多边形
    MultiPoint: (points: TPoint[]) => TMultiPoint; // 点集合
    MultiLineString: (lineStrings: TLineString[]) => TMultiLineString; // 线段集合
    MultiPolygon: (polygons: TPolygon[]) => TMultiPolygon; // 多边形集合
}

export type TCoordinates = [number, number]; // 数字数组：[经度, 纬度]

export type TPoint = {
    "type": "Point";
    "coordinates": TCoordinates;
};

export type TLineString = {
    "type": "LineString";
    "coordinates": TCoordinates[];
};

export type TPolygon = {
    "type": "Polygon";
    "coordinates": TCoordinates[][]; // 0:外环 1:可选内环 1 ... n: 可选内环 n
};

export type TMultiPoint = {
    "type": "MultiPoint";
    "coordinates": TCoordinates[]; // ... 可选更多点
};

export type TMultiLineString = {
    "type": "MultiLineString",
    "coordinates": TCoordinates[][];
};

export type TMultiPolygon = {
  "type": "MultiPolygon",
  "coordinates": TCoordinates[][][];
};

export type TCommand = {
    // 查询指令：
    eq(value: number | boolean | string | any): TCommand; // 字段是否等于指定值
    neq(value: number | boolean | string | any): TCommand; // 字段是否不等于指定值
    lt(value: number): TCommand; // 字段是否小于指定值
    lte(value: number): TCommand; // 字段是否小于或等于指定值
    gt(value: number): TCommand; // 字段是否大于指定值
    gte(value: number): TCommand; // 字段是否大于或等于指定值
    in(values: any[]): TCommand; // 字段值是否在指定数组中
    nin(values: any[]): TCommand; // 字段值是否不在指定数组中
    and(value1: number, value2: number): TCommand; // 条件与，表示需同时满足另一个条件
    or(value1: number, value2: number): TCommand; // 条件或，表示如果满足另一个条件也匹配

    // 更新指令：
    set(value: any): TCommand; // 设置字段为指定值
    remove(): TCommand; // 删除字段
    inc(value: number): TCommand; // 原子自增字段值
    mul(value: number): TCommand; // 原子自乘字段值
    push(values: any[]): TCommand; // 如字段值为数组，往数组尾部增加指定值
    pop(values: any[]): TCommand; // 如字段值为数组，从数组尾部删除一个元素
    shift(values: any[]): TCommand; // 如字段值为数组，从数组头部删除一个元素
    unshift(values: any[]): TCommand; // 如字段值为数组，往数组头部增加指定值

    // geo 需对查询字段建立地理位置索引
    geoNear(IOptions: {
        geometry: TPoint // 点的地理位置
        maxDistance?: number // 选填，最大距离，单位为米
        minDistance?: number // 选填，最小距离，单位为米
    }): TCommand; // 按从近到远的顺序，找出字段值在给定点的附近的记录。
    geoWithin(IOptions: {
        geometry: TPolygon | TMultiPolygon; // 地理位置
    }): TCommand; // 找出字段值在指定区域内的记录，无排序。指定的区域必须是多边形（Polygon）或多边形集合（MultiPolygon）。
    geoIntersects(IOptions: {
        geometry: TPoint | TLineString | TMultiPoint | TMultiLineString | TPolygon | TMultiPolygon; // 地理位置
    }): TCommand; // 找出给定的地理位置图形相交的记录
};

export type TAggregate = any;

/*!****************************************************!*\
!*** ./src/api/cloud/provider/tcb/api/database.ts ***!
\****************************************************/
export type TCloudProviderDatabase = {
    addDocument: (options: any, config: any) => any;
    queryDocument: (options: any, config: any) => any;
    updateDocument: (options: any, config: any) => any;
    removeDocument: (options: any, config: any) => any;
    countDocument: (options: any, config: any) => any;
}