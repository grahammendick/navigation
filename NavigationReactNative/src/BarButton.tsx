import React from 'react';
import { requireNativeComponent, Image, Platform } from 'react-native';

var NVBarButton = requireNativeComponent<any>('NVBarButton', null);
var NavigationBarButton = Platform.OS === 'ios' ? ({image, children, ...otherProps}) => (
    <NVBarButton
        image={Image.resolveAssetSource(image)} 
        {...otherProps}>
        {children}
    </NVBarButton>
) : () => null;
export default NavigationBarButton;
