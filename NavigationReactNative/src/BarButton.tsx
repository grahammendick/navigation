import React from 'react'
import { requireNativeComponent, Image, Platform, UIManager } from 'react-native';

const BarButton = ({image, show, search, children, ...props}) => {
    var constants = (UIManager as any).getViewManagerConfig('NVNavigationBar').Constants;
    return (Platform.OS === 'android' || !search) && (
        <NVBarButton
            search={search}
            showActionView={!!children}
            show={Platform.OS === 'android' ? constants.ShowAsAction[show] : null}
            image={Platform.OS === 'android' ? Image.resolveAssetSource(image) : image}
            {...props}>
            {Platform.OS === 'android' ? children : null}
        </NVBarButton>
    )
}

const NVBarButton = requireNativeComponent<any>('NVBarButton', null)

export default BarButton;
