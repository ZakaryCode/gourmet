"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var QQMapWX = require("../asset/qqmap-wx-jssdk1.2/qqmap-wx-jssdk");
var QQMap = /** @class */ (function () {
    function QQMap() {
        this.APPKEY = '6CDBZ-S54KQ-XZY5F-G2S4C-IUY55-YSFLS';
        this.ERROR_CONF = {
            KEY_ERR: 311,
            KEY_ERR_MSG: 'key格式错误',
            PARAM_ERR: 310,
            PARAM_ERR_MSG: '请求参数信息有误',
            SYSTEM_ERR: 600,
            SYSTEM_ERR_MSG: '系统错误',
            WX_ERR_CODE: 1000,
            WX_OK_CODE: 200
        };
        this.init();
    }
    QQMap.prototype.init = function () {
        this.QQMapSDK = new QQMapWX({
            key: this.APPKEY
        });
    };
    QQMap.prototype.getDistance = function (latFrom, lngFrom, latTo, lngTo) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                // public getDistance(options: { from: TPoint; to: TPoint; }) {
                return [2 /*return*/, this.calculateDistance({
                        from: {
                            latitude: latFrom,
                            longitude: lngFrom
                        },
                        to: [{
                                latitude: latTo,
                                longitude: lngTo
                            }],
                        mode: 'straight',
                    })];
            });
        });
    };
    QQMap.prototype.getLocation = function (lat, lng) {
        return this.reverseGeocoder({
            location: {
                latitude: lat,
                longitude: lng
            }
        });
    };
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
    QQMap.prototype.calculateDistance = function (options) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                // console.log(this.QQMapSDK, options);
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        var op = options;
                        op.success = function (res) { return resolve(res); };
                        op.fail = function (err) { return reject(err); };
                        op.complete = function () { };
                        _this.QQMapSDK.calculateDistance(options);
                    })];
            });
        });
    };
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
    QQMap.prototype.reverseGeocoder = function (options) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                // console.log(options);
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        var op = options;
                        op.success = function (res) { return resolve(res); };
                        op.fail = function (err) { return reject(err); };
                        op.complete = function () { };
                        _this.QQMapSDK.reverseGeocoder(options);
                    })];
            });
        });
    };
    /**
     * POI周边检索
     *
     * @param {Object} options 接口参数对象
     *
     * 参数对象结构可以参考
     * @see http://lbs.qq.com/webservice_v1/guide-search.html
     */
    QQMap.prototype.search = function (options) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        var op = options;
                        op.success = function (res) { return resolve(res); };
                        op.fail = function (err) { return reject(err); };
                        op.complete = function () { };
                        _this.QQMapSDK.search(options);
                    })];
            });
        });
    };
    ;
    return QQMap;
}());
exports.QQMap = QQMap;
exports.default = new QQMap();
