// @flow strict-local

import type {ViewProps} from 'react-native/Libraries/Components/View/ViewPropTypes';
import type {HostComponent} from 'react-native';
import codegenNativeComponent from 'react-native/Libraries/Utilities/codegenNativeComponent';

type NativeProps = $ReadOnly<{|
  ...ViewProps,
  detent: string,
  mostRecentEventCount: Int32,
  peekHeight: Int32,
  expandedHeight: Int32,
  expandedOffset: Int32,
  fitToContents: boolean,
  halfExpandedRatio?: WithDefault<Float, -1>,
  hideable: boolean,
  skipCollapsed: boolean,
  draggable: boolean,
  sheetHeight: Double,
  onDismissed: DirectEventHandler<null>,
  onDetentChanged: DirectEventHandler<$ReadOnly<{|
    detent: string,
    eventCount: Int32,
  |}>>,
|}>;

export default (codegenNativeComponent<NativeProps>(
   'NVBottomSheetDialog',
   {interfaceOnly: true}
): HostComponent<NativeProps>);
