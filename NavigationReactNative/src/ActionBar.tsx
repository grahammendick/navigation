import React from 'react';
import { requireNativeComponent, Platform, StyleSheet } from 'react-native';

const ActionBar = ({children}) => (
    Platform.OS == 'android' ? <NVActionBar style={styles.actionView}>{children}</NVActionBar> : null
)

const NVActionBar = requireNativeComponent<any>('NVActionBar', null)

const styles = StyleSheet.create({
    actionView: {
        flex: 1,
    },
});

export default ActionBar;
