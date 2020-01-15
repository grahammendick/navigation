import React from 'react';
import { requireNativeComponent, Platform, StyleSheet, UIManager, View } from 'react-native';

class SearchBar extends React.Component<any, any> {
    private ref: React.RefObject<View>;
    constructor(props) {
        super(props);
        this.state = {show: false};
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
        var {autoCapitalize, children, ...props} = this.props;
        var constants = (UIManager as any).getViewManagerConfig('NVSearchBar').Constants;
        autoCapitalize = Platform.OS === 'android' ? constants.AutoCapitalize[autoCapitalize] : autoCapitalize;
        return (
            <NVSearchBar
                {...props}
                ref={this.ref}
                autoCapitalize={autoCapitalize}
                onChangeText={this.onChangeText}
                onExpand={() => this.setState({show: true})}
                onCollapse={() => this.setState({show: false})}
                style={[styles.searchBar, {zIndex: Platform.OS === 'android' && this.state.show ? 58 : -58}]}>
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
                top: 56, right: 0,
                bottom: 0, left: 0,
            },
        })
    },
});

export default SearchBar;
