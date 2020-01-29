import React from 'react';
import { requireNativeComponent, Platform, StyleSheet, UIManager, View } from 'react-native';

class SearchBar extends React.Component<any, any> {
    private ref: React.RefObject<View>;
    constructor(props) {
        super(props);
        this.state = {show: false, top: 56};
        this.ref = React.createRef<View>();
        this.onChangeText = this.onChangeText.bind(this);
    }
    static defaultProps = {
        obscureBackground: true,
        hideNavigationBar: true,
        hideWhenScrolling: false,
        autoCapitalize: 'sentences',
    }
    onChangeText({nativeEvent}) {
        var {onChangeText} = this.props as any;
        var {eventCount: mostRecentEventCount, text} = nativeEvent;
        this.ref.current.setNativeProps({mostRecentEventCount});
        if (onChangeText)
            onChangeText(text)

    }
    render() {
        var {show, top} = this.state;
        var {autoCapitalize, children, ...props} = this.props;
        var constants = (UIManager as any).getViewManagerConfig('NVSearchBar').Constants;
        autoCapitalize = Platform.OS === 'android' ? constants.AutoCapitalize[autoCapitalize] : autoCapitalize;
        var showStyle = Platform.OS == 'android' && {top, right: 0, bottom: 0, left: 0, zIndex: 58}
        return (
            <NVSearchBar
                {...props}
                ref={this.ref}
                autoCapitalize={autoCapitalize}
                onChangeText={this.onChangeText}
                onExpand={({nativeEvent: {top}}) => this.setState({show: true, top})}
                onCollapse={() => this.setState({show: false})}
                style={[styles.searchBar, show && showStyle]}>
                {Platform.OS === 'ios' || this.state.show ? children : null}
            </NVSearchBar>
        );
    }
}

var NVSearchBar = requireNativeComponent<any>('NVSearchBar', null);

var styles = StyleSheet.create({
    searchBar: {
        position: 'absolute',
        ...Platform.select({
            android: {
                zIndex: -58,
            },
        })
    },
});

export default SearchBar;
