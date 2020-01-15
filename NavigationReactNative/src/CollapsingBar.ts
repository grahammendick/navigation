import { requireNativeComponent, Platform } from 'react-native';

export default Platform.OS === "android" ? requireNativeComponent('NVCollapsingBar', null) : () => null;
