import cloud, { TWXContext } from 'wx-server-plugin/utils/WXServer';
import map from 'wx-server-plugin/utils/QQMap';

export const main = async (event: any, context: any) => {
  const wxContext: TWXContext = cloud.getWXContext();
  const { latFrom, lngFrom, latTo, lngTo } = event;
  const { result } = await map.getDistance(latFrom, lngFrom, latTo, lngTo);

  return {
    openid: wxContext.OPENID,
    appid: wxContext.APPID,
    unionid: wxContext.UNIONID,
    event: event,
    context: context,
    distance: result.elements[0].distance
  }
}