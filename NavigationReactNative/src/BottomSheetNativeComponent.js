// @flow strict-local

import type {ViewProps} from 'react-native/Libraries/Components/View/ViewPropTypes';
import type {HostComponent} from 'react-native';
import codegenNativeComponent from 'react-native/Libraries/Utilities/codegenNativeComponent';

type NativeProps = $ReadOnly<{|
  ...ViewProps,
  detent: string,
  fragmentTag: string,
  ancestorFragmentTags: $ReadOnlyArray<string>,
  modal: boolean,
  fullScreen: boolean,
  root: boolean,
  dismissed: boolean,
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
  sharedElement: string,
  onDismissed: DirectEventHandler<null>,
  onDetentChanged: DirectEventHandler<$ReadOnly<{|
    detent: string,
    eventCount: Int32,
  |}>>,
|}>;

export default (codegenNativeComponent<NativeProps>(
   'NVBottomSheet',
   {interfaceOnly: true}
): HostComponent<NativeProps>);
