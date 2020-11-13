import React from "react";
import { Platform, requireNativeComponent } from "react-native";

const RightBar = ({children}) => (
    Platform.OS === "ios" ?
        <NVRightBar>{React.Children.toArray(children).reverse()}</NVRightBar> : children
);

const NVRightBar = requireNativeComponent<any>("NVRightBar", null);

export default RightBar;
