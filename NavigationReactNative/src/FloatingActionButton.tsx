import React from "react";
import { Image, Platform, requireNativeComponent, Animated, StyleSheet } from "react-native";

class FloatingActionButton extends React.Component<any, any> {
    render() {
        var { image, style, ...props } = this.props;
        return (
            <NVFloatingActionButton
                image={Image.resolveAssetSource(image)}
                style={[ styles.floatingActionButton, style ]}
                {...props}
            />
        );
    }
}

const NVFloatingActionButton = requireNativeComponent<any>("NVFloatingActionButton", null);

const styles = StyleSheet.create({
    floatingActionButton: {
        position: 'absolute',
        height: 56,
        width: 56
    },
});

export default Platform.OS === 'android' ? Animated.createAnimatedComponent(FloatingActionButton) : null;