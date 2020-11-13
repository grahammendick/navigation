import React from "react";
import { requireNativeComponent, Platform } from 'react-native';

const LeftBar = ({supplementBack = false, children}) => (
    Platform.OS === "ios" ?
        <NVLeftBar supplementBack={supplementBack}>{children}</NVLeftBar> : children
);

const NVLeftBar = requireNativeComponent<any>("NVLeftBar", null);

export default LeftBar;
