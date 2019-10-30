import React from 'react'
import { requireNativeComponent, StyleSheet, Platform } from 'react-native';

const NVTitleBar = requireNativeComponent<any>('NVTitleBar', null)

const TitleBar = ({style, ...props}) => (
  <NVTitleBar {...props} style={Platform.OS === 'ios' ? [styles.titleBar, style] : style}/>
)

const styles = StyleSheet.create({
  titleBar: {
    position: 'absolute'
  }
})

export default TitleBar

