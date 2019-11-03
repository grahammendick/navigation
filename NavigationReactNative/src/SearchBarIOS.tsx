import React from 'react';
import { requireNativeComponent, Platform, StyleSheet, View } from 'react-native';

class SearchBar extends React.Component {
    private ref: React.RefObject<View>;
    constructor(props) {
        super(props);
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
        return (
            <NVSearchBar
                {...this.props}
                ref={this.ref}
                onChangeText={this.onChangeText}
                style={styles.searchBar} />
        );
    }
}

var NVSearchBar = requireNativeComponent<any>('NVSearchBar', null);

var styles = StyleSheet.create({
    searchBar: {
        zIndex: 58,
        position: 'absolute',
        top: 56, right: 0,
        bottom: 0, left: 0,
    },
});

export default SearchBar;
