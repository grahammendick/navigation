import React from 'react';
import { requireNativeComponent, Platform, UIManager, View, StyleSheet } from 'react-native';

class BottomSheet extends React.Component<any, any> {
    private ref: React.RefObject<View>;
    private dragging = false;
    constructor(props) {
        super(props);
        this.state = {selectedDetent: props.detent || props.defaultDetent};
        this.ref = React.createRef<View>();
        this.onDetentChanged = this.onDetentChanged.bind(this);
    }
    static defaultProps = {
        defaultDetent: (UIManager as any).getViewManagerConfig('NVBottomSheet').Constants.Detent.collapsed
    }
    static getDerivedStateFromProps({detent}, {selectedDetent}) {
        if (detent != null && detent !== selectedDetent)
            return {selectedDetent: detent};
        return null;
    }
    onDetentChanged({nativeEvent}) {
        var {eventCount: mostRecentEventCount, detent: nativeDetent} = nativeEvent;
        this.ref.current.setNativeProps({mostRecentEventCount});
        var detents = (UIManager as any).getViewManagerConfig('NVBottomSheet').Constants.Detent
        var detent = Object.keys(detents).find(name => detents[name] === nativeDetent)
        this.dragging = !detent
        if (detent) this.changeDetent(detent);
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
        var { expandedHeight, expandedOffset, peekHeight, halfExpandedRatio, hideable, skipCollapsed, children } = this.props
        const detents = (UIManager as any).getViewManagerConfig('NVBottomSheet').Constants.Detent
        return (
            <NVBottomSheet
                ref={this.ref}
                detent={detents[this.state.selectedDetent]}
                peekHeight={peekHeight}
                expandedOffset={expandedOffset}
                fitToContents={expandedOffset == null}
                halfExpandedRatio={halfExpandedRatio}
                hideable={hideable}
                skipCollapsed={skipCollapsed}
                onMoveShouldSetResponderCapture={() => this.dragging}
                onDetentChanged={this.onDetentChanged}
                style={[
                    styles.bottomSheet,
                    expandedHeight != null ? { height: expandedHeight, top: 0 } : null,
                    expandedOffset != null ? { top: expandedOffset, bottom: 0 } : null,
                    expandedHeight == null && expandedOffset == null ? { top: 0, bottom: 0} : null
                ]}
            >
                {children}
            </NVBottomSheet>
        )
    }
} 

var NVBottomSheet = requireNativeComponent<any>('NVBottomSheet', null);

const styles = StyleSheet.create({
    bottomSheet: {
        position: 'absolute',
        right: 0,
        left: 0,
        elevation: 5
    },
});

export default Platform.OS === "android" ? BottomSheet : () => null;
