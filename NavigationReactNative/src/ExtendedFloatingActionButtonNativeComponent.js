// @flow strict-local

import type {ViewProps} from 'react-native/Libraries/Components/View/ViewPropTypes';
import type {HostComponent} from 'react-native';
import codegenNativeComponent from 'react-native/Libraries/Utilities/codegenNativeComponent';

type NativeProps = $ReadOnly<{|
  ...ViewProps,
  image: $ReadOnly<{|
    height: Int32,
    width: Int32,
    scale: Int32,
    uri: string,
  |}>,
  text: string,
  gravity: string,
  anchor: string,
  anchorGravity: string,
  contentDescription: string,
  testID: string,
  fabColor: ColorValue,
  fabBackgroundColor: ColorValue,
  rippleColor: ColorValue,
  fabMarginTop?: WithDefault<Int32, 0>,
  fabMarginRight?: WithDefault<Int32, 0>,
  fabMarginBottom?: WithDefault<Int32, 0>,
  fabMarginLeft?: WithDefault<Int32, 0>,
  fabMarginStart?: WithDefault<Int32, 0>,
  fabMarginEnd?: WithDefault<Int32, 0>,
  fabMargin?: WithDefault<Int32, 0>,
  fabFontFamily: string,
  fabFontWeight: string,
  fabFontStyle: string,
  fabFontSize?: WithDefault<Float, -1>,
|}>;

export default (codegenNativeComponent<NativeProps>(
   'NVExtendedFloatingActionButton',
): HostComponent<NativeProps>);
