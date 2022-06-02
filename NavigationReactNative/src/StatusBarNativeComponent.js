// @flow strict-local

import type {ViewProps} from 'react-native/Libraries/Components/View/ViewPropTypes';
import type {HostComponent} from 'react-native';
import codegenNativeComponent from 'react-native/Libraries/Utilities/codegenNativeComponent';

type NativeProps = $ReadOnly<{|
  ...ViewProps,
  hidden: boolean,
  tintStyle: string,
  barTintColor: ColorValue,
|}>;

export default (codegenNativeComponent<NativeProps>(
   'NVStatusBar',
): HostComponent<NativeProps>);
