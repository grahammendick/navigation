// @flow strict-local

import type {ViewProps} from 'react-native/Libraries/Components/View/ViewPropTypes';
import type {HostComponent} from 'react-native';
import codegenNativeComponent from 'react-native/Libraries/Utilities/codegenNativeComponent';

type NativeProps = $ReadOnly<{|
  ...ViewProps,
  tabCount: Int32,
  selectedTab: Int32,
  preventFouc: boolean,
  scrollsToTop: boolean,
  mostRecentEventCount: Int32,
  onTabSelected: DirectEventHandler<$ReadOnly<{|
    tab: Int32,
    eventCount: Int32,
  |}>>,
  onTabSwipeStateChanged: DirectEventHandler<$ReadOnly<{|
    swiping: boolean,
  |}>>,
|}>;

export default (codegenNativeComponent<NativeProps>(
   'NVTabBarPager',
): HostComponent<NativeProps>);
