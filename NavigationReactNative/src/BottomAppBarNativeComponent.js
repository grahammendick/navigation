// @flow strict-local

import type {ViewProps} from 'react-native/Libraries/Components/View/ViewPropTypes';
import type {HostComponent} from 'react-native';
import codegenNativeComponent from 'react-native/Libraries/Utilities/codegenNativeComponent';

type NativeProps = $ReadOnly<{|
  ...ViewProps,
  crumb: Int32,
  autoNavigation: boolean,
  barTintColor: ColorValue,
  tintColor: ColorValue,
  fabAlignmentMode: string,
  fabAnimationMode: string,
  fabCradleMargin?: WithDefault<Float, -1>,
  fabCradleRoundedCornerRadius?: WithDefault<Float, -1>,
  fabCradleVerticalOffset?: WithDefault<Float, -1>,
  hideOnScroll: boolean,
  navigationImage: ImageSource,
  navigationTestID: string,
  navigationAccessibilityLabel: string,
  overflowImage: ImageSource,
  overflowTestID: string,
  barHeight: Double,
  onNavigationPress: DirectEventHandler<null>,
|}>;

export default (codegenNativeComponent<NativeProps>(
   'NVBottomAppBar',
): HostComponent<NativeProps>);
