import React, { useMemo, useContext, useState, useRef, createContext } from 'react';
import { requireNativeComponent, Platform, UIManager, StyleSheet } from 'react-native';
import { NavigationContext } from 'navigation-react';
import useNavigated from './useNavigated';
import FragmentContext from './FragmentContext';

const SheetContext = createContext({
    root: true,
    onNavigated: useNavigated,
})

const Sheet = ({detent, defaultDetent = 'collapsed', expandedHeight, expandedOffset, peekHeight, halfExpandedRatio, hideable, skipCollapsed, draggable = true, modal = true, bottom = true, sharedElement, onChangeDetent, children}) => {
    const [sheetState, setSheetState]  = useState({selectedDetent: detent || defaultDetent, mostRecentEventCount: 0, dismissed: (detent || defaultDetent) === 'hidden'})
    const onNavigatedChild = useRef<any>(undefined);
    const { root, onNavigated } = useContext(SheetContext);
    const sheetHandler = useMemo(() => ({
        root: false,
        onNavigated: handler => onNavigatedChild.current = handler,
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
    const _fragmentTag = React.useId?.();
    const fragmentTag = useMemo(() => _fragmentTag ? `${_fragmentTag}-${modal}-${bottom}` : undefined, [_fragmentTag, modal, bottom]);
    const ancestorFragmentTags = useContext(FragmentContext);
    const fragmentTags = useMemo(() => fragmentTag ? [...ancestorFragmentTags, fragmentTag] : [], [ancestorFragmentTags, fragmentTag]);
    const navigationEvent = useContext(NavigationContext);
    const crumb = navigationEvent.stateNavigator.stateContext.crumbs.length;
    onNavigated(() => {
        if (Platform.OS === 'ios' && sheetState.selectedDetent !== 'hidden' && sheetState.dismissed) {
            setSheetState(prevSheetState => ({...prevSheetState, dismissed: false}));
            onNavigatedChild.current?.();
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
    if (!bottom && Platform.OS === 'android') SheetView = !modal ? NVSheet : NVDialog;
    if ((Platform.OS === 'ios' || modal || !bottom) && sheetState.dismissed && sheetState.selectedDetent === 'hidden') return null;
    return (
        <FragmentContext.Provider value={fragmentTags}>
            <SheetContext.Provider value={sheetHandler}>
                <SheetView
                    key={Platform.OS === 'ios' ? `${modal}-${bottom}` : undefined}
                    detent={Platform.OS === 'android' ? '' + detents[sheetState.selectedDetent] : sheetState.selectedDetent}
                    modal={modal}
                    fullScreen={!bottom}
                    root={root}
                    dismissed={sheetState.dismissed}
                    fragmentTag={fragmentTag}
                    ancestorFragmentTags={ancestorFragmentTags}
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
                    sharedElement={sharedElement}
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
const NVDialog = global.nativeFabricUIManager ? require('./DialogNativeComponent').default : requireNativeComponent('NVDialog');
const NVSheet = global.nativeFabricUIManager ? require('./SheetNativeComponent').default : requireNativeComponent('NVSheet');

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


