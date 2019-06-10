import React from 'react';
import { requireNativeComponent, Platform, StyleSheet } from 'react-native';

var TabBar = ({children}) => <NVTabBar style={styles.tabBar}>{children}</NVTabBar>;

var NVTabBar = requireNativeComponent<any>('NVTabBar', null);

const styles = StyleSheet.create({
    tabBar: {
        flex: 1,
    },
});

export default Platform.OS === 'ios' ? TabBar : () => null;
