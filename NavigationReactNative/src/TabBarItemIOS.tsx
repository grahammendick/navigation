import React from 'react';
import { requireNativeComponent, Platform, StyleSheet } from 'react-native';

var TabBarItem = ({title, badge, badgeColor, image, systemItem, onPress, children}) => (
    <NVTabBarItem
        title={title}
        badge={badge}
        badgeColor={badgeColor}
        image={image}
        systemItem={systemItem}
        style={styles.tabBarItem}
        onPress={event => {
            event.stopPropagation();
            if (onPress)
                onPress(event);
        }}>
        {children}            
    </NVTabBarItem>
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
