import React, { useMemo, useState } from 'react';
import { requireNativeComponent, StyleSheet } from 'react-native';
import FragmentContext from './FragmentContext';

const Dialog = ({open = false, onChangeOpen, children}) => {
    const stackId = React.useId?.();
    const stackIds = useMemo(() => stackId ? [stackId] : [], [stackId]);
    const [mostRecentEventCount, setMostRecentEventCount] = useState(0);
    const onShowChanged = ({nativeEvent}) => {
        const {eventCount: mostRecentEventCount, show} = nativeEvent;
        if (show !== open)
            onChangeOpen(show);
        setMostRecentEventCount(mostRecentEventCount);
    }
    if (!open) return null;
    return (
        <FragmentContext.Provider value={stackIds}>
            <NVDialog
                show={open}
                stackId={stackId}
                mostRecentEventCount={mostRecentEventCount}
                onShowChanged={onShowChanged}
                style={styles.dialog}>
                {children}
            </NVDialog>
        </FragmentContext.Provider>
    )
}

const NVDialog = requireNativeComponent<any>('NVDialog');

const styles = StyleSheet.create({
    dialog: {
        position: 'absolute',
        elevation: 5
    },
});

export default Dialog;
