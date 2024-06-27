// @flow strict-local

import type {ViewProps} from 'react-native/Libraries/Components/View/ViewPropTypes';
import type {HostComponent} from 'react-native';
import codegenNativeComponent from 'react-native/Libraries/Utilities/codegenNativeComponent';

type NativeProps = $ReadOnly<{|
  ...ViewProps,
  detent: string,
  stackId: string,
  ancestorStackIds: $ReadOnlyArray<string>,
  crumb: Int32,
  mostRecentEventCount: Int32,
  onDismissed: DirectEventHandler<null>,
  onDetentChanged: DirectEventHandler<$ReadOnly<{|
    detent: string,
    eventCount: Int32,
  |}>>,
|}>;

export default (codegenNativeComponent<NativeProps>(
   'NVSheet',
): HostComponent<NativeProps>);
