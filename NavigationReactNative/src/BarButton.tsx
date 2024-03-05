import React, { ReactElement } from "react";
import {
  requireNativeComponent,
  Image,
  Platform,
  UIManager,
} from "react-native";
import ActionBar from "./ActionBar";

const BarButton = React.forwardRef<any, any>(
  (
    {
      image,
      systemName,
      systemItem,
      show,
      search = false,
      size = 48,
      buttonStyle = "plain",
      style,
      children,
      testID,
      ...props
    },
    ref,
  ) => {
    var constants = (UIManager as any).getViewManagerConfig(
      "NVNavigationBar",
    ).Constants;
    var actionBar = !!(
      (React.Children.toArray(children) as ReactElement<any>[])[0]?.type ===
      ActionBar
    );
    return (
      (Platform.OS === "android" || !search) && (
        <NVBarButton
          ref={ref}
          key={Platform.OS === "ios" ? systemItem || systemName : testID}
          testID={testID}
          search={search}
          showActionView={!!children}
          showAsAction={
            Platform.OS === "android"
              ? constants.ShowAsAction[show || "never"]
              : null
          }
          actionBar={actionBar}
          image={Image.resolveAssetSource(image)}
          buttonStyle={Platform.OS === "ios" ? buttonStyle : null}
          systemName={systemName || ""}
          systemItem={systemItem || ""}
          buttonWidth={actionBar ? 0 : size}
          style={{ position: "absolute", width: actionBar ? undefined : size }}
          children={children}
          {...props}
        />
      )
    );
  },
);

const NVBarButton = global.nativeFabricUIManager
  ? require("./BarButtonNativeComponent").default
  : requireNativeComponent("NVBarButton");

export default BarButton;
