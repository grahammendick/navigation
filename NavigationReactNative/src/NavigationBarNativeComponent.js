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
  titleFontSize: string,
  largeTitleFontFamily: string,
  largeTitleFontWeight: string,
  largeTitleFontStyle: string,
  largeTitleFontSize: string,
  backFontFamily: string,
  backFontWeight: string,
  backFontStyle: string,
  backFontSize: string,
  barTintColor: ColorValue,
  largeBarTintColor: ColorValue,
  tintColor: ColorValue,
  titleColor: ColorValue,
  largeTitleColor: ColorValue,
  backTitle: string,
  backTestID: string,
|}>;

export default (codegenNativeComponent<NativeProps>(
   'NVNavigationBar',
): HostComponent<NativeProps>);
