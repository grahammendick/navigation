import React from 'react';
import { requireNativeComponent, Image, Platform } from 'react-native';
class NavigationBar extends React.Component<any, any> {
  render() {
    if (Platform.OS == "android" && this.props.hidden) {
      return null
    }

    const nativeProps = {...this.props};
    if (this.props.logo) {
      nativeProps.logo = Image.resolveAssetSource(this.props.logo);
    }

    if (this.props.navIcon) {
      nativeProps.navIcon = Image.resolveAssetSource(this.props.navIcon);
    }

    if (this.props.overflowIcon) {
      nativeProps.overflowIcon = Image.resolveAssetSource(this.props.overflowIcon);
    }

    return (
      <NVNavigationBar {...nativeProps} style={Platform.OS == "android" ? { height: 50 } : undefined}>
        {this.props.children}
      </NVNavigationBar>
    )
  }
}
var NVNavigationBar = requireNativeComponent<any>('NVNavigationBar', null);
export default NavigationBar;