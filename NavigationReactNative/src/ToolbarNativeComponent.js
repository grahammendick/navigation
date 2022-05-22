// @flow strict-local

import type {ViewProps} from 'react-native/Libraries/Components/View/ViewPropTypes';
import type {HostComponent} from 'react-native';
import codegenNativeComponent from 'react-native/Libraries/Utilities/codegenNativeComponent';

type NativeProps = $ReadOnly<{|
  ...ViewProps,
  title: string,
  titleFontFamily: string,
  titleFontWeight: string,
  titleFontStyle: string,
  titleFontSize?: WithDefault<Float, -1>,
  barTintColor: ColorValue,
  tintColor: ColorValue,
  titleColor: ColorValue,
  navigationImage: ImageSource,
  navigationTestID: string,
  navigationAccessibilityLabel: string,
  logo: ImageSource,
  overflowImage: ImageSource,
  overflowTestID: string,
  onNavigationPress: DirectEventHandler<null>,
|}>;

export default (codegenNativeComponent<NativeProps>(
   'NVToolbar',
): HostComponent<NativeProps>);
