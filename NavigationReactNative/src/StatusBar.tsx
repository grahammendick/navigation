import React from "react";
import { requireNativeComponent, Platform } from 'react-native';

const StatusBar = ({tintStyle, hidden, barTintColor}) => (
    <NVStatusBar        
        hidden={hidden}
        tintStyle={tintStyle && (Platform.OS === 'ios' ? tintStyle + '-content' : tintStyle)}
        barTintColor={barTintColor} />
);

const NVStatusBar = requireNativeComponent<any>("NVStatusBar", null);

export default StatusBar;
