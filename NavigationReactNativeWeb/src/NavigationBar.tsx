import React from 'react';
import { View, TouchableOpacity, Image, Text, StyleSheet } from 'react-native';

declare module 'react-native' {
    interface TextProps {
      accessibilityRole?: string;
    }
}

const NavigationBar = ({navigationImage, onNavigationPress, tintColor, title}) => {
    return (
        <View style={{height: 56, flexDirection: 'row'}}>
            <View>
                {navigationImage && (
                    <TouchableOpacity onPress={onNavigationPress}>
                        <Image source={navigationImage} style={{width: 24, height: 24, tintColor}} />
                    </TouchableOpacity>
                )}
            </View>
            <Text accessibilityRole="heading" style={{flex: 1}}>{title}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    bar: {
    },
});


export default NavigationBar;