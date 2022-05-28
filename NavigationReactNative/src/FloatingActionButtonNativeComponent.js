// @flow strict-local

import type {ViewProps} from 'react-native/Libraries/Components/View/ViewPropTypes';
import type {HostComponent} from 'react-native';
import codegenNativeComponent from 'react-native/Libraries/Utilities/codegenNativeComponent';

type NativeProps = $ReadOnly<{|
  ...ViewProps,
  image: ImageSource,
  gravity: string,
  anchorGravity: string,
  size: Int32,
  contentDescription: string,
  testID: string,
  /* fabColor: ColorValue,
  fabBackgroundColor: ColorValue,
  fabMarginTop: Int32,
  fabMarginRight: Int32,
  fabMarginBottom: Int32,
  fabMarginLeft: Int32,
  fabMarginStart: Int32,
  fabMarginEnd: Int32,
  fabElevation: Int32, */
|}>;

export default (codegenNativeComponent<NativeProps>(
   'NVFloatingActionButton',
): HostComponent<NativeProps>);
