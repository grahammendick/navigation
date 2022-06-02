import React from "react";
import { Image, Platform, requireNativeComponent, Animated, StyleSheet } from "react-native";

class FloatingActionButton extends React.Component<any, any> {
    render() {
        var { text, image, anchor, style, ...props } = this.props;
        const NativeFAB = !text ? NVFloatingActionButton : NVExtendedFloatingActionButton;
        const {
            color: fabColor,
            backgroundColor: fabBackgroundColor,
            margin: fabMargin,
            marginTop: fabMarginTop,
            marginRight: fabMarginRight,
            marginBottom: fabMarginBottom,
            marginLeft: fabMarginLeft,
            marginStart: fabMarginStart,
            marginEnd: fabMarginEnd,
            fontFamily: fabFontFamily,
            fontWeight: fabFontWeight,
            fontStyle: fabFontStyle,
            fontSize: fabFontSize,
            elevation: fabElevation,
        } = style;
        return (
            <NativeFAB
                text={text}
                image={Image.resolveAssetSource(image)}
                anchor={!!anchor ? '' + anchor : undefined}
                fabColor={fabColor}
                fabBackgroundColor={fabBackgroundColor}
                fabMargin={fabMargin}
                fabMarginTop={fabMarginTop}
                fabMarginRight={fabMarginRight}
                fabMarginBottom={fabMarginBottom}
                fabMarginLeft={fabMarginLeft}
                fabMarginStart={fabMarginStart}
                fabMarginEnd={fabMarginEnd}
                fabFontFamily={fabFontFamily}
                fabFontWeight={fabFontWeight}
                fabFontStyle={fabFontStyle}
                fabFontSize={fabFontSize}
                fabElevation={fabElevation}
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
