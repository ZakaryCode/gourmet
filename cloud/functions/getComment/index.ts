import cloud, { TWXContext, TDatabase, TResult, TData, TResultCount } from 'wx-server-plugin/utils/WXServer';

const db: TDatabase = cloud.database();

export const main = async (event: {
  id: string;
  page: number;
  pageSize: number;
}, context: any) => {
  const wxContext: TWXContext = cloud.getWXContext();
  const { id, page = 0, pageSize = 10 } = event;
  const rules: TData = {
    shopid: id,
  };
  const odb: TResult = await db.collection('comment')
    .where(rules)
    .limit(pageSize)
    .skip(page * pageSize)
    .get();
  const count: TResultCount = await db.collection('comment')
    .where(rules)
    .count();

  return {
    openid: wxContext.OPENID,
    appid: wxContext.APPID,
    unionid: wxContext.UNIONID,
    event: event,
    context: context,
    list: odb.data,
    total: count.total,
  }
}