import React from 'react';
import { View, TouchableOpacity, Image, Text, StyleSheet } from 'react-native';

declare module 'react-native' {
    interface TextProps {
      accessibilityRole?: string;
    }
}

const NavigationBar = ({navigationImage, onNavigationPress, navigationHref, tintColor, title, titleFontSize = 20}) => {
    return (
        <View style={{height: 56, flexDirection: 'row', alignItems: 'center', paddingStart: 8}}>
            {navigationImage && (
                <View href={navigationHref} style={{width: 32, alignItems: 'center'}}>
                    <TouchableOpacity onPress={onNavigationPress}>
                        <Image source={navigationImage} style={{width: 24, height: 24, tintColor}} />
                    </TouchableOpacity>
                </View>
            )}
            <Text accessibilityRole="heading" style={{flex: 1, fontSize: titleFontSize, paddingStart: 8}}>{title}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    bar: {
    },
});


export default NavigationBar;