// @flow strict-local

import type {ViewProps} from 'react-native/Libraries/Components/View/ViewPropTypes';
import type {HostComponent} from 'react-native';
import codegenNativeComponent from 'react-native/Libraries/Utilities/codegenNativeComponent';

type NativeProps = $ReadOnly<{|
  ...ViewProps,
  selectedTintColor: ColorValue,
  unselectedTintColor: ColorValue,
  rippleColor: ColorValue,
  bottomTabs: boolean,
  selectedIndicatorAtTop: boolean,
  scrollable: boolean,
|}>;

export default (codegenNativeComponent<NativeProps>(
   'NVTabLayout',
): HostComponent<NativeProps>);
