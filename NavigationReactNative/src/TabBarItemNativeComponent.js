// @flow strict-local

import type {ViewProps} from 'react-native/Libraries/Components/View/ViewPropTypes';
import type {HostComponent} from 'react-native';
import codegenNativeComponent from 'react-native/Libraries/Utilities/codegenNativeComponent';

type NativeProps = $ReadOnly<{|
  ...ViewProps,
  title: string,
  fontFamily: string,
  fontWeight: string,
  fontStyle: string,
  fontSize?: WithDefault<Float, -1>,
  testID: string,
  badge: string,
  badgeColor: ColorValue,
  image: $ReadOnly<{|
    height: Int32,
    width: Int32,
    scale: Int32,
    uri: string,
  |}>,
  systemItem: string,
  onPress: BubblingEventHandler<null>
|}>;

export default (codegenNativeComponent<NativeProps>(
   'NVTabBarItem',
   {interfaceOnly: true}
): HostComponent<NativeProps>);
