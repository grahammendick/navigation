// @flow strict-local

import type {ViewProps} from 'react-native/Libraries/Components/View/ViewPropTypes';
import type {HostComponent} from 'react-native';
import codegenNativeComponent from 'react-native/Libraries/Utilities/codegenNativeComponent';

type NativeProps = $ReadOnly<{|
  ...ViewProps,
  tabCount: Int32,
  selectedTab: Int32,
  preventFouc: boolean,
  barTintColor: ColorValue,
  selectedTintColor: ColorValue,
  unselectedTintColor: ColorValue,
  badgeColor: ColorValue,
  shadowColor: ColorValue,
  scrollsToTop: boolean,
  fontFamily: string,
  fontWeight: string,
  fontStyle: string,
  fontSize?: WithDefault<Float, -1>,
  mostRecentEventCount: Int32,
  onTabSelected: DirectEventHandler<$ReadOnly<{|
    tab: Int32,
    eventCount: Int32,
  |}>>
|}>;

export default (codegenNativeComponent<NativeProps>(
   'NVTabBar',
): HostComponent<NativeProps>);
