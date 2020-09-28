import React from "react";
import { Platform, requireNativeComponent } from "react-native";

const NVRightBar = requireNativeComponent("NVRightBar", null);

export default Platform.OS === "ios"
  ? ({ children }) => (
      <NVRightBar>{React.Children.toArray(children).reverse()}</NVRightBar>
    )
  : ({ children }) => children;
