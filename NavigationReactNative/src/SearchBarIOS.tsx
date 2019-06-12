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
        position: 'absolute',
        zIndex: -58,
    },
});

export default Platform.OS === 'ios' ? SearchBar : () => null;
