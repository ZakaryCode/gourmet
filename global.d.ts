declare module "*.png";
declare module "*.gif";
declare module "*.jpg";
declare module "*.jpeg";
declare module "*.svg";
declare module "*.css";
declare module "*.less";
declare module "*.scss";
declare module "*.sass";
declare module "*.styl";

// @ts-ignore
declare var process: NodeJS.Process & {
  env: {
    TARO_ENV: 'weapp' | 'swan' | 'alipay' | 'h5' | 'rn' | 'tt';
    [key: string]: any;
  }
}

declare type JSONPrimitive = string | number | boolean | null;
declare type JSONValue = JSONPrimitive | JSONObject | JSONArray;
declare type JSONObject = { [key: string]: JSONValue };
declare interface JSONArray extends Array<JSONValue> {}
