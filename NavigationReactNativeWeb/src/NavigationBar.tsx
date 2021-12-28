import React from 'react';
import { View, TouchableOpacity, Image, Text, StyleSheet } from 'react-native';

declare module 'react-native' {
    interface TextProps {
      accessibilityRole?: string;
    }
}

const NavigationBar = ({hidden = false, navigationImage, onNavigationPress, navigationHref, barTintColor, tintColor, title, titleColor, titleFontFamily, titleFontWeight, titleFontStyle, titleFontSize}) => {
    barTintColor = (typeof barTintColor === 'function' ? barTintColor(true) : barTintColor) || '#fff';
    tintColor = (typeof tintColor === 'function' ? tintColor(true) : tintColor) || '#000';
    titleColor = (typeof titleColor === 'function' ? titleColor(true) : titleColor) || '#000';
    titleFontFamily = (typeof titleFontFamily === 'function' ? titleFontFamily(true) : titleFontFamily);
    titleFontWeight = (typeof titleFontWeight === 'function' ? titleFontWeight(true) : titleFontWeight);
    titleFontStyle = (typeof titleFontStyle === 'function' ? titleFontStyle(true) : titleFontStyle);
    titleFontSize = (typeof titleFontSize === 'function' ? titleFontSize(true) : titleFontSize) || 20;
    if (hidden) return null;
    return (
        <View style={[styles.bar, {backgroundColor: barTintColor}]}>
            {navigationImage && (
                <View href={navigationHref} style={{width: 56}}>
                    <TouchableOpacity onPress={onNavigationPress}>
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
        </View>
    );
}

const styles = StyleSheet.create({
    bar: {
        height: 56,
        flexDirection: 'row',
        alignItems: 'center',
        paddingStart: 16,
    },
});


export default NavigationBar;