import React, { ReactElement } from 'react';
import { View, TouchableOpacity, Image, Text, StyleSheet } from 'react-native';
import LeftBar from './LeftBar';
import RightBar from './RightBar';

declare module 'react-native' {
    interface TextProps {
      accessibilityRole?: string;
    }
}

const NavigationBar = ({hidden = false, navigationImage, onNavigationPress, navigationHref, navigationTestID,
    barTintColor, tintColor, title, titleColor, titleFontFamily, titleFontWeight, titleFontStyle, titleFontSize, children}) => {
    barTintColor = (typeof barTintColor === 'function' ? barTintColor(true) : barTintColor) || '#fff';
    tintColor = (typeof tintColor === 'function' ? tintColor(true) : tintColor) || '#000';
    titleColor = (typeof titleColor === 'function' ? titleColor(true) : titleColor) || '#000';
    titleFontFamily = (typeof titleFontFamily === 'function' ? titleFontFamily(true) : titleFontFamily);
    titleFontWeight = (typeof titleFontWeight === 'function' ? titleFontWeight(true) : titleFontWeight);
    titleFontStyle = (typeof titleFontStyle === 'function' ? titleFontStyle(true) : titleFontStyle);
    titleFontSize = (typeof titleFontSize === 'function' ? titleFontSize(true) : titleFontSize) || 20;
    var childrenArray = (React.Children.toArray(children) as ReactElement<any>[]);
    if (hidden) return null;
    return (
        <View style={[styles.bar, {backgroundColor: barTintColor}]}>
            {navigationImage && (
                <View href={navigationHref} style={{width: 56}}>
                    <TouchableOpacity testID={navigationTestID} onPress={onNavigationPress}>
                        <Image source={navigationImage} style={{width: 24, height: 24, tintColor}} />
                    </TouchableOpacity>
                </View>
            )}
            <Text
                accessibilityRole="heading"
                style={{
                    flex: 1,
                    color: titleColor,
                    fontFamily: titleFontFamily,
                    fontWeight: titleFontWeight,
                    fontStyle: titleFontStyle,
                    fontSize: titleFontSize
                }}>{title}</Text>
            {[
                childrenArray.find(({type}) => type === LeftBar),
                childrenArray.find(({type}) => type === RightBar)
            ]}
        </View>
    );
}

const styles = StyleSheet.create({
    bar: {
        height: 56,
        flexDirection: 'row',
        alignItems: 'center',
        paddingStart: 16,
        paddingEnd: 16,
    },
});


export default NavigationBar;