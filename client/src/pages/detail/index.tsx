import Taro, { Component, Config } from '@tarojs/taro'
import { View, ScrollView, Image, Text } from "@tarojs/components";
import { StandardProps } from '@tarojs/components/types/common';
import map from 'wx-server-plugin/utils/QQMap';
import Comment from '../../components/list/Comment';

export default class Index extends Component {

  /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */
  config: Config = {
    navigationBarTitleText: '附近的美食'
  }

  state = {
    picture: require('../../assets/food.jpg'),
    id: '',
    name: '',
    typeName: '',
    address: '',
    time_interval: '',
    contact: '',
    point: null,
    page: 0,
    pageSize: 5,
    comments: [],
    total: 0,
    isLoading: false,
    isEnd: false,
  }

  componentWillMount () {
    const params = this['$router'].params;
    // console.log(params.name);
    Taro.setNavigationBarTitle({ title: params.name || this.state.name })
      .then((res) => {
        console.log(res);
      });
  }

  componentDidMount () {
    this.getDetail();
    this.handleLoad();
  }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  onReachBottom() {
    this.handleLoad();
  }

  onShareAppMessage () {
    const routers = Taro.getCurrentPages();
    const router = routers[routers.length - 1].route;
    const params = this['$router'].params;
    const query = Object
      .entries(params)
      .map(e => e.join('='))
      .join('&');
    // console.log(query);
    return {
      title: `美食推荐: ${params.name || this.state.name}`,
      path: `${router}?${query}`
    }
  }

  handleLoad = () => {
    this.getComments(this.state.page, this.state.pageSize);
  }

  getDetail() {
    const params = this['$router'].params;
    Taro.cloud
      .callFunction({
        name: "getDetail",
        data: { id: params.id || this.state.id }
      })
      .then((res: Taro.cloud.AnyObject) => {
        const { result } = res;
        const { data } = result;
        // console.log(data);
        const [longitude, latitude] = data.point.coordinates;
        map.getLocation(latitude, longitude)
          .then(({ result }) => {
            this.setState({
              address: result.address,
            })
            // console.log(result, result.address_component.district, result.address_component.street);
          }).catch(err => {
            console.log(err);
          });
        this.setState({
          point: data.point.coordinates,
          picture: data.picture,
          id: data._id,
          name: data.name,
          typeName: data.typeName,
          time_interval: data.time_interval,
          contact: data.contact,
        });
      }).catch((err) => {
        console.log(err);
        Taro.showToast({
          title: '网络请求错误',
          duration: 3000,
          icon: 'none',
        });
        setTimeout(() => {
          Taro.navigateBack({ delta: 1 });
        }, 3000);
      });
  }

  getComments = (page: number = 0, pageSize: number = 10, callback = () => {}) => {
    const params = this['$router'].params;
    const id = params.id || this.state.id;
    if (!id || this.state.isLoading || this.state.isEnd) return;
    this.setState({
      isLoading: true,
    }, () => {
      Taro.cloud
        .callFunction({
          name: "getComment",
          data: { id, page, pageSize }
        })
        .then((res: Taro.cloud.AnyObject) => {
          const { result } = res;
          const { list, total } = result;
          const { comments, page } = this.state;
          this.setState({
            total,
            comments: page === 0 ? list : comments.concat([], list),
            page: page + 1
          }, () => {
            this.setState({
              isLoading: false,
              isEnd: list.length < pageSize
            }, callback);
            // console.log(list, list.length < pageSize);
          });
        }).catch((err) => {
          console.log(err);
          Taro.showToast({
            title: '网络请求错误',
            duration: 3000,
            icon: 'none',
          });
          setTimeout(() => {
            this.getComments(page, pageSize, callback);
          }, 3000);
        });
    });
  }

  render () {
    const params = this['$router'].params;
    const { picture, typeName, address, time_interval, contact, comments, total, isEnd } = this.state;
    return (
      <ScrollView className='index' style={styles.main}>
        <View style={{
            position: 'relative',
            width: '100vw', height: '75vw',
            backgroundImage: `url(${picture})`,
            backgroundRepeat: 'no-repeat',
            backgroundBlendMode: 'multiply',
            backgroundPosition: 'center',
            backgroundSize: 'cover',
        }}>
        </View>
        <View style={{
          padding: '.75em 1em',
          backgroundColor: '#FFF',
        }}>
          <Text style={{
            display: 'block',
            fontSize: '1.25em',
            fontWeight: 'bolder',
          }}>{params.name || this.state.name}</Text>
          <Text style={{
            fontSize: '1em',
          }}>{typeName}</Text>
        </View>
        <View style={styles.labels}>
          <View style={styles.label} onClick={() => {
            const point: number[] = this.state.point as unknown as number[];
            Taro.openLocation({
              latitude: point[1],
              longitude: point[0],
              address,
            });
          }}>
            <Text style={styles.labelTitle}>商户地址</Text>
            <Text style={styles.labelText}>{address}</Text>
            <Image src={require('@fortawesome/fontawesome-free/svgs/solid/map-marker-alt.svg')} style={styles.labelButton} />
          </View>
          <View style={styles.label}>
            <Text style={styles.labelTitle}>营业时间</Text>
            <Text style={styles.labelText}>{time_interval}</Text>
          </View>
          <View style={styles.label} onClick={() => {
            Taro.makePhoneCall({ phoneNumber: contact });
          }}>
            <Text style={styles.labelTitle}>联系方式</Text>
            <Text style={styles.labelText}>{contact}</Text>
            <Image src={require('@fortawesome/fontawesome-free/svgs/solid/phone.svg')} style={styles.labelButton} />
          </View>
        </View>
        <View style={{
          fontSize: '1em',
        }}>
          <Text style={{
            margin: '.25em 0 .125em',
            padding: '.75em 1em',
            backgroundColor: '#FFF',
            display: 'block',
            fontSize: '1.125em',
            fontWeight: 'bolder',
          }}>评论({total})</Text>
          <Comment list={comments}/>
        </View>
        {<View style={{ textAlign: 'center', margin: '.625em 0' }}>
          <Text>{!isEnd ? '加载中...' : total > 3 ? '没有更多啦！' : ''}</Text>
        </View>}
      </ScrollView>
    )
  }
}

const styles: { [key: string]: StandardProps['style'] } = {
  main: {},
  labels: {
    margin: '.25em 0',
    padding: '.75em 1em',
    backgroundColor: '#FFF',
    fontSize: '1em',
    display: 'table',
    width: '100%',
  },
  label: {
    padding: '.2em 0',
    display: 'flex',
    alignItems: 'baseline',
  },
  labelTitle: {
    color: '#999',
    paddingRight: '.375em',
    // flex: 1,
  },
  labelText: {
    flex: 1,
  },
  labelButton: {
    width: '1em',
    height: '1em',
    paddingRight: '1.5em',
    paddingLeft: '.5em',
  },
};
