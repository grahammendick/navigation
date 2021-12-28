import React from 'react';
import { View, TouchableOpacity, Image, Text, StyleSheet } from 'react-native';

declare module 'react-native' {
    interface TextProps {
      accessibilityRole?: string;
    }
}

const NavigationBar = ({hidden = false, navigationImage, onNavigationPress, navigationHref, barTintColor, tintColor, title, titleColor, titleFontSize = 20}) => {
    barTintColor = (typeof barTintColor === 'function' ? barTintColor(true) : barTintColor) || '#fff';
    tintColor = (typeof tintColor === 'function' ? tintColor(true) : tintColor) || '#000';
    titleColor = (typeof titleColor === 'function' ? titleColor(true) : titleColor) || '#000';
    if (hidden) return null;
    return (
        <View style={{height: 56, flexDirection: 'row', alignItems: 'center', paddingStart: 16, backgroundColor: barTintColor}}>
            {navigationImage && (
                <View href={navigationHref} style={{width: 56}}>
                    <TouchableOpacity onPress={onNavigationPress}>
                        <Image source={navigationImage} style={{width: 24, height: 24, tintColor}} />
                    </TouchableOpacity>
                </View>
            )}
            <Text accessibilityRole="heading" style={{flex: 1, color: titleColor, fontSize: titleFontSize}}>{title}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    bar: {
    },
});


export default NavigationBar;