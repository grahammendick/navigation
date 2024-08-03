// @flow strict-local

import type {ViewProps} from 'react-native/Libraries/Components/View/ViewPropTypes';
import type {HostComponent} from 'react-native';
import codegenNativeComponent from 'react-native/Libraries/Utilities/codegenNativeComponent';

type NativeProps = $ReadOnly<{|
  ...ViewProps,
  open: boolean,
  fromRight: boolean,
  mostRecentEventCount: Int32,
  onChangeOpen: DirectEventHandler<$ReadOnly<{|
    open: boolean,
    eventCount: Int32,
  |}>>,
|}>;

export default (codegenNativeComponent<NativeProps>(
   'NVDrawerLayout',
): HostComponent<NativeProps>);
