import React from 'react'
import { requireNativeComponent, Platform, StyleSheet } from 'react-native';

const ActionBar = props => (
    Platform.OS == 'android' ? (
        <NVActionBar
            {...props}
            style={styles.actionView} />
     ) : null
);

const NVActionBar = global.nativeFabricUIManager ? require('./ActionBarNativeComponent').default : requireNativeComponent('NVActionBar');

const styles = StyleSheet.create({
    actionView: {
        flex: 1,
    },
});

export default ActionBar;
