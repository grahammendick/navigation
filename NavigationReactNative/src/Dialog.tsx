import React, { useMemo, useContext } from 'react';
import { requireNativeComponent, StyleSheet, View } from 'react-native';
import FragmentContext from './FragmentContext';

const Dialog = ({open = false, modal = true, onChangeOpen, children}) => {
    const stackId = React.useId?.();
    const ancestorStackIds = useContext(FragmentContext);
    const stackIds = useMemo(() => stackId ? [...ancestorStackIds, stackId] : [], [ancestorStackIds, stackId]);
    const onShowChanged = ({nativeEvent}) => {
        const {show} = nativeEvent;
        if (show !== open)
            onChangeOpen(show);
    }
    if (!open) return null;
    const RootView = modal ? NVDialogRoot : View;
    const DialogView = modal ? NVDialog : NVSheet;
    return (
        <FragmentContext.Provider value={stackIds}>
            <DialogView
                show={open}
                stackId={stackId}
                ancestorStackIds={ancestorStackIds}
                onShowChanged={onShowChanged}
                style={styles.dialog}>
                <RootView style={styles.dialog} collapsable={false}>
                    {children}
                </RootView>
            </DialogView>
        </FragmentContext.Provider>
    )
}

const NVDialog = requireNativeComponent<any>('NVDialog');
const NVDialogRoot = requireNativeComponent<any>('NVDialogRoot');
const NVSheet = requireNativeComponent<any>('NVSheet');

const styles = StyleSheet.create({
    dialog: {
        position: 'absolute',
        elevation: 5,
        top:0, right: 0, bottom: 0, left: 0
    },
});

export default Dialog;
