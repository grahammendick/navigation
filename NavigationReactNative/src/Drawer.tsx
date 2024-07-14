import React, {useState} from 'react';
import { requireNativeComponent, StyleSheet } from 'react-native';

const Drawer = ({view, open = false, onChangeOpen, children}) => {
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
        setMostRecentEventCount(mostRecentEventCount);
    }
    return (
        <NVDrawerLayout
            open={open}
            mostRecentEventCount={mostRecentEventCount}
            onChangeOpen={onChangeShow}
            style={styles.drawer}>
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
