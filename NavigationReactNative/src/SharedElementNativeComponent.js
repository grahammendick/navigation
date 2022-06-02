// @flow strict-local

import type {ViewProps} from 'react-native/Libraries/Components/View/ViewPropTypes';
import type {HostComponent} from 'react-native';
import codegenNativeComponent from 'react-native/Libraries/Utilities/codegenNativeComponent';

type NativeProps = $ReadOnly<{|
  ...ViewProps,
  name: string,
  duration?: WithDefault<Int32, -1>,
  fadeMode: string,
|}>;

export default (codegenNativeComponent<NativeProps>(
   'NVSharedElement',
): HostComponent<NativeProps>);
