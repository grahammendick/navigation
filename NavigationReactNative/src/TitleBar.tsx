import React, {useState} from 'react'
import { requireNativeComponent, StyleSheet, Platform } from 'react-native';

const TitleBar = ({style, ...props}) => {
  const [bounds, setBounds] = useState({});
  return (
    <NVTitleBar
      {...props}
      onChangeBounds={({nativeEvent: {width, height}}) => {setBounds({width, height})}}
      style={[Platform.OS === 'ios' && styles.titleBar, style, bounds]}
    />
  )
};

const NVTitleBar = global.nativeFabricUIManager ? require('./TitleBarNativeComponent').default : requireNativeComponent('NVTitleBar');

const styles = StyleSheet.create({
  titleBar: {
    position: 'absolute'
  }
})

export default TitleBar

