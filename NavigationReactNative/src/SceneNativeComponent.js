// @flow strict-local

import type {ViewProps} from 'react-native/Libraries/Components/View/ViewPropTypes';
import type {HostComponent} from 'react-native';
import codegenNativeComponent from 'react-native/Libraries/Utilities/codegenNativeComponent';

type NativeProps = $ReadOnly<{|
  ...ViewProps,
  sceneKey: string,
  crumb: Int32,
  title: string,
  enterAnim: string,
  exitAnim: string,
  enterTrans: $ReadOnly<{|
    type: string,
    axis?: string,
    fromX?: string,
    fromY?: string,
    from?: string,
    pivotX?: string,
    pivotY?: string,
    duration?: string,
    items: $ReadOnlyArray<$ReadOnly<{|
      type: string,
      fromX?: string,
      fromY?: string,
      from?: string,
      pivotX?: string,
      pivotY?: string,
      duration?: string,
    |}>>
  |}>,
  exitTrans: $ReadOnly<{|
    type: string,
    axis?: string,
    toX?: string,
    toY?: string,
    to?: string,
    pivotX?: string,
    pivotY?: string,
    duration?: string,
    items: $ReadOnlyArray<$ReadOnly<{|
      type: string,
      toX?: string,
      toY?: string,
      to?: string,
      pivotX?: string,
      pivotY?: string,
      duration?: string,
    |}>>
  |}>,
  hidesTabBar: boolean,
  landscape: boolean,
  onPopped: DirectEventHandler<null>
|}>;

export default (codegenNativeComponent<NativeProps>(
   'NVScene',
): HostComponent<NativeProps>);
