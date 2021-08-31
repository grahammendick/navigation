import React from 'react';
import { requireNativeComponent, Platform, UIManager, View, StyleSheet } from 'react-native';

class BottomSheet extends React.Component<any, any> {
    private ref: React.RefObject<View>;
    constructor(props) {
        super(props);
        this.state = {activeDetent: props.detent || props.defaultDetent};
        this.ref = React.createRef<View>();
        this.onDetentChanged = this.onDetentChanged.bind(this);
    }
    static defaultProps = {
        defaultDetent: (UIManager as any).getViewManagerConfig('NVBottomSheet').Constants.Detent.collapsed
    }
    static getDerivedStateFromProps({detent}, {activeDetent}) {
        if (detent != null && detent !== activeDetent)
            return {activeDetent: detent};
        return null;
    }
    onDetentChanged({nativeEvent}) {
        var {eventCount: mostRecentEventCount, detent: nativeDetent} = nativeEvent;
        this.ref.current.setNativeProps({mostRecentEventCount});
        var detents = (UIManager as any).getViewManagerConfig('NVBottomSheet').Constants.Detent
        var detent = Object.keys(detents).find(name => detents[name] === nativeDetent)
        this.changeDetent(detent);
    }
    changeDetent(activeDetent) {
        var {detent, onChangeDetent} = this.props;
        if (this.state.activeDetent !== activeDetent) {
            if (detent == null)
                this.setState({activeDetent});
            if (!!onChangeDetent)
                onChangeDetent(activeDetent);
        }
    }
    render() {
        var { height, expandedOffset, peekHeight, children } = this.props
        const detents = (UIManager as any).getViewManagerConfig('NVBottomSheet').Constants.Detent
        return (
            <NVBottomSheet
                ref={this.ref}
                detent={detents[this.state.activeDetent]}
                peekHeight={peekHeight}
                expandedOffset={expandedOffset}
                fitToContents={expandedOffset == null}
                onDetentChanged={this.onDetentChanged}
                style={[
                    styles.bottomSheet,
                    height != null ? { height, top: 0 } : null,
                    expandedOffset != null ? { top: expandedOffset, bottom: 0 } : null,
                    height == null && expandedOffset == null ? { top: 0, bottom: 0} : null
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
