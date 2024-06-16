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
                show={show}
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
        elevation: 5
    },
});

export default Dialog;
