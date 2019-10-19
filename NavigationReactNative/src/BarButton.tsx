import React from 'react';
import { requireNativeComponent, Image, Platform } from 'react-native';

class NavigationBarButton extends React.Component<any, any> {
  render() {
    if (Platform.OS === "android") {
      return null;
    }
    const nativeProps = {...this.props};
    if (this.props.icon) {
      nativeProps.icon = Image.resolveAssetSource(this.props.icon);
    }

    return (
      <NVBarButton {...nativeProps}>
        {this.props.children}
      </NVBarButton>
    )
  }
}
var NVBarButton = requireNativeComponent<any>('NVBarButton', null);

export default NavigationBarButton;
