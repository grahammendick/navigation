import React from 'react';
import { requireNativeComponent, StyleSheet } from 'react-native';

var TabBarItem = ({onPress, ...props}) => (
    <NVTabBarItem
        {...props}
        style={styles.tabBarItem}
        onPress={event => {
            event.stopPropagation();
            if (onPress)
                onPress(event);
        }} />
);

var NVTabBarItem = requireNativeComponent<any>('NVTabBarItem', null);

const styles = StyleSheet.create({
    tabBarItem: {
        position: 'absolute',
        top: 0, right: 0,
        bottom: 0, left: 0,
    },
});

export default TabBarItem;
