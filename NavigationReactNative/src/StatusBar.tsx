import React from "react";
import { requireNativeComponent } from 'react-native';

const StatusBar = ({barStyle, hidden}) => (
    <NVStatusBar barStyle={barStyle} hidden={hidden} />
);

const NVStatusBar = requireNativeComponent<any>("NVStatusBar", null);

export default StatusBar;
