import React from 'react';
import { requireNativeComponent, Platform, StyleSheet } from 'react-native';

var TabBar = ({children, barTintColor, tintColor}) => <NVTabBar style={styles.tabBar} barTintColor={barTintColor} tintColor={tintColor}>{children}</NVTabBar>;

var NVTabBar = requireNativeComponent<any>('NVTabBar', null);

const styles = StyleSheet.create({
    tabBar: {
        flex: 1,
    },
});

export default Platform.OS === 'ios' ? TabBar : () => null;
