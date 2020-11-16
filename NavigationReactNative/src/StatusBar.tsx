import React from "react";
import { requireNativeComponent } from 'react-native';

const StatusBar = ({barStyle}) => <NVStatusBar barStyle={barStyle} />;

const NVStatusBar = requireNativeComponent<any>("NVStatusBar", null);

export default StatusBar;
