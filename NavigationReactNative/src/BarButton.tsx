import React from 'react'
import { requireNativeComponent, Image, Platform, UIManager, View, StyleSheet } from 'react-native';

const BarButton = ({image, show, search, style, children, ...props}) => {
    var constants = (UIManager as any).getViewManagerConfig('NVNavigationBar').Constants;
    return (Platform.OS === 'android' || !search) && (
        <NVBarButton
            search={search}
            showActionView={!!children}
            show={Platform.OS === 'android' ? constants.ShowAsAction[show] : null}
            image={Platform.OS === 'android' ? Image.resolveAssetSource(image) : image}
            style={styles.actionView}
            {...props}>            
            {Platform.OS === 'android' && children
                ? <View collapsable={false} style={{flex: 1}}>{children}</View> : null}
        </NVBarButton>
    )
}

const NVBarButton = requireNativeComponent<any>('NVBarButton', null)

const styles = StyleSheet.create({
    actionView: {
        ...Platform.select({
            android: {
                position: 'absolute',
                top: 0, right: 0,
                bottom: 0, left: 0,
            },
        })
    }
});

export default BarButton;
