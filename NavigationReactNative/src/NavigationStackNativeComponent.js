// @flow strict-local

import type {ViewProps} from 'react-native/Libraries/Components/View/ViewPropTypes';
import type {HostComponent} from 'react-native';
import codegenNativeComponent from 'react-native/Libraries/Utilities/codegenNativeComponent';

type NativeProps = $ReadOnly<{|
  ...ViewProps,
  keys: $ReadOnlyArray<string>,
  enterAnim: string,
  exitAnim: string,
  enterAnimOff: boolean,
  sharedElements: $ReadOnlyArray<string>,
  containerTransform: boolean,
  mostRecentEventCount: Int32,
  onNavigateToTop: DirectEventHandler<null>,
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
