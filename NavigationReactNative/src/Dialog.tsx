import React, { useMemo, useContext } from 'react';
import { requireNativeComponent, StyleSheet } from 'react-native';
import FragmentContext from './FragmentContext';

const Dialog = ({open = false, onChangeOpen, children}) => {
    const stackId = React.useId?.();
    const ancestorStackIds = useContext(FragmentContext);
    const stackIds = useMemo(() => stackId ? [...ancestorStackIds, stackId] : [], [ancestorStackIds, stackId]);
    const onShowChanged = ({nativeEvent}) => {
        const {show} = nativeEvent;
        if (show !== open)
            onChangeOpen(show);
    }
    if (!open) return null;
    return (
        <FragmentContext.Provider value={stackIds}>
            <NVDialog
                show={open}
                stackId={stackId}
                ancestorStackIds={ancestorStackIds}
                onShowChanged={onShowChanged}
                style={styles.dialog}>
                {children}
            </NVDialog>
        </FragmentContext.Provider>
    )
}

const NVDialog = requireNativeComponent<any>('NVSheet');

const styles = StyleSheet.create({
    dialog: {
        position: 'absolute',
        elevation: 5,
        top:0, right: 0, bottom: 0, left: 0
    },
});

export default Dialog;
