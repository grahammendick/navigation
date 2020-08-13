import React from 'react'
import { requireNativeComponent, Image, Platform, UIManager } from 'react-native';

const BarButton = ({image, show, search, ...props}) => {
    var constants = (UIManager as any).getViewManagerConfig('NVNavigationBar').Constants;
    return (Platform.OS === 'android' || !search) && (
        <NVBarButton
            show={Platform.OS === 'android' ? constants.ShowAsAction[show] : null}
            image={Platform.OS === 'android' ? Image.resolveAssetSource(image) : image}
            {...props} />
    )
}

const NVBarButton = requireNativeComponent<any>('NVBarButton', null)

export default BarButton;
