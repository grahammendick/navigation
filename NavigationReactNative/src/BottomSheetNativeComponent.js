// @flow strict-local

import type {ViewProps} from 'react-native/Libraries/Components/View/ViewPropTypes';
import type {HostComponent} from 'react-native';
import codegenNativeComponent from 'react-native/Libraries/Utilities/codegenNativeComponent';

type NativeProps = $ReadOnly<{|
  ...ViewProps,
  detent: Int32,
  mostRecentEventCount: Int32,
  peekHeight: Int32,
  expandedOffset: Int32,
  fitToContents: boolean,
  halfExpandedRatio?: WithDefault<Float, -1>,
  hideable: boolean,
  skipCollapsed: boolean,
  draggable: boolean,
  sheetHeight: Double,
  onDetentChanged: DirectEventHandler<$ReadOnly<{|
    detent: Int32,
    eventCount: Int32,
  |}>>,
|}>;

export default (codegenNativeComponent<NativeProps>(
   'NVBottomSheet',
): HostComponent<NativeProps>);
