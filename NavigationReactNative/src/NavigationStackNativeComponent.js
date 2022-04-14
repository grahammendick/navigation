// @flow strict-local

import type {ViewProps} from 'react-native/Libraries/Components/View/ViewPropTypes';
import type {HostComponent} from 'react-native';
import codegenNativeComponent from 'react-native/Libraries/Utilities/codegenNativeComponent';

type NativeProps = $ReadOnly<{|
  ...ViewProps,
  keys: $ReadOnlyArray<string>,
  mostRecentEventCount: Int32,
  onWillNavigateBack: DirectEventHandler<$ReadOnly<{|
    crumb: Int32
  |}>>,
  onRest: DirectEventHandler<$ReadOnly<{|
    crumb: Int32,
    eventCount: Int32,
  |}>>
|}>;

export default (codegenNativeComponent<NativeProps>(
   'NVNavigationStack',
): HostComponent<NativeProps>);
