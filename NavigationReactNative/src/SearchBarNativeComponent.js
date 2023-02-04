// @flow strict-local

import type {ViewProps} from 'react-native/Libraries/Components/View/ViewPropTypes';
import type {HostComponent} from 'react-native';
import codegenNativeComponent from 'react-native/Libraries/Utilities/codegenNativeComponent';

type NativeProps = $ReadOnly<{|
  ...ViewProps,
  obscureBackground: boolean,
  hideNavigationBar: boolean,
  hideWhenScrolling: boolean,
  autoCapitalize: string,
  placeholder: string,
  text: string,
  active: boolean,
  mostRecentEventCount: Int32,
  mostRecentActiveEventCount: Int32,
  mostRecentButtonEventCount: Int32,
  barTintColor: ColorValue,
  bottomBar: boolean,
  scopeButton: Int32,
  scopeButtons: $ReadOnlyArray<string>,
  onChangeText: DirectEventHandler<$ReadOnly<{|
    text: string,
    eventCount: Int32,
  |}>>,
  onChangeScopeButton?: DirectEventHandler<$ReadOnly<{|
    scopeButton: Int32,
    eventCount: Int32,
  |}>>,
  onChangeActive: DirectEventHandler<$ReadOnly<{|
    active: boolean,
    eventCount: Int32,
  |}>>,
|}>;

export default (codegenNativeComponent<NativeProps>(
   'NVSearchBar',
   {interfaceOnly: true}
): HostComponent<NativeProps>);
