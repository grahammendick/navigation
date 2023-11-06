import React from 'react';
import { requireNativeComponent, Platform, UIManager, View, StyleSheet } from 'react-native';

class BottomSheet extends React.Component<any, any> {
    private ref: React.RefObject<View>;
    private dragging = false;
    constructor(props) {
        super(props);
        this.state = {selectedDetent: props.detent || props.defaultDetent, mostRecentEventCount: 0};
        this.ref = React.createRef<View>();
        this.onDetentChanged = this.onDetentChanged.bind(this);
    }
    static defaultProps = {
        draggable: true,
        defaultDetent: 'collapsed'
    }
    static getDerivedStateFromProps({detent}, {selectedDetent}) {
        if (detent != null && detent !== selectedDetent)
            return {selectedDetent: detent};
        return null;
    }
    onDetentChanged({nativeEvent}) {
        var {eventCount: mostRecentEventCount, detent: nativeDetent} = nativeEvent;
        var detents = (UIManager as any).getViewManagerConfig('NVBottomSheet').Constants?.Detent;
        var detent = Platform.OS === 'android'? Object.keys(detents).find(name => detents[name] === nativeDetent) : nativeDetent;
        this.dragging = !detent
        if (detent) {
            this.changeDetent(detent);
            this.setState({mostRecentEventCount});
        }
    }
    changeDetent(selectedDetent) {
        var {detent, onChangeDetent} = this.props;
        if (this.state.selectedDetent !== selectedDetent) {
            if (detent == null)
                this.setState({selectedDetent});
            if (!!onChangeDetent)
                onChangeDetent(selectedDetent);
        }
    }
    render() {
        var { expandedHeight, expandedOffset, peekHeight, halfExpandedRatio, hideable, skipCollapsed, draggable, children } = this.props
        var { selectedDetent } = this.state;
        const constants = (UIManager as any).getViewManagerConfig('NVBottomSheet').Constants;
        return (
            <NVBottomSheet
                ref={this.ref}
                detent={Platform.OS === 'android' ? constants.Detent[selectedDetent] : selectedDetent}
                peekHeight={peekHeight}
                expandedOffset={expandedOffset}
                fitToContents={expandedOffset == null}
                halfExpandedRatio={halfExpandedRatio}
                hideable={hideable}
                skipCollapsed={skipCollapsed}
                draggable={draggable}
                sheetHeight={expandedHeight != null ? expandedHeight : 0}
                mostRecentEventCount={this.state.mostRecentEventCount}
                onMoveShouldSetResponderCapture={() => this.dragging}
                onDetentChanged={this.onDetentChanged}
                style={[
                    styles.bottomSheet,
                    expandedHeight != null ? { height: expandedHeight } : null,
                    expandedOffset != null ? { top: expandedOffset } : null,
                    expandedHeight == null && expandedOffset == null ? { top: undefined } : null
                ]}
            >
                {children}
            </NVBottomSheet>
        )
    }
} 

var NVBottomSheet = global.nativeFabricUIManager ? require('./BottomSheetNativeComponent').default : requireNativeComponent('NVBottomSheet');

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
