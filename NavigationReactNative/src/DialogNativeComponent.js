// @flow strict-local

import type {ViewProps} from 'react-native/Libraries/Components/View/ViewPropTypes';
import type {HostComponent} from 'react-native';
import codegenNativeComponent from 'react-native/Libraries/Utilities/codegenNativeComponent';

type NativeProps = $ReadOnly<{|
  ...ViewProps,
  detent: string,
  stackId: string,
  ancestorStackIds: $ReadOnlyArray<string>,
  mostRecentEventCount: Int32,
  onDismissed: DirectEventHandler<null>,
  onDetentChanged: DirectEventHandler<$ReadOnly<{|
    detent: string,
    eventCount: Int32,
  |}>>,
|}>;

export default (codegenNativeComponent<NativeProps>(
   'NVDialog',
   {interfaceOnly: true}
): HostComponent<NativeProps>);
