import React from "react";
import { requireNativeComponent, Platform } from 'react-native';

const LeftBar = ({supplementBack = false, children}) => (
    Platform.OS === "ios" ?
        <NVLeftBar supplementBack={supplementBack}>{children}</NVLeftBar> : children
);

const NVLeftBar = global.nativeFabricUIManager ? require('./LeftBarNativeComponent').default : requireNativeComponent('NVLeftBar');

export default LeftBar;
