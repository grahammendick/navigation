import React, { useRef, useState } from 'react';
import { requireNativeComponent, Image, Platform, StyleSheet } from 'react-native';
import BackButton from './BackButton';
import TabBarItemContext from './TabBarItemContext';
import BackHandlerContext from './BackHandlerContext';
import createBackHandler from './createBackHandler';
import Freeze from './Freeze';

const TabBarItem = ({selected, onPress, children, image, systemItem, badge, index, freezable, ...props}) => {
    const [loaded, setLoaded] = useState(selected);
    const backHandler = useRef(createBackHandler());
    const onLoad = useRef({ onLoad: () => setLoaded(true)});
    if (!loaded && selected) setLoaded(true);
    image = typeof image === 'string' ? (Platform.OS === 'ios' ? null : {uri: image}) : image;
    return (
        <Freeze enabled={loaded && !selected && freezable}>
            <NVTabBarItem
                ref={(ref: any) => {
                    if (!!React.Suspense && ref?.viewConfig?.validAttributes?.style) {
                        ref.viewConfig.validAttributes.style = {
                            ...ref.viewConfig.validAttributes.style,
                            display: false
                        };
                    }
                }}
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
                <TabBarItemContext.Provider value={onLoad.current}>
                    <BackHandlerContext.Provider value={backHandler.current}>
                        {children}
                    </BackHandlerContext.Provider>
                </TabBarItemContext.Provider>
            </NVTabBarItem>
        </Freeze>
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
