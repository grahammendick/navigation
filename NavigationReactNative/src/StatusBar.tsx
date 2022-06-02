import React from "react";
import { requireNativeComponent, Platform } from 'react-native';

type StatusBarProps = { tintStyle?: string, hidden?: boolean, barTintColor?: string };

const StatusBar = ({tintStyle, hidden, barTintColor}: StatusBarProps) => (
    <NVStatusBar        
        hidden={hidden}
        tintStyle={tintStyle && (Platform.OS === 'ios' ? tintStyle + '-content' : tintStyle)}
        barTintColor={barTintColor} />
);

const NVStatusBar = global.nativeFabricUIManager ? require('./StatusBarNativeComponent').default : requireNativeComponent('NVStatusBar');

export default StatusBar;
