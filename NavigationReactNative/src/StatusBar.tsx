import React from "react";
import { requireNativeComponent, Platform } from 'react-native';

const StatusBar = ({barStyle, hidden, barTintColor}) => (
    <NVStatusBar
        barStyle={barStyle && (Platform.OS === 'ios' ? barStyle + '-content' : barStyle)}
        hidden={hidden}
        barTintColor={barTintColor} />
);

const NVStatusBar = requireNativeComponent<any>("NVStatusBar", null);

export default StatusBar;
