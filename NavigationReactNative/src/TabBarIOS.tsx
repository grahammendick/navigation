import React from 'react';
import { requireNativeComponent, Platform, StyleSheet } from 'react-native';

var TabBar = props => <NVTabBar {...props} style={styles.tabBar} />;

var NVTabBar = requireNativeComponent<any>('NVTabBar', null);

const styles = StyleSheet.create({
    tabBar: {
        flex: 1,
    },
});

export default TabBar;
