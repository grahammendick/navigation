import React from 'react';
import { Platform, Image, StyleSheet, requireNativeComponent } from 'react-native';

const Toolbar = ({ bottom = true, logo, navigationImage, overflowImage, children, style, ...props }: any) => {
    var Toolbar = !bottom ? NVToolbar : NVToolbarBottom;
    return (
        <Toolbar
            logo={Image.resolveAssetSource(logo)}
            navigationImage={Image.resolveAssetSource(navigationImage)}
            overflowImage={Image.resolveAssetSource(overflowImage)}            
            style={styles.toolbar}
            {...props}>
            {children}
        </Toolbar>
    );
}

var NVToolbar = requireNativeComponent<any>('NVToolbar', null);
var NVToolbarBottom = requireNativeComponent<any>('NVToolbarBottom', null);

const styles = StyleSheet.create({
    toolbar: {
        height: 56
    },
});

export default Platform.OS === 'android' ? Toolbar : null;
