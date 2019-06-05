import { requireNativeComponent, Platform } from 'react-native';

export default Platform.OS === 'ios' ? requireNativeComponent<any>('NVTabBarItem', null) : () => null;
