// @flow strict-local

import type {ViewProps} from 'react-native/Libraries/Components/View/ViewPropTypes';
import type {HostComponent} from 'react-native';
import codegenNativeComponent from 'react-native/Libraries/Utilities/codegenNativeComponent';

type NativeProps = $ReadOnly<{|
  ...ViewProps,
  sceneKey: string,
  crumb: Int32,
  onPopped: DirectEventHandler<null>
|}>;

export default (codegenNativeComponent<NativeProps>(
   'NVScene',
): HostComponent<NativeProps>);
