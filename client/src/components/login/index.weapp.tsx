import Taro, { Component } from "@tarojs/taro"
import { View, Text, Button } from "@tarojs/components"
import map from 'wx-server-plugin/utils/QQMap';

export default class Test extends Component {
  state = {
    context: {}
  }

  componentWillMount() {}

  componentDidMount() {}

  componentWillUnmount() {}

  componentDidShow() {}

  componentDidHide() {}

  getList = () => {
    Taro.getLocation()
      .then(res => {
        const { latitude, longitude} = res;
        map.getLocation(latitude, longitude)
          .then(({ result }) => {
            console.log(result.location, result.address_component);
        Taro.cloud
            .callFunction({
              name: "getList",
              data: {
                location: result.location, address: result.address_component
              }
            })
            .then((res: Taro.cloud.AnyObject) => {
              const { result } = res;
              console.log(result, JSON.stringify(result.event));
            });
          }).catch((err) => {
            console.log(err);
            Taro.showToast({
              title: '网络请求错误',
              duration: 3000,
              icon: 'none',
            });
          });
        // const from: TPoint = { latitude, longitude };
        // const to: TPoint = { latitude: latitude + 1, longitude: longitude + 1 };
      })
      .catch(e => {
        console.log(e);
      });
  }

  getLoc = () => {
    Taro.getLocation()
      .then(res => {
        const { latitude, longitude} = res;
        map.getLocation(latitude, longitude)
          .then(({ result }) => {
            console.log(result.address_component);
          }).catch(err => {
            console.log(err);
          })
        // const from: TPoint = { latitude, longitude };
        // const to: TPoint = { latitude: latitude + 1, longitude: longitude + 1 };
      })
  }

  getDistance = () => {
    Taro.getLocation()
      .then(res => {
        const { latitude, longitude} = res;
        map.getDistance(latitude, longitude, latitude + 1, longitude + 1)
          .then(({ result }) => {
            console.log(result.elements[0].distance);
          }).catch(err => {
            console.log(err);
          })
        // const from: TPoint = { latitude, longitude };
        // const to: TPoint = { latitude: latitude + 1, longitude: longitude + 1 };
      })
  }

  getDistanceFromCloud = () => {
    Taro.getLocation()
      .then(res => {
        const { latitude, longitude} = res;
        map.getDistance(latitude, longitude, latitude + 1, longitude + 1)
          .then(({ result }) => {
            console.log(result.elements[0].distance);
          }).catch(err => {
            console.log(err);
          });
        Taro.cloud
          .callFunction({
            name: "getDistance",
            data: {
              latFrom: latitude, lngFrom: longitude, latTo: latitude + 1, lngTo: longitude + 1
            }
          })
          .then((res: Taro.cloud.AnyObject) => {
            const { result } = res;
            console.log(result.distance);
          }).catch((err) => {
            console.log(err);
            Taro.showToast({
              title: '网络请求错误',
              duration: 3000,
              icon: 'none',
            });
          });
      });
  }

  open = () => {
    Taro.getLocation()
      .then(res => Taro.openLocation(res))
  }

  choose = () => {
    Taro.chooseLocation((res: {
      name:	string, //	位置名称
      address:	string, //	详细地址
      latitude:	string, //	纬度，浮点数，范围为-90~90，负数表示南纬。使用 gcj02 国测局坐标系
      longitude:	string //	经度，浮点数，范围为-180~180，负数表示西经。使用 gcj02 国测局坐标系
    }) => {
      console.log(res)
    })
  }

  render() {
    return (
      <View className='index'>
        <Text>context：{JSON.stringify(this.state.context)}</Text>
        <Button onClick={this.getList}>获取列表</Button>
        <Button onClick={this.getLoc}>获取位置信息</Button>
        <Button onClick={this.getDistance}>获取距离</Button>
        <Button onClick={this.getDistanceFromCloud}>云获取距离</Button>
        <Button onClick={this.open}>打开地图</Button>
        <Button onClick={this.choose}>选择坐标</Button>
      </View>
    )
  }
}
