import React from 'react';
import { requireNativeComponent, Platform, StyleSheet } from 'react-native';

var BottomSheet = ({ children }) => (
    <NVBottomSheet style={styles.bottomSheet}>
        {children}
    </NVBottomSheet>
)

var NVBottomSheet = requireNativeComponent<any>('NVBottomSheet', null);

const styles = StyleSheet.create({
    bottomSheet: {
        position: 'absolute',
        top: 0, right: 0,
        bottom: 0, left: 0,
    },
});

export default Platform.OS === "android" ? BottomSheet : () => null;
