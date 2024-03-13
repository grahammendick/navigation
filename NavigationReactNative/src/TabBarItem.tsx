import React, { useRef, useState, useEffect } from 'react';
import { requireNativeComponent, Image, Platform, StyleSheet } from 'react-native';
import BackButton from './BackButton';
import TabBarItemContext from './TabBarItemContext';
import BackHandlerContext from './BackHandlerContext';
import createBackHandler from './createBackHandler';
import Freeze from './Freeze';

const TabBarItem = ({selected, onPress, children, title, image, systemItem, badge, index, freezable, ...props}) => {
    const [loaded, setLoaded] = useState(selected);
    const [freeze, setFreeze] = useState(false);
    const backHandler = useRef(createBackHandler());
    const onLoad = useRef({ onLoad: () => setLoaded(true)});
    useEffect(() => {
        if(freeze !== freezable) {
            if (global.nativeFabricUIManager && freezable) {
                var timer = setTimeout(() => {
                    setFreeze(freezable);
                }, 100);
            } else {
                setFreeze(freezable);
            }
        }
        return () => clearTimeout(timer);
    }, [freeze, freezable]);
    useEffect(() => {
        setFreeze(false);
    }, [image, systemItem, badge, title]);
    if (!loaded && selected) setLoaded(true);
    image = typeof image === 'string' && Platform.OS === 'android' ? { uri: image } : image;
    return (
        <>
            <BackButton onPress={() => selected && backHandler.current.handleBack()} />
            <Freeze enabled={loaded && freeze}>
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
                    title={title}
                    badge={badge != null ? '' + badge : undefined}
                    image={Platform.OS === 'ios' && typeof image === 'string' ? image : Image.resolveAssetSource(image)}
                    systemItem={systemItem || ''}
                    style={styles.tabBarItem}
                    onPress={event => {
                        event.stopPropagation();
                        if (onPress)
                            onPress(event);
                    }}>
                    <TabBarItemContext.Provider value={onLoad.current}>
                        <BackHandlerContext.Provider value={backHandler.current}>
                            {children}
                        </BackHandlerContext.Provider>
                    </TabBarItemContext.Provider>
                </NVTabBarItem>
            </Freeze>
        </>
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
