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
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var WXServer_1 = require("wx-server-plugin/utils/WXServer");
var QQMap_1 = require("wx-server-plugin/utils/QQMap");
var db = WXServer_1.default.database();
var _ = db.command;
exports.main = function (event, context) { return __awaiter(_this, void 0, void 0, function () {
    var wxContext, location, _a, page, _b, pageSize, _c, type, rules, odb, list, _d;
    var _this = this;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0:
                wxContext = WXServer_1.default.getWXContext();
                location = event.location, _a = event.page, page = _a === void 0 ? 0 : _a, _b = event.pageSize, pageSize = _b === void 0 ? 10 : _b, _c = event.type, type = _c === void 0 ? 0 : _c;
                rules = {
                    point: _.geoNear({
                        geometry: db.Geo.Point(location.longitude, location.latitude),
                        maxDistance: 500000,
                    }),
                };
                if (type > 0) {
                    rules.type = type;
                }
                return [4 /*yield*/, db.collection('portal')
                        .where(rules)
                        .limit(pageSize)
                        .skip(page * pageSize)
                        .get()];
            case 1:
                odb = _e.sent();
                list = odb.data.map(function (e) { return __awaiter(_this, void 0, void 0, function () {
                    var p, d;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                p = e.point;
                                return [4 /*yield*/, QQMap_1.default.getDistance(location.latitude, location.longitude, p.latitude, p.longitude)];
                            case 1:
                                d = _a.sent();
                                e.distance = d.result.elements[0].distance;
                                return [2 /*return*/, e];
                        }
                    });
                }); });
                _d = {
                    openid: wxContext.OPENID,
                    appid: wxContext.APPID,
                    unionid: wxContext.UNIONID,
                    event: event,
                    context: context
                };
                return [4 /*yield*/, Promise.all(list)];
            case 2: return [2 /*return*/, (_d.list = _e.sent(),
                    _d)];
        }
    });
}); };
