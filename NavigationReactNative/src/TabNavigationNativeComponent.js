// @flow strict-local

import type {ViewProps} from 'react-native/Libraries/Components/View/ViewPropTypes';
import type {HostComponent} from 'react-native';
import codegenNativeComponent from 'react-native/Libraries/Utilities/codegenNativeComponent';

type NativeProps = $ReadOnly<{|
  ...ViewProps,
  selectedTintColor: ColorValue,
  unselectedTintColor: ColorValue,
  bottomTabs: boolean,
  itemHorizontalTranslation: boolean,
  labelVisibilityMode: Int32,
  activeIndicatorColor: ColorValue,
  rippleColor: ColorValue,
|}>;

export default (codegenNativeComponent<NativeProps>(
   'NVTabNavigation',
): HostComponent<NativeProps>);
