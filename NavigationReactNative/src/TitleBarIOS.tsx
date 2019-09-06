import React from 'react'
import { requireNativeComponent, Platform, StyleSheet } from 'react-native';

const NVTitleBar = requireNativeComponent<any>('NVTitleBar', null)

const TitleBar = ({style, ...props}) => (
  <NVTitleBar {...props} style={[styles.titleBar, style]}/>
)

const styles = StyleSheet.create({
  titleBar: {
    position: 'absolute'
  }
})

export default Platform.OS === 'ios' ? TitleBar : () => null

