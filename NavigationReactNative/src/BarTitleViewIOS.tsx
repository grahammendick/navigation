import React from 'react'
import { requireNativeComponent, Platform, StyleSheet } from 'react-native';

const NVBarTitleView = requireNativeComponent<any>('NVBarTitleView', null)

const BarTitleView = ({style, ...props}) => (
  <NVBarTitleView {...props} style={[styles.barTitleView, style]}/>
)

const styles = StyleSheet.create({
  barTitleView: {
    position: 'absolute'
  }
})

export default Platform.OS === 'ios' ? BarTitleView : () => null

