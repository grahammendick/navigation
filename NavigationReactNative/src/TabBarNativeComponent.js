// @flow strict-local

import type {ViewProps} from 'react-native/Libraries/Components/View/ViewPropTypes';
import type {HostComponent} from 'react-native';
import codegenNativeComponent from 'react-native/Libraries/Utilities/codegenNativeComponent';

type NativeProps = $ReadOnly<{|
  ...ViewProps,
  onTabSelected: DirectEventHandler<$ReadOnly<{|
    tab: Int32,
    eventCount: Int32,
  |}>>
|}>;

export default (codegenNativeComponent<NativeProps>(
   'NVTabBar',
): HostComponent<NativeProps>);
