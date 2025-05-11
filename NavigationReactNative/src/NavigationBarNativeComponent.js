// @flow strict-local

import type {ViewProps} from 'react-native/Libraries/Components/View/ViewPropTypes';
import type {HostComponent} from 'react-native';
import codegenNativeComponent from 'react-native/Libraries/Utilities/codegenNativeComponent';

type NativeProps = $ReadOnly<{|
  ...ViewProps,
  crumb: Int32,
  isHidden: boolean,
  largeTitle: boolean,
  title: string,
  titleFontFamily: string,
  titleFontWeight: string,
  titleFontStyle: string,
  titleFontSize?: WithDefault<Float, -1>,
  largeTitleFontFamily: string,
  largeTitleFontWeight: string,
  largeTitleFontStyle: string,
  largeTitleFontSize?: WithDefault<Float, -1>,
  backFontFamily: string,
  backFontWeight: string,
  backFontStyle: string,
  backFontSize?: WithDefault<Float, -1>,
  barTintColor: ColorValue,
  largeBarTintColor: ColorValue,
  tintColor: ColorValue,
  titleColor: ColorValue,
  largeTitleColor: ColorValue,
  shadowColor: ColorValue,
  backTitle: string,
  backTitleOn: boolean,
  backImage: $ReadOnly<{|
    height: Int32,
    width: Int32,
    scale: Int32,
    uri: string,
  |}>,
  backTestID: string,
  barHeight: Double,
  includeInset: boolean,
  overlap: Int32,
  onOffsetChanged: DirectEventHandler<$ReadOnly<{|
    offset: Double,
    totalScrollRange: Double,
  |}>>,
|}>;

export default (codegenNativeComponent<NativeProps>(
   'NVNavigationBar',
   {interfaceOnly: true}
): HostComponent<NativeProps>);
