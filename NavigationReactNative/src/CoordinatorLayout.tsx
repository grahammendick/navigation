import React from 'react'
import { requireNativeComponent, Platform } from 'react-native';

const CoordinatorLayout = ({children}) => (
    Platform.OS === 'android' && <NVCoordinatorLayout style={{flex: 1}}>{children}</NVCoordinatorLayout>
);

const NVCoordinatorLayout = requireNativeComponent<any>('NVCoordinatorLayout', null)

export default CoordinatorLayout;

