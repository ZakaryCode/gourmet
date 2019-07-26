import cloud, { TWXContext, TDatabase, TCommand, TResult, TData } from 'wx-server-plugin/utils/WXServer';
import map, { TPoint, TCalculateDistance } from 'wx-server-plugin/utils/QQMap';

const db: TDatabase = cloud.database();
const _: TCommand = db.command;

export const main = async (event: {
  location: TPoint;
  page: number;
  pageSize: number;
  type: number;
}, context: any) => {
  const wxContext: TWXContext = cloud.getWXContext();
  const { location, page = 0, pageSize = 10, type = 0 } = event;

  const rules: TData = {
    point: _.geoNear({
      geometry: db.Geo.Point(location.longitude, location.latitude),
      maxDistance: 500000,
    }),
  };
  if (type > 0) {
    rules.type = type;
  }
  const odb: TResult = await db.collection('portal')
    .where(rules)
    .limit(pageSize)
    .skip(page * pageSize)
    .get();
  const list = odb.data.map(async (e: any) => {
    const p: TPoint = e.point;
    const d: TCalculateDistance = await map.getDistance(location.latitude, location.longitude, p.latitude, p.longitude);
    e.distance = d.result.elements[0].distance;
    return e;
  });

  return {
    openid: wxContext.OPENID,
    appid: wxContext.APPID,
    unionid: wxContext.UNIONID,
    event: event,
    context: context,
    list: await Promise.all(list),
  }
}