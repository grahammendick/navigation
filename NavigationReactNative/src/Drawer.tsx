import React, { useState } from 'react';
import { requireNativeComponent, StyleSheet, Platform } from 'react-native';
import BackButton from './BackButton';

const Drawer = ({view, open, fromRight = false, onChangeOpen, onOpen, onClose, children}) => {
    const [show, setShow] = useState(false);
    const [mostRecentEventCount, setMostRecentEventCount] = useState(0);
    if (open != null && show !== open) setShow(open);
    const onChangeShow = ({nativeEvent}) => {
        const {eventCount: mostRecentEventCount, open: newOpen} = nativeEvent;
        if (show !== newOpen) {
            if (open == null)
                setShow(newOpen);
            if (!!onChangeOpen)
                onChangeOpen(newOpen);
        }
        if (newOpen) onOpen?.();
        else onClose?.();
        setMostRecentEventCount(mostRecentEventCount);
    }
    if (Platform.OS === 'ios') return children;
    return (
        <>
            <BackButton onPress={() => {
                if (show) {
                    if (open == null)
                        setShow(false);
                    if (!!onChangeOpen)
                        onChangeOpen(false);
                    return true;
                }
                return false;
            }} />
            <NVDrawerLayout
                open={show}
                fromRight={fromRight}
                mostRecentEventCount={mostRecentEventCount}
                onChangeOpen={onChangeShow}
                style={styles.drawer}>
                {children}
                <NVDrawer fromRight={fromRight} style={[styles.view]}>
                    {view}
                </NVDrawer>
            </NVDrawerLayout>
        </>
    );
};

const NVDrawerLayout = global.nativeFabricUIManager ? require('./DrawerLayoutNativeComponent').default : requireNativeComponent('NVDrawerLayout');
const NVDrawer = global.nativeFabricUIManager ? require('./DrawerNativeComponent').default : requireNativeComponent('NVDrawer');

const styles = StyleSheet.create({
    drawer: {
        flex: 1,
    },
    view: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 64,
        elevation: 5,
        backgroundColor: 'transparent',
    }
});

export default Drawer;
