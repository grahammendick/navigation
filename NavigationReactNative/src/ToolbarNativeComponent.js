// @flow strict-local

import type {ViewProps} from 'react-native/Libraries/Components/View/ViewPropTypes';
import type {HostComponent} from 'react-native';
import codegenNativeComponent from 'react-native/Libraries/Utilities/codegenNativeComponent';

type NativeProps = $ReadOnly<{|
  ...ViewProps,
  crumb: Int32,
  autoNavigation: boolean,
  title: string,
  titleFontFamily: string,
  titleFontWeight: string,
  titleFontStyle: string,
  titleFontSize?: WithDefault<Float, -1>,
  titleCentered: boolean,
  barTintColor: ColorValue,
  tintColor: ColorValue,
  titleColor: ColorValue,
  navigationImage: $ReadOnly<{|
    height: Int32,
    width: Int32,
    scale: Int32,
    uri: string,
  |}>,
  navigationTestID: string,
  navigationAccessibilityLabel: string,
  logo: $ReadOnly<{|
    height: Int32,
    width: Int32,
    scale: Int32,
    uri: string,
  |}>,
  overflowImage: $ReadOnly<{|
    height: Int32,
    width: Int32,
    scale: Int32,
    uri: string,
  |}>,
  overflowTestID: string,
  pin: boolean,
  barHeight: Double,
  onNavigationPress: DirectEventHandler<null>,
|}>;

export default (codegenNativeComponent<NativeProps>(
   'NVToolbar',
): HostComponent<NativeProps>);
