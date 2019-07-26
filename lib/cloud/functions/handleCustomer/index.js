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
// const db: TDatabase = cloud.database();
exports.main = function (event) { return __awaiter(_this, void 0, void 0, function () {
    var wxContext, sendObj, text, type;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                wxContext = WXServer_1.default.getWXContext();
                sendObj = {
                    touser: wxContext.OPENID,
                };
                text = {
                    content: '欢迎使用“附近的美食”客服，输入序号使用以下功能：'
                };
                type = 'text';
                text.content += '\n1. 测试功能——发送文本';
                // text.content += '\n2. 测试功能——发送图片';
                text.content += '\n2. 测试功能——发送链接';
                // text.content += '\n4. 测试功能——发送小程序卡片';
                text.content += '\n3. 测试功能——文字跳转小程序';
                text.content += '\n0. 帮助文本';
                if (event.MsgType === 'text') {
                    switch (String(event.Content)) {
                        case '1':
                            text.content = '这是一段文本';
                            sendObj.text = text;
                            break;
                        // case '2':
                        //   type = 'image';
                        //   sendObj.image = {
                        //     media_id: 'cloud://taro-gourmet-jfcsj.7461-taro-gourmet-jfcsj/logo-taro.png'
                        //   };
                        //   break;
                        case '2':
                            type = 'link';
                            sendObj.link = {
                                "title": "Hello Taro",
                                "description": "How does Taro work.",
                                "url": "https://taro.aotu.io",
                                "thumb_url": "https://taro-docs.jd.com/taro/img/logo-taro.png"
                            };
                            break;
                        // case '4':
                        //   type = 'miniprogrampage';
                        //   sendObj.miniprogrampage = {
                        //     "title":"title",
                        //     "pagepath":"pages/index/index",
                        //     "thumb_media_id":"cloud://taro-gourmet-jfcsj.7461-taro-gourmet-jfcsj/logo-taro.png"
                        //   };
                        //   break;
                        case '3':
                            text.content = "\u70B9\u51FB\u8DF3\u8F6C<a href=\"https://taro.aotu.io/\" data-miniprogram-appid=\"wx99c122865feb72fa\" data-miniprogram-path=\"pages/index/index\">\u9644\u8FD1\u7684\u7F8E\u98DF</a>";
                            sendObj.text = text;
                            break;
                        case '0':
                        case 'help':
                        case '帮助':
                            sendObj.text = text;
                            break;
                        default:
                            text.content = "echo: " + event.Content;
                            // text.content = `${JSON.stringify(event)}`;
                            sendObj.text = text;
                    }
                }
                else if (event.MsgType === 'event') {
                    sendObj.text = text;
                }
                sendObj.msgtype = type;
                return [4 /*yield*/, WXServer_1.default.openapi.customerServiceMessage.send(sendObj)];
            case 1:
                _a.sent();
                return [2 /*return*/, 'success'];
        }
    });
}); };
