import React from "react";
import { Platform, requireNativeComponent, Animated } from "react-native";

class FloatingActionButton extends React.Component<any, any> {
    render() {
        return <NVFloatingActionButton />        
    }
}

const NVFloatingActionButton = requireNativeComponent<any>("NVFloatingActionButton", null);

export default Platform.OS === 'android' ? Animated.createAnimatedComponent(FloatingActionButton) : null;
