
import { StandardProps } from '@tarojs/components/types/common';
import { View } from '@tarojs/components';

export default function RenderLoc(props: RenderLocProps): JSX.Element {
  return <View style={Object.assign({ textAlign: 'right', height: '1.375em' }, props.style)}>
      <View
        onClick={props.onClick}
        style={{ display: 'inline-block', marginRight: '.5em' }}>
          {props.children}
      </View>
    </View>
}

export interface RenderLocProps extends StandardProps {
    children?: React.ReactNode;
}