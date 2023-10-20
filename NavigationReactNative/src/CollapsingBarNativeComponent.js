// @flow strict-local

import type {ViewProps} from 'react-native/Libraries/Components/View/ViewPropTypes';
import type {HostComponent} from 'react-native';
import codegenNativeComponent from 'react-native/Libraries/Utilities/codegenNativeComponent';

type NativeProps = $ReadOnly<{|
  ...ViewProps,
  title: string,
  titleFontFamily: string,
  titleFontWeight: string,
  titleFontStyle: string,
  titleFontSize?: WithDefault<Float, -1>,
  largeTitleFontFamily: string,
  largeTitleFontWeight: string,
  largeTitleFontStyle: string,
  largeTitleFontSize?: WithDefault<Float, -1>,
  titleEnabled: boolean,
  titleCollapseMode: string,
  contentScrimColor: ColorValue,
  collapsedTitleColor: ColorValue,
  expandedTitleColor: ColorValue,
|}>;

export default (codegenNativeComponent<NativeProps>(
   'NVCollapsingBar',
): HostComponent<NativeProps>);
