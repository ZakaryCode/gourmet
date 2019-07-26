import Taro, { Component, Config } from '@tarojs/taro';
import { View , Text, Image, Button } from '@tarojs/components';
import map, { TPoint } from 'wx-server-plugin/utils/QQMap';
import './index.scss';

import TopNavigation from '../../components/navigation/top';
import List from '../../components/list';
import Location from './RenderLoc';
import { StandardProps } from '@tarojs/components/types/common';


export default class Index extends Component {

  /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */
  config: Config = {
    navigationBarTitleText: '附近的美食',
    onReachBottomDistance: 300,
  }

  state = {
    labels: ['首页', '中餐', '西餐', '日料', '快餐', '饮品', '鲜果', '其他'],
    index: 0,
    location: null,
    locString: '',
    address: '',
    page: 0,
    pageSize: 10,
    list: [],
    isLoading: false,
    isEnd: false,
  }

  componentWillMount () {
    Taro.showNavigationBarLoading();
    if (this.state.location === null) {
      this.getLoc(() => {
        const location: TPoint = this.state.location as unknown as TPoint;
        this.getAddress(location);
        this.getList(location, this.state.index, this.state.page, this.state.pageSize, () => {
          Taro.hideNavigationBarLoading();
        });
      });
    }
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
      title: `附近的美食`,
      path: `${router}?${query}`
    }
  }

  componentDidMount () { }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  onReachBottom() {
    // console.log(e.scrollTop)
    this.handleLoad();
  }

  handleCurrent = (i: number): void => {
    this.setState({ index: i }, () => {
      this.handleFresh(() => {
        this.setState({
          page: 0,
          isEnd: false,
        }, () => this.handleLoad(true));
      });
    });
  }

  handleLoad = (scrollToTop?: boolean) => {
    const location: TPoint = this.state.location as unknown as TPoint;
    if (scrollToTop) {
      Taro.pageScrollTo({
        scrollTop: 0,
        duration: 300
      });
    }
    this.getList(location, this.state.index, this.state.page, this.state.pageSize);
  }

  handleFresh = (callback = () => {}) => {
    Taro.showLoading({ title: '加载中...', mask: true });
    if (this.state.isLoading) {
      const e = setInterval(() => {
        if (!this.state.isLoading) {
          clearInterval(e);
          callback();
          Taro.hideLoading();
        }
      }, 100);
    } else {
      callback();
      Taro.hideLoading();
    }
  }

  getLoc = (callback = () => {}) => {
    Taro.getLocation()
      .then((res: Taro.getLocation.Promised) => {
        const { latitude, longitude} = res;
        this.setState({
          location: { latitude, longitude }
        }, callback);
      }).catch(err => {
        console.log(err);
        // if (err.errMsg === 'getLocation:fail auth deny')
        Taro.showToast({
          title: '定位好像出问题了哦!',
          duration: 3000,
          icon: 'none',
        });
        this.setState({
          location: { latitude: 23, longitude: 113 }
        }, callback);
      });
  }

  getAddress = (location?: TPoint) => {
    if (!location) return;
    const { latitude, longitude } = location;
    map.getLocation(latitude, longitude)
      .then(({ result }) => {
        this.setState({
          locString: result.address_component.street || result.address_component.district || result.address_component.city,
          address: result.address,
        });
      }).catch(err => {
        console.log(err);
      });
  }

  getList = (location?: TPoint, type: number = 0, page: number = 0, pageSize: number = 10, callback = () => {}) => {
    if (!location || this.state.isLoading || this.state.isEnd) return;
    this.setState({
      isLoading: true,
    }, () => {
      Taro.cloud
        .callFunction({
          name: "getList",
          data: { location, type, page, pageSize }
        })
        .then((res: Taro.cloud.AnyObject) => {
          const { result } = res;
          const { list } = result;
          const { list: _list, page } = this.state;
          // console.log(list[0].distance, page, _list.length);
          this.setState({
            list: page === 0 ? list : _list.concat([], list),
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
            this.getList(location, type, page, pageSize, callback);
          }, 3000);
        });
    });
  }

  choose = () => {
    const location: TPoint = this.state.location as unknown as TPoint;
    Taro.chooseLocation({
      name: this.state.locString,
      address: this.state.address,
      latitude: location.latitude,
      longitude: location.longitude,
    })
    .then(res => {
      this.setState({
        locString: res.name,
        address: res.address,
        location: { latitude: res.latitude, longitude: res.longitude }
      }, () => {
        this.handleFresh(() => {
          this.setState({
            page: 0,
            isEnd: false,
          }, () => this.handleLoad(true));
        });
      });
    }).catch(err => {
      console.log(err);
    });
  }

  render () {
    const { locString, labels = [], index = 0, list, isEnd } = this.state;

    return (
      <View className='index' style={styles.main}>
        <TopNavigation 
          labels={labels}
          current={index}
          handleCurrent={this.handleCurrent}
          renderHeader={<Location onClick={this.choose}>{locString}
              <Image src={require('@fortawesome/fontawesome-free/svgs/solid/map-marker-alt.svg')}
                  style={{ width: '1em', height: '1em' }} />
            </Location>}
        />
        <Location style={{ color: 'rgba(0,0,0,0)', marginBottom: '.0625em' }}>{locString}</Location>
        <List list={list}/>
        <View style={{ textAlign: 'center', margin: '.625em 0' }}>
          <Text>{isEnd? '没有更多啦！' : '加载中...'}</Text>
        </View>
        <Button style={{
          backgroundColor: 'rgba(200,200,200)',
          opacity: .4,
          position: 'fixed',
          width: '3.5em',
          height: '3.5em',
          lineHeight: '3.3em',
          bottom: '1.5em',
          right: '1.5em',
          borderRadius: '50%',
          textAlign: 'center',
          padding: 0,
        }} open-type="contact">
          <Image src={require('../../assets/customerService.png')}
              style={{ verticalAlign: 'middle', width: '2.2em', height: '2.2em' }} />
        </Button>
      </View>
    )
  }
}


const styles: { [key: string]: StandardProps['style'] } = {
  main: {},
};