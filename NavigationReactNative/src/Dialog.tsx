import React from 'react';
import { requireNativeComponent, StyleSheet } from 'react-native';

const Dialog = ({ show = false, children }) => {
    if (!show) return null;
    return (
        <NVDialog style={styles.dialog}>
            {children}
        </NVDialog>
    )
}

const NVDialog = requireNativeComponent<any>('NVDialog');

const styles = StyleSheet.create({
    dialog: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        right: 0,
        left: 0,
    },
});

export default Dialog;