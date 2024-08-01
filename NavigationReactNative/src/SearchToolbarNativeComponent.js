// @flow strict-local

import type {ViewProps} from 'react-native/Libraries/Components/View/ViewPropTypes';
import type {HostComponent} from 'react-native';
import codegenNativeComponent from 'react-native/Libraries/Utilities/codegenNativeComponent';

type NativeProps = $ReadOnly<{|
  ...ViewProps,
  crumb: Int32,
  autoNavigation: boolean,
  placeholder: string,
  fontFamily: string,
  fontWeight: string,
  fontStyle: string,
  fontSize?: WithDefault<Float, -1>,
  barTintColor: ColorValue,
  tintColor: ColorValue,
  navigationImage: ImageSource,
  navigationTestID: string,
  navigationAccessibilityLabel: string,
  overflowImage: ImageSource,
  overflowTestID: string,
  onNavigationPress: DirectEventHandler<null>,
|}>;

export default (codegenNativeComponent<NativeProps>(
   'NVSearchToolbar',
): HostComponent<NativeProps>);
