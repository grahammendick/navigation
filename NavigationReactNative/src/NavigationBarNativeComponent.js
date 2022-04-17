// @flow strict-local

import type {ViewProps} from 'react-native/Libraries/Components/View/ViewPropTypes';
import type {HostComponent} from 'react-native';
import codegenNativeComponent from 'react-native/Libraries/Utilities/codegenNativeComponent';

type NativeProps = $ReadOnly<{|
  ...ViewProps,
  hidden: boolean,
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
  backTitle: string,
  backTitleOn: boolean,
  backTestID: string,
|}>;

export default (codegenNativeComponent<NativeProps>(
   'NVNavigationBar',
): HostComponent<NativeProps>);
