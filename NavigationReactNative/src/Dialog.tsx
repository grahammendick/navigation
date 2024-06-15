import React, { useContext, useMemo } from 'react';
import { requireNativeComponent, StyleSheet } from 'react-native';
import FragmentContext from './FragmentContext';

const Dialog = ({ show = false, children }) => {
    const stackId = React.useId?.();
    const ancestorStackIds = useContext(FragmentContext);
    const stackIds = useMemo(() => stackId ? [...ancestorStackIds, stackId] : [], [ancestorStackIds, stackId]);
    if (!show) return null;
    return (
        <FragmentContext.Provider value={stackIds}>
            <NVDialog
                stackId={stackId}
                ancestorStackIds={ancestorStackIds}
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
        top: 0,
        bottom: 0,
        right: 0,
        left: 0,
    },
});

export default Dialog;