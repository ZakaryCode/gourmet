import Taro, { Component } from "@tarojs/taro"
import { View, ScrollView, Image, Text } from '@tarojs/components';
import { StandardProps } from '@tarojs/components/types/common.d';
// import Tag from '../tag/index';

export default class List extends Component<ListProps> {
  state = {
    context: {},
  }

  static defaultProps = {
    list: [],
  }

  componentWillMount() {}

  componentDidMount() {}

  componentWillUnmount() {}

  componentDidShow() {}

  componentDidHide() {}

  setDateTimeString(e: number) {
    const T = new Date(e);
    // const Now = new Date();
    return T.toLocaleString();
  }

  render() {
    const { list = [] } = this.props;

    return (
      <ScrollView scrollY enableBackToTop scrollWithAnimation lowerThreshold={100}>
        {list.map((e) => <View id={e._id} style={styles.comment}>
          <View style={{
            marginBottom: '.0625em', display: '-webkit-box',
            alignItems: 'flex-end',
          }}>
            <Image mode='aspectFill' style={styles.icon} src={e.icon} lazyLoad />
            <View style={styles.displayBox}>
              <View style={{flex: 1, alignItems: 'baseline', display: 'flex'}}>
                <Text style={styles.name}>{e.name}</Text>
              </View>
              <View style={{flex: 1, alignItems: 'baseline', display: 'flex'}}>
                <Text style={styles.time}>{this.setDateTimeString(e.time)}</Text>
              </View>
            </View>
          </View>
          <View style={{ /* marginLeft: '2.75em' */ }}>
            <Text style={{ fontSize: '1em' }}>{e.text || '店员服务态度好，环境好，很喜欢，过来这边都会进来买，而且比大商场还便宜多了。好开心'}</Text>
          </View>
          <View>
            {e.imgs.map((img, i) => i < 9 ? <Image mode='aspectFill' src={img}
                onClick={() => Taro.previewImage({ urls:e.imgs, current: img })}
                lazyLoad style={{
                  height: 'calc((100vw - 2.5em) / 3)',
                  width: 'calc((100vw - 2.5em) / 3)',
                  margin: i % 3 !== 2 ? '.25em .25em 0 0' : '.25em 0 0 0',
                  verticalAlign: 'top',
            }} /> : undefined)}
          </View>
        </View>)}
      </ScrollView>
    )
  }
}

export interface ListProps extends StandardProps {
  list: any[];
}

const styles: { [key: string]: StandardProps['style'] } = {
  icon: {
    borderRadius: '50%', height: '2em', width: '2em', marginRight: '.75em',
  },
  comment: {
    backgroundColor: '#FFF', margin: '.125em 0', padding: '.75em 1em',
  },
  displayBox: {
    width: 'calc(100% - 4.75em)', display: 'flex', flexDirection: 'column'
  },
  name: {
    fontWeight: 'bolder', fontSize: '.875em', flex: 1,
  },
  time: {
    color: '#333', fontSize: '.625em',
  },
}
