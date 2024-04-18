// @flow strict-local

import type {ViewProps} from 'react-native/Libraries/Components/View/ViewPropTypes';
import type {HostComponent} from 'react-native';
import codegenNativeComponent from 'react-native/Libraries/Utilities/codegenNativeComponent';

type NativeProps = $ReadOnly<{|
  ...ViewProps,
  keys: $ReadOnlyArray<string>,
  enterAnim: string,
  exitAnim: string,
  enterTrans: $ReadOnly<{|
    duration?: string,
    items: $ReadOnlyArray<$ReadOnly<{|
      type: string,
      axis?: string,
      fromX?: string,
      fromY?: string,
      from?: string,
      pivotX?: string,
      pivotY?: string,
      duration?: string,
    |}>>
  |}>,
  exitTrans: $ReadOnly<{|
    duration?: string,
    items: $ReadOnlyArray<$ReadOnly<{|
      type: string,
      axis?: string,
      toX?: string,
      toY?: string,
      to?: string,
      pivotX?: string,
      pivotY?: string,
      duration?: string,
    |}>>
  |}>,
  enterAnimOff: boolean,
  sharedElements: $ReadOnlyArray<string>,
  containerTransform: boolean,
  underlayColor: ColorValue,
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
