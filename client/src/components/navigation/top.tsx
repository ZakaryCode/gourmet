import Taro, { Component } from "@tarojs/taro"
import { View, ScrollView, Button } from "@tarojs/components";
import { StandardProps } from '@tarojs/components/types/common.d';

export default class TopNavigation extends Component<TopNavigationProps> {
  state = {
    context: {},
  }

  static defaultProps = {
    labels: ['首页', '中餐', '西餐', '日料', '快餐', '饮品', '鲜果', '其他'],
    handleCurrent: () => {}
  }

  componentWillMount() {}

  componentDidMount() {}

  componentWillUnmount() {}

  componentDidShow() {}

  componentDidHide() {}

  handleCurrentIndex = (i: number) => () => {
    const { handleCurrent } = this.props;
    handleCurrent(i);
  }

  render() {
    const { labels = [] } = this.props;

    return (
      <View style={styles.wapper}>
        <View style={{
            position: 'fixed',
            alignItems: 'flex-end',
            backgroundColor: '#FFF',
            width: '100%',
            zIndex: 1,
          }}>
            { this.props.renderHeader }
            <ScrollView scrollX style={{
              /* borderBottom: '1px #CCC solid', */
              zIndex: 1,
            }}>
            <View style={Object.assign(styles.bar, {width: `${labelWidth * labels.length}em`})}>
                {
                    labels.map((e: string, i: number): JSX.Element => {
                        const { current } = this.props;
                        return (
                            <Button
                                key={i.toString()}
                                onClick={this.handleCurrentIndex(i)}
                                style={Object.assign(i === current? {
                                    fontWeight: 'bolder',
                                    fontSize: '1.1875em',
                                    // borderBottom: '1px green solid',
                                    height: '1.475em'
                                } : {}, styles.button)}>
                                {e}
                            </Button>
                        );
                      })
                }
            </View>
          </ScrollView>
        </View>
      </View>
    )
  }
}

export interface TopNavigationProps extends StandardProps {
  labels: string[];
  current: number;
  handleCurrent: (i: number) => void;
  renderHeader?: JSX.Element;
}

const labelWidth = 5;
const barHeight = '1.6125em';
const styles: { [key: string]: StandardProps['style'] } = {
    wapper: {
      height: barHeight,
    },
    bar: {
        display: 'flex',
        width: '32em',
        height: barHeight,
        fontSize: '1em',
        verticalAlign: 'middle',
        alignItems: 'center',
    },
    button: {
        // display: 'inline',
        lineHeight: '1.5em',
        width: `${labelWidth}em`,
        // padding: 0,
        // border: 0,
        backgroundColor: 'rgba(255,255,255,0)',
        borderRadius: 0,
    }
}
