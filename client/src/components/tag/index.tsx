
import {Text } from "@tarojs/components";
import { StandardProps } from "@tarojs/components/types/common";

export default function Tag(props: TagProps) {
    const { color } = props;

    return <Text style={{border: `1px solid ${color}`, color: color, borderRadius: '4px', padding: '2px', margin: '2px'}}>{props.children}</Text>;
}

Tag.defaultProps = { 
    color: '#000'
 };

export interface TagProps extends StandardProps {
    color?: string;
    children?: React.ReactNode;
}