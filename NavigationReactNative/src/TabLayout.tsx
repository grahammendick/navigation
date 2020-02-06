import React from 'react'
import { requireNativeComponent, Platform } from 'react-native';

const TabLayout: any = ({style = {height: 48}, barTintColor, ...props}) => (
  <NVTabLayout {...props} style={{height: style.height, backgroundColor: barTintColor}}/>
)

var NVTabLayout = requireNativeComponent<any>('NVTabLayout', null);

export default Platform.OS === "android" ? TabLayout : () => null;

