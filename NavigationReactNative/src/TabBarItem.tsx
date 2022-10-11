import React, { useRef } from 'react';
import { requireNativeComponent, Image, Platform, StyleSheet } from 'react-native';
import BackButton from './BackButton';
import BackHandlerContext from './BackHandlerContext';
import createBackHandler from './createBackHandler';

const TabBarItem = ({selected, onPress, children, image, systemItem, badge, index, ...props}) => {
    const backHandler = useRef(createBackHandler());
    image = typeof image === 'string' ? (Platform.OS === 'ios' ? null : {uri: image}) : image;
    return (
        <NVTabBarItem
            {...props}
            selected={selected}
            badge={badge != null ? '' + badge : undefined}
            image={Image.resolveAssetSource(image)}
            systemItem={systemItem || ''}
            style={styles.tabBarItem}
            onPress={event => {
                event.stopPropagation();
                if (onPress)
                    onPress(event);
            }}>
            <BackButton onPress={() => selected && backHandler.current.handleBack()} />
            <BackHandlerContext.Provider value={backHandler.current}>
                {children}
            </BackHandlerContext.Provider>
        </NVTabBarItem>
    );
}

var NVTabBarItem = global.nativeFabricUIManager ? require('./TabBarItemNativeComponent').default : requireNativeComponent('NVTabBarItem');

const styles = StyleSheet.create({
    tabBarItem: {
        position: 'absolute',
        top: 0, right: 0,
        bottom: 0, left: 0,
    },
});

export default TabBarItem;
