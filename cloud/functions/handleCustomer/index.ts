import cloud, { TWXContext } from 'wx-server-plugin/utils/WXServer';

// const db: TDatabase = cloud.database();

export const main = async (event: any) => {
  const wxContext: TWXContext = cloud.getWXContext();
  // console.log(event, context);
  const sendObj: any = {
    touser: wxContext.OPENID,
  };
  let text = {
    content: '欢迎使用“附近的美食”客服，输入序号使用以下功能：'
  };
  let type = 'text';
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
        text.content = `点击跳转<a href="https://taro.aotu.io/" data-miniprogram-appid="wx99c122865feb72fa" data-miniprogram-path="pages/index/index">附近的美食</a>`;
        sendObj.text = text;
        break;
      case '0':
      case 'help':
      case '帮助':
        sendObj.text = text;
        break;
      default:
        text.content = `echo: ${event.Content}`;
        // text.content = `${JSON.stringify(event)}`;
        sendObj.text = text;
    }
  } else if (event.MsgType ==='event') {
    sendObj.text = text;
  }
  sendObj.msgtype = type;

  await cloud.openapi.customerServiceMessage.send(sendObj);

  return 'success';
}
