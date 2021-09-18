import React from 'react';
import { Platform, StyleSheet, requireNativeComponent } from 'react-native';

const BottomAppBar = ({ children, style, ...props }: any) => {
    return (
        <NVBottomAppBar
            style={styles.toolbar}
            {...props}>
            {children}
        </NVBottomAppBar>
    );
}

var NVBottomAppBar = requireNativeComponent<any>('NVBottomAppBar', null);

const styles = StyleSheet.create({
    toolbar: {
        height: 56
    },
});

export default Platform.OS === 'android' ? BottomAppBar : null;
