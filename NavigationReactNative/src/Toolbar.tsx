import React from 'react';
import { Platform, Image, requireNativeComponent } from 'react-native';

const Toolbar = ({ bottom, logo, navigationImage, overflowImage, ...props }) => {
    var Toolbar = !bottom ? NVToolbar : NVToolbarBottom;
    return (
        <Toolbar
            logo={Image.resolveAssetSource(logo)}
            navigationImage={Image.resolveAssetSource(navigationImage)}
            overflowImage={Image.resolveAssetSource(overflowImage)}
            {...props}
            style={{height: 56}}
        />
    );
}

var NVToolbar = requireNativeComponent<any>('NVToolbar', null);
var NVToolbarBottom = requireNativeComponent<any>('NVToolbarBottom', null);

export default Platform.OS === 'android' ? Toolbar : null;
