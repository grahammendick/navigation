import React from 'react';
import { requireNativeComponent, Platform, StyleSheet, UIManager, View } from 'react-native';

class SearchBar extends React.Component<any, any> {
    private ref: React.RefObject<View>;
    constructor(props) {
        super(props);
        this.state = {show: false};
        this.ref = React.createRef<View>();
        this.onChangeText = this.onChangeText.bind(this);
        this.onChangeScopeButton = this.onChangeScopeButton.bind(this);
        this.onChangeBounds = this.onChangeBounds.bind(this);
    }
    static defaultProps = {
        obscureBackground: true,
        hideNavigationBar: true,
        hideWhenScrolling: false,
        autoCapitalize: 'sentences',
        placeholder: Platform.OS === 'ios' ? 'Search' : undefined,
    }
    onChangeText({nativeEvent}) {
        var {onChangeText} = this.props as any;
        var {eventCount: mostRecentEventCount, text} = nativeEvent;
        this.setState({mostRecentEventCount});
        if (onChangeText)
            onChangeText(text)
    }
    onChangeScopeButton({nativeEvent}) {
        var {onChangeScopeButton, scopeButtons} = this.props as any;
        var {eventCount: mostRecentButtonEventCount, scopeButton} = nativeEvent;
        this.setState({mostRecentButtonEventCount});
        if (onChangeScopeButton)
            onChangeScopeButton(scopeButtons[scopeButton])
    }
    onChangeBounds({nativeEvent}) {
        var {width, height} = nativeEvent;
        this.setState({width, height});
    }
    render() {
        var {show, width, height, mostRecentEventCount, mostRecentButtonEventCount} = this.state;
        var {autoCapitalize, children, bottomBar, scopeButton, scopeButtons, ...props} = this.props;
        var constants = (UIManager as any).getViewManagerConfig('NVSearchBar').Constants;
        autoCapitalize = Platform.OS === 'android' ? constants.AutoCapitalize[autoCapitalize] : autoCapitalize;
        var showStyle = Platform.OS === 'android' && {top: !bottomBar ? 56 : 0, bottom: !bottomBar ? 0: 56, zIndex: show ? 58 : -58}
        return (
            <NVSearchBar
                {...props}
                ref={this.ref}
                bottomBar={bottomBar}
                autoCapitalize={autoCapitalize}
                scopeButton={scopeButton ? scopeButtons?.indexOf(scopeButton) : 0}
                scopeButtons={scopeButtons}
                mostRecentEventCount={mostRecentEventCount}
                mostRecentButtonEventCount={mostRecentButtonEventCount}
                onChangeText={this.onChangeText}
                onChangeScopeButton={this.onChangeScopeButton}
                onChangeBounds={this.onChangeBounds}
                onExpand={() => this.setState({show: true})}
                onCollapse={() => this.setState({show: false})}
                style={[styles.searchBar, showStyle, {width, height}]}>
                {Platform.OS === 'ios' || this.state.show ? children : null}
            </NVSearchBar>
        );
    }
}

var NVSearchBar = global.nativeFabricUIManager ? require('./SearchBarNativeComponent').default : requireNativeComponent('NVSearchBar');

var styles = StyleSheet.create({
    searchBar: {
        position: 'absolute',
        ...Platform.select({
            android: {
                right: 0, left: 0,
            },
        })
    },
});

export default SearchBar;
