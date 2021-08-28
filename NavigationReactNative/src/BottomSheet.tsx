import { requireNativeComponent, Platform } from 'react-native';

var NVBottomSheet = requireNativeComponent<any>('NVBottomSheet', null);

export default Platform.OS === "android" ? NVBottomSheet : () => null;
