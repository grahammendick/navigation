import React, { ReactElement, useRef, useLayoutEffect } from 'react';
import { View, TouchableOpacity, Image, Text, StyleSheet } from 'react-native';
import NavigationBarContext from './NavigationBarContext';
import LeftBar from './LeftBar';
import RightBar from './RightBar';
import TitleBar from './TitleBar';

declare module 'react-native' {
    interface TouchableOpacityProps {
        href?: string;
    }
}

const NavigationBar = ({hidden = false, navigationImage, onNavigationPress, navigationHref, navigationTestID, navigationAccessibilityLabel,
    barTintColor, tintColor, title, titleColor, titleFontFamily, titleFontWeight, titleFontStyle, titleFontSize, children}) => {
    const barRef = useRef<any>(undefined);
    useLayoutEffect(() => {
        const content = barRef.current?.nextElementSibling;
        if (content && !content.style.paddingTop)
            content.style.paddingTop = '56px';
    })
    barTintColor = (typeof barTintColor === 'function' ? barTintColor(true) : barTintColor) || '#fff';
    tintColor = (typeof tintColor === 'function' ? tintColor(true) : tintColor) || '#000';
    titleColor = (typeof titleColor === 'function' ? titleColor(true) : titleColor) || '#000';
    titleFontFamily = (typeof titleFontFamily === 'function' ? titleFontFamily(true) : titleFontFamily);
    titleFontWeight = (typeof titleFontWeight === 'function' ? titleFontWeight(true) : titleFontWeight);
    titleFontStyle = (typeof titleFontStyle === 'function' ? titleFontStyle(true) : titleFontStyle);
    titleFontSize = (typeof titleFontSize === 'function' ? titleFontSize(true) : titleFontSize) || 20;
    const childrenArray = (React.Children.toArray(children) as ReactElement<any>[]);
    const titleBar = childrenArray.find(({type}) => type === TitleBar);
    if (hidden) return null;
    const onPress = (e) => {
        if (!navigationHref || (!e.ctrlKey && !e.shiftKey && !e.metaKey && !e.altKey && !e.button)) {
            if (navigationHref) e.preventDefault();
            onNavigationPress();
        }
    }
    return (
        <View ref={barRef} style={[styles.bar, {backgroundColor: barTintColor}]}>
            {navigationImage && (
                <TouchableOpacity href={navigationHref} testID={navigationTestID} onPress={onPress} style={{marginEnd: 32}}>
                    <Image source={navigationImage} accessibilityLabel={navigationAccessibilityLabel} style={{width: 24, height: 24, tintColor}} />
                </TouchableOpacity>
            )}
            {!titleBar ? (
                <Text
                    accessibilityRole={"heading" as any}
                    style={{
                        flex: 1,
                        color: titleColor,
                        fontFamily: titleFontFamily,
                        fontWeight: titleFontWeight,
                        fontStyle: titleFontStyle,
                        fontSize: titleFontSize
                    }}>
                    {title}
                </Text>
                ) : <View style={{flex: 1}}>{titleBar}</View>}
            <NavigationBarContext.Provider value={tintColor}>
                {[
                    childrenArray.find(({type}) => type === LeftBar),
                    childrenArray.find(({type}) => type === RightBar)
                ]}
            </NavigationBarContext.Provider>
        </View>
    );
}

const styles = StyleSheet.create({
    bar: {
        height: 56,
        flexDirection: 'row',
        alignItems: 'center',
        position: 'absolute',
        width: '100%',
        top: 0,
        left: 0,
        zIndex: 46,
        paddingStart: 16,
        paddingEnd: 16,
    },
});

export default NavigationBar;
