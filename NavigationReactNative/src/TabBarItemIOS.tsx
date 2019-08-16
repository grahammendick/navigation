import React from 'react';
import { requireNativeComponent, Platform } from 'react-native';

var TabBarItem = ({title, badge, badgeColor, image, systemItem, onPress, children}) => (
    <NVTabBarItem
        title={title}
        badge={badge}
        badgeColor={badgeColor}
        image={image}
        systemItem={systemItem}
        onPress={event => {
            event.stopPropagation();
            if (onPress)
                onPress(event);
        }}>
        {children}            
    </NVTabBarItem>
);

var NVTabBarItem = requireNativeComponent<any>('NVTabBarItem', null);

export default Platform.OS === 'ios' ? TabBarItem : () => null;
