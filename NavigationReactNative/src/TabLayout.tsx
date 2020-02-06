import React from 'react'
import { requireNativeComponent, Platform } from 'react-native';

const TabLayout = ({style = {height: 48}, ...props}) => (
  <NVTabLayout {...props} style={{height: style.height}}/>
)

var NVTabLayout = requireNativeComponent<any>('NVTabLayout', null);

export default Platform.OS === "android" ? TabLayout : () => null;

