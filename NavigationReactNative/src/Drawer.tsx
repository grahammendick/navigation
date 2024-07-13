import React from 'react';
import { requireNativeComponent, StyleSheet } from 'react-native';

const Drawer = ({ view, children }) => {
    return (
        <NVDrawerLayout style={styles.drawer}>
            {children}
            <NVDrawer style={[styles.view, {width: 300}]}>
                {view}
            </NVDrawer>
        </NVDrawerLayout>
    );
};

const NVDrawerLayout = requireNativeComponent<any>('NVDrawerLayout');
const NVDrawer = requireNativeComponent<any>('NVDrawer');

const styles = StyleSheet.create({
    drawer: {
        flex: 1,
    },
    view: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        elevation: 5,
        backgroundColor: 'transparent',
    }
});

export default Drawer;
