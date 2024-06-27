import React, { useMemo, useContext, useState, useRef, createContext, useEffect } from 'react';
import { requireNativeComponent, Platform, UIManager, StyleSheet } from 'react-native';
import { NavigationContext } from 'navigation-react';
import useNavigated from './useNavigated';
import FragmentContext from './FragmentContext';

const SheetContext = createContext({
    root: true,
    onNavigated: useNavigated,
})

const Sheet = ({detent, defaultDetent = 'collapsed', expandedHeight, expandedOffset, peekHeight, halfExpandedRatio, hideable, skipCollapsed, draggable = true, modal = true, bottom = true, onChangeDetent, children}) => {
    const [sheetState, setSheetState]  = useState({selectedDetent: detent || defaultDetent, mostRecentEventCount: 0, dismissed: (detent || defaultDetent) === 'hidden'})
    const onChildNavigated = useRef<any>();
    const { root, onNavigated } = useContext(SheetContext);
    const sheetHandler = useMemo(() => ({
        root: false,
        onNavigated: handler => onChildNavigated.current = handler,
    }), []);
    const dragging = useRef(false);
    const changeDetent = (selectedDetent) => {
        if (sheetState.selectedDetent !== selectedDetent) {
            if (detent == null)
                setSheetState(prevSheetState => ({...prevSheetState, selectedDetent}));
            if (!!onChangeDetent)
                onChangeDetent(selectedDetent);
        }
    }
    const _stackId = React.useId?.();
    const stackId = useMemo(() => _stackId ? `${_stackId}-${modal}-${bottom}` : undefined, [_stackId, modal, bottom]);
    const ancestorStackIds = useContext(FragmentContext);
    const stackIds = useMemo(() => stackId ? [...ancestorStackIds, stackId] : [], [ancestorStackIds, stackId]);
    const navigationEvent = useContext(NavigationContext);
    const crumb = navigationEvent.stateNavigator.stateContext.crumbs.length;
    onNavigated(() => {
        if (Platform.OS === 'ios' && sheetState.selectedDetent !== 'hidden' && sheetState.dismissed) {
            setSheetState(prevSheetState => ({...prevSheetState, dismissed: false}));
            onChildNavigated.current?.();
        }
    });
    if (detent != null && detent !== sheetState.selectedDetent)
        setSheetState(prevSheetState => ({...prevSheetState, selectedDetent: detent, dismissed: detent === 'hidden' && sheetState.dismissed}));
    const detents = (UIManager as any).getViewManagerConfig('NVBottomSheet').Constants?.Detent;
    const onDetentChanged = ({nativeEvent}) => {
        const {eventCount: mostRecentEventCount, detent: nativeDetent} = nativeEvent;
        const selectedDetent = Platform.OS === 'android'? Object.keys(detents).find(name => detents[name] === nativeDetent) : nativeDetent;
        dragging.current = !selectedDetent;
        if (selectedDetent) {
            changeDetent(selectedDetent);
            setSheetState(prevSheetState => ({...prevSheetState, mostRecentEventCount}));
        }
    }
    let SheetView = Platform.OS === 'ios' || !modal ? NVBottomSheet : NVBottomSheetDialog;
    if (!bottom) SheetView = !modal ? NVSheet : NVDialog;
    if ((Platform.OS === 'ios' || modal || !bottom) && sheetState.dismissed && sheetState.selectedDetent === 'hidden') return null;
    return (
        <FragmentContext.Provider value={stackIds}>
            <SheetContext.Provider value={sheetHandler}>
                <SheetView
                    detent={Platform.OS === 'android' ? '' + detents[sheetState.selectedDetent] : sheetState.selectedDetent}
                    modal={modal}
                    root={root}
                    dismissed={sheetState.dismissed}
                    stackId={stackId}
                    ancestorStackIds={ancestorStackIds}
                    crumb={crumb}
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
                    onDismissed={() => setSheetState(prevSheetState => ({...prevSheetState, dismissed: true}))}
                    style={[
                        styles.bottomSheet,
                        expandedHeight != null ? { height: expandedHeight } : null,
                        expandedOffset != null ? { top: expandedOffset } : null,
                        expandedHeight == null && expandedOffset == null ? { top: 0 } : null,
                        Platform.OS === 'ios' || modal ? { height: undefined, top: undefined } : null, 
                    ]}
                >
                    {children}
                </SheetView>
            </SheetContext.Provider>
        </FragmentContext.Provider>
    )
}

const NVBottomSheet = global.nativeFabricUIManager ? require('./BottomSheetNativeComponent').default : requireNativeComponent('NVBottomSheet');
const NVBottomSheetDialog = global.nativeFabricUIManager ? require('./BottomSheetDialogNativeComponent').default : requireNativeComponent('NVBottomSheetDialog');
const NVDialog = requireNativeComponent('NVDialog');
const NVSheet = requireNativeComponent('NVSheet');

const styles = StyleSheet.create({
    bottomSheet: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        left: 0,
        elevation: 5,
    },
});

export const BottomSheet = props => <Sheet modal={Platform.OS === 'ios'} {...props} bottom />;
export default Sheet;


