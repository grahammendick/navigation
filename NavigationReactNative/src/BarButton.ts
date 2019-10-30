import { requireNativeComponent, Platform } from 'react-native';

export default Platform.OS === 'ios' ? requireNativeComponent('NVBarButton', null) : () => null;
