import React, {useRef, useState} from 'react';
import { requireNativeComponent, Platform, UIManager, StyleSheet } from 'react-native';
import useUnloaded from './useUnloaded';

const BottomSheet = ({detent, defaultDetent = 'collapsed', expandedHeight, expandedOffset, peekHeight, halfExpandedRatio, hideable, skipCollapsed, draggable = true, modal, onChangeDetent, children}) => {
    const [sheetState, setSheetState]  = useState({selectedDetent: detent || defaultDetent, mostRecentEventCount: 0, dismissed: (detent || defaultDetent) === 'hidden'})
    const dragging = useRef(false);
    const changeDetent = (selectedDetent) => {
        if (sheetState.selectedDetent !== selectedDetent) {
            if (detent == null)
                setSheetState({...sheetState, selectedDetent});
            if (!!onChangeDetent)
                onChangeDetent(selectedDetent);
        }
    }
    useUnloaded(() => {
        setSheetState({...sheetState, dismissed: true});
    });
    if (Platform.OS === 'ios' && +Platform.Version < 15) return null;
    if (detent != null && detent !== sheetState.selectedDetent)
        setSheetState({...sheetState, selectedDetent: detent, dismissed: detent === 'hidden' && sheetState.dismissed});
    if (sheetState.dismissed) return null;
    const detents = (UIManager as any).getViewManagerConfig('NVBottomSheet').Constants?.Detent;
    const onDetentChanged = ({nativeEvent}) => {
        const {eventCount: mostRecentEventCount, detent: nativeDetent} = nativeEvent;
        const selectedDetent = Platform.OS === 'android'? Object.keys(detents).find(name => detents[name] === nativeDetent) : nativeDetent;
        dragging.current = !selectedDetent;
        if (detent) {
            changeDetent(selectedDetent);
            setSheetState({...sheetState, mostRecentEventCount});
        }
    }
    const BottomSheetView = Platform.OS === 'ios' || !modal ? NVBottomSheet : NVBottomSheetDialog;
    return (
        <BottomSheetView
            detent={Platform.OS === 'android' ? '' + detents[sheetState.selectedDetent] : sheetState.selectedDetent}
            modal={modal}
            peekHeight={peekHeight}
            expandedHeight={expandedHeight}
            expandedOffset={expandedOffset}
            fitToContents={expandedOffset == null && (!halfExpandedRatio || !!expandedHeight)}
            halfExpandedRatio={halfExpandedRatio}
            hideable={hideable}
            skipCollapsed={skipCollapsed}
            draggable={draggable}
            sheetHeight={expandedHeight != null ? expandedHeight : 0}
            mostRecentEventCount={sheetState.mostRecentEventCount}
            onMoveShouldSetResponderCapture={() => dragging.current}
            onDetentChanged={onDetentChanged}
            onDismissed={() => setSheetState({...sheetState, dismissed: true})}
            style={[
                styles.bottomSheet,
                expandedHeight != null ? { height: expandedHeight } : null,
                expandedOffset != null ? { top: expandedOffset } : null,
                expandedHeight == null && expandedOffset == null ? { top: 0 } : null,
                Platform.OS === 'ios' || modal ? { height: undefined, top: undefined } : null, 
            ]}
        >
            {children}
        </BottomSheetView>
    )
}

var NVBottomSheet = global.nativeFabricUIManager ? require('./BottomSheetNativeComponent').default : requireNativeComponent('NVBottomSheet');
var NVBottomSheetDialog = global.nativeFabricUIManager ? require('./BottomSheetDialogNativeComponent').default : requireNativeComponent('NVBottomSheetDialog');

const styles = StyleSheet.create({
    bottomSheet: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        left: 0,
        elevation: 5
    },
});

export default BottomSheet;
