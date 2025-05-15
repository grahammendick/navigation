import React from 'react'
import { requireNativeComponent, Platform } from 'react-native';
import OverlapContext from './OverlapContext';

const CoordinatorLayout = ({overlap, children}) => (
    <NVCoordinatorLayout overlap={overlap} style={{flex: 1}}>
        <OverlapContext.Provider value={overlap || 0}>{children}</OverlapContext.Provider>
    </NVCoordinatorLayout>
);
const NVCoordinatorLayout = global.nativeFabricUIManager ? require('./CoordinatorLayoutNativeComponent').default : requireNativeComponent('NVCoordinatorLayout');

export default Platform.OS === 'android' ? CoordinatorLayout : ({children}) => children;

