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
  largeTitleFontFamily: string,
  largeTitleFontWeight: string,
  largeTitleFontStyle: string,
  titleEnabled: boolean,
  contentScrimColor: ColorValue,
  collapsedTitleColor: ColorValue,
  expandedTitleColor: ColorValue,
|}>;

export default (codegenNativeComponent<NativeProps>(
   'NVCollapsingBar',
): HostComponent<NativeProps>);
