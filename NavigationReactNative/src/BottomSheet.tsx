import React from 'react';
import { requireNativeComponent, Platform, StyleSheet } from 'react-native';

var BottomSheet = ({ height, expandedOffset, peekHeight, children }) => (
    <NVBottomSheet
        peekHeight={peekHeight}
        expandOffset={expandedOffset}
        fitToContents={expandedOffset == null}
        style={[
            styles.bottomSheet,
            height != null ? { height, top: 0 } : null,
            expandedOffset != null ? { top: expandedOffset, bottom: 0 } : null,
            height == null && expandedOffset == null ? { top: 0, bottom: 0} : null
        ]}
    >
        {children}
    </NVBottomSheet>
)

var NVBottomSheet = requireNativeComponent<any>('NVBottomSheet', null);

const styles = StyleSheet.create({
    bottomSheet: {
        position: 'absolute',
        right: 0,
        left: 0,
        elevation: 5
    },
});

export default Platform.OS === "android" ? BottomSheet : () => null;
