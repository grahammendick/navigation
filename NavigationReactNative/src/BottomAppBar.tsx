import React from 'react';
import { Platform, Image, StyleSheet, requireNativeComponent } from 'react-native';

const BottomAppBar = ({ navigationImage, overflowImage, children, style, ...props }: any) => {
    return (
        <NVBottomAppBar
            navigationImage={Image.resolveAssetSource(navigationImage)}
            overflowImage={Image.resolveAssetSource(overflowImage)}
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
