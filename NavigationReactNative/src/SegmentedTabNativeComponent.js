// @flow strict-local

import type {ViewProps} from 'react-native/Libraries/Components/View/ViewPropTypes';
import type {HostComponent} from 'react-native';
import codegenNativeComponent from 'react-native/Libraries/Utilities/codegenNativeComponent';

type NativeProps = $ReadOnly<{|
  ...ViewProps,
  backgroundColor: ColorValue,
  selectedTintColor: ColorValue,
  unselectedTintColor: ColorValue,
  titles: $ReadOnlyArray<string>,
  testIDs: $ReadOnlyArray<string>,
  fontFamily: string,
  fontWeight: string,
  fontStyle: string,
  fontSize?: WithDefault<Float, -1>,
|}>;

export default (codegenNativeComponent<NativeProps>(
   'NVSegmentedTab',
): HostComponent<NativeProps>);
