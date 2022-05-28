import React from "react";
import { Image, Platform, requireNativeComponent, Animated, StyleSheet } from "react-native";

class FloatingActionButton extends React.Component<any, any> {
    render() {
        var { text, image, style, ...props } = this.props;
        const NativeFAB = !text ? NVFloatingActionButton : NVExtendedFloatingActionButton;
        return (
            <NativeFAB
                text={text}
                image={Image.resolveAssetSource(image)}
                style={[ styles.floatingActionButton, style ]}
                {...props}
            />
        );
    }
}

const NVFloatingActionButton = global.nativeFabricUIManager ? require('./FloatingActionButtonNativeComponent').default : requireNativeComponent('NVFloatingActionButton');
const NVExtendedFloatingActionButton = global.nativeFabricUIManager ? require('./ExtendedFloatingActionButtonNativeComponent').default : requireNativeComponent('NVExtendedFloatingActionButton');

const styles = StyleSheet.create({
    floatingActionButton: {
        position: 'absolute'
    },
});

export default Platform.OS === 'android' ? Animated.createAnimatedComponent(FloatingActionButton) : () => null;
