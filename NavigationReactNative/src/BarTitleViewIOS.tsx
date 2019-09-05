import React from 'react'
import { requireNativeComponent, Platform, StyleSheet } from 'react-native';

const NVBarTitleView = requireNativeComponent<any>('NVBarTitleView', null)

class BarTitleView extends React.Component {
  render() {
    const { style } = this.props as any
    return (
      <NVBarTitleView 
        {...this.props}
        style={[styles.barTitleView, style]}>
        {this.props.children}
      </NVBarTitleView>
    )
  }
}

const styles = StyleSheet.create({
  barTitleView: {
    position: 'absolute'
  }
})

export default Platform.OS === 'ios' ? BarTitleView : () => null

