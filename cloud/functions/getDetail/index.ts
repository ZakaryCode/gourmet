import cloud, { TWXContext, TDatabase, TResult } from 'wx-server-plugin/utils/WXServer';

const db: TDatabase = cloud.database();

export const main = async (event: {
  id: string;
}, context: any) => {
  const wxContext: TWXContext = cloud.getWXContext();
  const { id } = event;

  const odb: TResult = await db.collection('portal')
    .doc(id)
    .get();
  const data = odb.data;

  return {
    openid: wxContext.OPENID,
    appid: wxContext.APPID,
    unionid: wxContext.UNIONID,
    event: event,
    context: context,
    data: data,
  }
}