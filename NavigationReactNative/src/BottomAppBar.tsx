import React, { forwardRef } from 'react';
import { Platform, Image, StyleSheet, requireNativeComponent } from 'react-native';

const BottomAppBar = forwardRef(({ navigationImage, overflowImage, children, style, ...props }: any, ref) => {
    if (Platform.OS === 'ios') return null; 
    return (
        <NVBottomAppBar
            ref={ref}
            navigationImage={Image.resolveAssetSource(navigationImage)}
            overflowImage={Image.resolveAssetSource(overflowImage)}
            style={styles.toolbar}
            {...props}>
            {children}
        </NVBottomAppBar>
    );
})

var NVBottomAppBar = requireNativeComponent<any>('NVBottomAppBar', null);

const styles = StyleSheet.create({
    toolbar: {
        height: 56
    },
});

export default BottomAppBar;
