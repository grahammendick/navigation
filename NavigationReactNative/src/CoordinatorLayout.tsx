import React from 'react'
import { requireNativeComponent, Platform } from 'react-native';

const CoordinatorLayout = (props) => Platform.OS === 'android' && <NVCoordinatorLayout {...props} />;

const NVCoordinatorLayout = requireNativeComponent<any>('NVCoordinatorLayout', null)

export default CoordinatorLayout;

