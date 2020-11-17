import React from "react";
import { requireNativeComponent } from 'react-native';

const StatusBar = ({barStyle, hidden, barTintColor}) => (
    <NVStatusBar
        barStyle={barStyle}
        hidden={hidden}
        barTintColor={barTintColor} />
);

const NVStatusBar = requireNativeComponent<any>("NVStatusBar", null);

export default StatusBar;
