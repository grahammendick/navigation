import React, { ReactChild, ReactElement } from 'react';
import { requireNativeComponent, Image, Platform } from 'react-native';
import LeftBar from './LeftBar';
import RightBar from './RightBar';

class NavigationBar extends React.Component<any, any> {
  render() {
    if (Platform.OS == "android" && this.props.hidden) {
      return null
    }

    var nativeProps = {...this.props};
    if (this.props.logo) {
      nativeProps.logo = Image.resolveAssetSource(this.props.logo);
    }
    if (this.props.navIcon) {
      nativeProps.navIcon = Image.resolveAssetSource(this.props.navIcon);
    }
    if (this.props.overflowIcon) {
      nativeProps.overflowIcon = Image.resolveAssetSource(this.props.overflowIcon);
    }

    if (Platform.OS === 'android') {
      var {children} = this.props;

      var menuItems = React.Children.toArray(children)
        .filter((child: ReactElement<any>) => {
          var type = child.type;
          return (type === LeftBar || type === RightBar)
        })
        .sort((a: ReactElement<any>, b: ReactElement<any>) => {
          if (a.type === b.type) {
            return 0
          }
          if (a.type === RightBar) {
            return 1
          }
          return -1
        })
        .map((child: ReactElement<any>) => (
          React.Children.toArray(child.props.children)
            .map((child: ReactElement<any>) => ({
              ...child.props,
              image: Image.resolveAssetSource(child.props.image),
            })
          )
        ))
      
      // flatten items `[[item]]` -> `[item]`
      menuItems = [].concat.apply([], menuItems)
      nativeProps.menuItems = menuItems;
      return (
        <NVNavigationBar {...nativeProps} style={{ height: 50 }} onActionSelected={(event) => {
          var position = event.nativeEvent.position
          var onPress = nativeProps.menuItems[position].onPress
          if (onPress) {
            onPress()
          }
        }} >
          {this.props.children}
        </NVNavigationBar>
      )
    } else {
      return (
        <NVNavigationBar {...nativeProps}>
          {this.props.children}
        </NVNavigationBar>
      )
    }

  }
}
var NVNavigationBar = requireNativeComponent<any>('NVNavigationBar', null);
export default NavigationBar;