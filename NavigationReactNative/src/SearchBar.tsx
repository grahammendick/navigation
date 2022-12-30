import React from 'react';
import { requireNativeComponent, Platform, StyleSheet, UIManager, View } from 'react-native';

class SearchBar extends React.Component<any, any> {
    private ref: React.RefObject<View>;
    constructor(props) {
        super(props);
        this.state = {show: false, mostRecentEventCount: 0};
        this.ref = React.createRef<View>();
        this.onChangeText = this.onChangeText.bind(this);
        this.onChangeScopeButton = this.onChangeScopeButton.bind(this);
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
    render() {
        var {show, mostRecentEventCount, mostRecentButtonEventCount} = this.state;
        var {autoCapitalize, children, bottomBar, scopeButton, scopeButtons, toolbar, ...props} = this.props;
        var constants = (UIManager as any).getViewManagerConfig('NVSearchBar').Constants;
        autoCapitalize = Platform.OS === 'android' ? constants.AutoCapitalize[autoCapitalize] : autoCapitalize;
        var showStyle = Platform.OS === 'android' && {top: !bottomBar ? 56 : 0, bottom: !bottomBar ? 0: 56, height: show ? 'auto' : 0}
        var SearchBar = Platform.OS === 'ios' || !toolbar ? NVSearchBar : NVSearchResults;
        return (
            <SearchBar
                {...props}
                ref={this.ref}
                bottomBar={bottomBar}
                autoCapitalize={'' + autoCapitalize}
                scopeButton={scopeButton ? scopeButtons?.indexOf(scopeButton) : 0}
                scopeButtons={scopeButtons}
                mostRecentEventCount={mostRecentEventCount}
                mostRecentButtonEventCount={mostRecentButtonEventCount}
                onChangeText={this.onChangeText}
                onChangeScopeButton={this.onChangeScopeButton}
                onExpand={() => this.setState({show: true})}
                onCollapse={() => this.setState({show: false})}
                style={[styles.searchBar, showStyle]}>
                {Platform.OS === 'ios' || this.state.show ? children : null}
            </SearchBar>
        );
    }
}

var NVSearchBar = global.nativeFabricUIManager ? require('./SearchBarNativeComponent').default : requireNativeComponent('NVSearchBar');
var NVSearchResults = global.nativeFabricUIManager ? require('./SearchBarNativeComponent').default : requireNativeComponent('NVSearchResults');

var styles = StyleSheet.create({
    searchBar: {
        position: 'absolute',
        ...Platform.select({
            android: {
                zIndex: 58,
                right: 0, left: 0,
            },
        })
    },
});

export default SearchBar;
