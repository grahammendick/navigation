// @flow strict-local

import type {ViewProps} from 'react-native/Libraries/Components/View/ViewPropTypes';
import type {HostComponent} from 'react-native';
import codegenNativeComponent from 'react-native/Libraries/Utilities/codegenNativeComponent';

type NativeProps = $ReadOnly<{|
  ...ViewProps,
  placeholder: string,
  text: string,
  fontFamily: string,
  fontWeight: string,
  fontStyle: string,
  fontSize?: WithDefault<Float, -1>,
  active: boolean,
  mostRecentEventCount: Int32,
  mostRecentActiveEventCount: Int32,
  barTintColor: ColorValue,
  onChangeText: DirectEventHandler<$ReadOnly<{|
    text: string,
    eventCount: Int32,
  |}>>,
  onChangeActive: DirectEventHandler<$ReadOnly<{|
    active: boolean,
    eventCount: Int32,
  |}>>,
|}>;

export default (codegenNativeComponent<NativeProps>(
   'NVSearchResults',
): HostComponent<NativeProps>);
