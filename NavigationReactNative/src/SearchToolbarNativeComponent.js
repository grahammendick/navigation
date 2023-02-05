// @flow strict-local

import type {ViewProps} from 'react-native/Libraries/Components/View/ViewPropTypes';
import type {HostComponent} from 'react-native';
import codegenNativeComponent from 'react-native/Libraries/Utilities/codegenNativeComponent';

type NativeProps = $ReadOnly<{|
  ...ViewProps,
  placeholder: string,
  barTintColor: ColorValue,
  tintColor: ColorValue,
  navigationImage: ImageSource,
  navigationTestID: string,
  navigationDecorative: boolean,
  navigationAccessibilityLabel: string,
  overflowImage: ImageSource,
  overflowTestID: string,
  onNavigationPress: DirectEventHandler<null>,
|}>;

export default (codegenNativeComponent<NativeProps>(
   'NVSearchToolbar',
): HostComponent<NativeProps>);
