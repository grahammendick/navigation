import React from 'react'
import { requireNativeComponent, Platform } from 'react-native';

const BarButton = ({search, ...props}) => (
    (Platform.OS === 'ios' && !search) ? <NVBarButton {...props} /> : null
)

const NVBarButton = requireNativeComponent<any>('NVBarButton', null)

export default BarButton;
