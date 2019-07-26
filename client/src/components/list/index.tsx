import Taro, { Component } from "@tarojs/taro"
import { View, ScrollView, Image, Text } from "@tarojs/components";
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

  render() {
    const { list = [] } = this.props;

    return (
      <ScrollView
        scrollY
        enableBackToTop
        scrollWithAnimation
        lowerThreshold={100}>
        {list.map(e => {
          return <View id={e._id} style={{
                marginBottom: '.0625em', padding: '1em', display: '-webkit-box', backgroundColor: '#FFF'
              }}
              onClick={() => {Taro.navigateTo({
                url: `../detail/index?name=${e.name}&id=${e._id}`,
              })}}>
                <Image
                    mode='aspectFill'
                    style={styles.icon}
                    src={e.picture}
                    lazyLoad
                />
                <View style={styles.displayBox}>
                    <View style={{flex: 1, alignItems: 'baseline', display: 'flex'}}>
                        <Text style={styles.name}>{e.name}</Text>
                        <Text style={styles.distance}>{e.distance}m</Text>
                    </View>
                    <View style={{flex: 1, alignItems: 'baseline', display: 'flex'}}>
                        <Text style={styles.label}>{e.typeName}</Text>
                        <Text style={{padding: '.375em', color: '#DDD'}}>|</Text>
                        <Text style={styles.label}>{e.time_interval}</Text>
                    </View>
                </View>
            </View>
          })}
      </ScrollView>
    )
  }
}

export interface ListProps extends StandardProps {
  list: any[];
}

const styles: { [key: string]: StandardProps['style'] } = {
  icon: {
    borderRadius: '50%', height: '4em', width: '4em', marginRight: '.75em'
  },
  displayBox: {
    width: 'calc(100% - 4.75em)', display: 'flex', flexDirection: 'column'
  },
  name: {
    fontWeight: 'bolder', fontSize: '1.1875em', flex: 1,
  },
  distance: {
    color: '#999',
  },
  label: {
    color: '#333', fontSize: '.875em',
  },
  tagList: {
    fontSize: '.75em', alignItems: 'center', display: 'flex',
  }
}
