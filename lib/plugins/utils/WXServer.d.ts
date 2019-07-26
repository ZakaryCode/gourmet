/// <reference types="node" />
import * as fs from 'fs';
export declare type WXServerResponse = {
    errCode: number;
    errMsg: string;
};
export declare type TUploadFile = {
    fileID: string;
    statusCode: number;
};
export declare type TFileSource = {
    fileContent: Buffer;
    statusCode: number;
};
export declare type TTempFile = TFile & {
    tempFileURL: string;
};
export declare type TFile = {
    fileID: string;
    status: number;
    errMsg: string;
};
export declare class WXServer {
    private WXServerSDK;
    openapi: {
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
    constructor(options?: TOptions);
    init(options?: TOptions): void;
    getWXContext(): TWXContext;
    updateConfig(options?: TOptions): void;
    callFunction(name: string, data?: TData): Promise<{
        errMsg: string;
        requestID: string;
        result: any;
    }>;
    getVoIPSign(groupId: string, nonce: string, timestamp: number): Promise<{
        signature: string;
    }>;
    uploadFile(cloudPath: string, fileContent: Buffer | fs.ReadStream): Promise<TUploadFile | WXServerResponse>;
    downloadFile(fileID: string): Promise<TFileSource | WXServerResponse>;
    getTempFileURL(fileList: string[]): Promise<TTempFile[] | WXServerResponse>;
    deleteFile(fileList: string[]): Promise<TFile[] | WXServerResponse>;
    database(options?: TOptions2): TDatabase;
}
declare const _default: WXServer;
export default _default;
export declare type TOptions = {
    env?: string | TENV;
};
export declare type TOptions2 = {
    env?: string;
};
export declare type TENV = {
    database?: string;
    storage?: string;
    functions?: string;
};
export declare type TWXContext = {
    OPENID: string;
    APPID: string;
    UNIONID: string;
    ENV: string;
    SOURCE: TSOURCE;
};
export declare enum TSOURCE {
    'wx_devtools' = 0,
    'wx_client' = 1,
    'wx_http' = 2,
    'wx_unknown' = 3,
    string = 4
}
export declare type TSqlFunc = {
    /**
     * 获取集合数据，或获取根据查询条件筛选后的集合数据。
     * 如果没有指定 limit，则默认最多取 20 条记录。
     * 如果没有指定 skip，则默认从第 0 条记录开始取，skip 常用于分页。
     */
    get(): Promise<TResult>;
    update(options: TRecord): Promise<TResultUpdate>;
    remove(options: TRecord): Promise<TResultRemove>;
};
export declare type TDatabase = TSqlFunc & {
    createCollection(): Promise<{
        errMsg: string;
    }>;
    collection(name: string): TCollection;
    command: TCommand;
    aggregate: TAggregate;
    RegExp(initOptions: IInitOptions): DBRegExp;
    serverDate(options?: {
        offset?: number;
    }): ServerDate;
    Geo: TGeo;
};
export declare type TCollection = TSqlFunc & {
    doc(id: string | number): TDocument;
    add(options: TRecord): Promise<TResultAdd>;
    count(): Promise<TResultCount>;
    where(rule: TData | {
        description: DBRegExp;
    }): TQuery;
    orderBy(fieldName: string, order: 'asc' | 'desc'): TCollection | TQuery;
    limit(max: number): TCollection | TQuery;
    skip(offset: number): TCollection | TQuery;
    field(definition: {
        key: boolean;
    }): TCollection | TQuery | TDocument;
};
export declare type TQuery = TSqlFunc & {
    count(): Promise<TResultCount>;
    orderBy(fieldName: string, order: string): TCollection | TQuery;
    limit(max: number): TCollection | TQuery;
    skip(offset: number): TCollection | TQuery;
    field(definition: {
        key: boolean;
    }): TCollection | TQuery | TDocument;
};
export declare type TDocument = TSqlFunc & {
    set(options: TRecord): Promise<TResultSet>;
    count(): Promise<TResultCount>;
    field(definition: {
        key: boolean;
    }): TCollection | TQuery | TDocument;
};
export declare type TData = {
    [key: string]: any;
};
export declare type TRecord = {
    data: TData;
};
export declare type TResult = {
    data: TData[];
};
export declare type TResultAdd = {
    _id: String | Number;
};
export declare type TResultUpdate = {
    stats: {
        updated: number;
    };
};
export declare type TResultSet = {
    _id: String | Number;
    stats: {
        updated: number;
        created: number;
    };
};
export declare type TResultRemove = {
    stats: {
        removed: number;
    };
};
export declare type TResultCount = {
    total: number;
};
export interface IInitOptions {
    regexp: string;
    options: string;
}
export declare type DBRegExp = any;
export declare type ServerDate = any;
export declare type TGeo = {
    Point: (longitude: number, latitude: number) => TPoint;
    LineString: (points: TPoint[]) => TLineString;
    Polygon: (lineStrings: TLineString[]) => TPolygon;
    MultiPoint: (points: TPoint[]) => TMultiPoint;
    MultiLineString: (lineStrings: TLineString[]) => TMultiLineString;
    MultiPolygon: (polygons: TPolygon[]) => TMultiPolygon;
};
export declare type TCoordinates = [number, number];
export declare type TPoint = {
    "type": "Point";
    "coordinates": TCoordinates;
};
export declare type TLineString = {
    "type": "LineString";
    "coordinates": TCoordinates[];
};
export declare type TPolygon = {
    "type": "Polygon";
    "coordinates": TCoordinates[][];
};
export declare type TMultiPoint = {
    "type": "MultiPoint";
    "coordinates": TCoordinates[];
};
export declare type TMultiLineString = {
    "type": "MultiLineString";
    "coordinates": TCoordinates[][];
};
export declare type TMultiPolygon = {
    "type": "MultiPolygon";
    "coordinates": TCoordinates[][][];
};
export declare type TCommand = {
    eq(value: number | boolean | string | any): TCommand;
    neq(value: number | boolean | string | any): TCommand;
    lt(value: number): TCommand;
    lte(value: number): TCommand;
    gt(value: number): TCommand;
    gte(value: number): TCommand;
    in(values: any[]): TCommand;
    nin(values: any[]): TCommand;
    and(value1: number, value2: number): TCommand;
    or(value1: number, value2: number): TCommand;
    set(value: any): TCommand;
    remove(): TCommand;
    inc(value: number): TCommand;
    mul(value: number): TCommand;
    push(values: any[]): TCommand;
    pop(values: any[]): TCommand;
    shift(values: any[]): TCommand;
    unshift(values: any[]): TCommand;
    geoNear(IOptions: {
        geometry: TPoint;
        maxDistance?: number;
        minDistance?: number;
    }): TCommand;
    geoWithin(IOptions: {
        geometry: TPolygon | TMultiPolygon;
    }): TCommand;
    geoIntersects(IOptions: {
        geometry: TPoint | TLineString | TMultiPoint | TMultiLineString | TPolygon | TMultiPolygon;
    }): TCommand;
};
export declare type TAggregate = any;
/*!****************************************************!*\
!*** ./src/api/cloud/provider/tcb/api/database.ts ***!
\****************************************************/
export declare type TCloudProviderDatabase = {
    addDocument: (options: any, config: any) => any;
    queryDocument: (options: any, config: any) => any;
    updateDocument: (options: any, config: any) => any;
    removeDocument: (options: any, config: any) => any;
    countDocument: (options: any, config: any) => any;
};
