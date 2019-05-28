import React from 'react';
import { requireNativeComponent, Platform, View } from 'react-native';

class SearchBar extends React.Component {
    private ref: React.RefObject<View>;
    constructor(props) {
        super(props);
        this.ref = React.createRef<View>();
        this.onChangeText = this.onChangeText.bind(this);
    }
    static defaultProps = {
        dimBackground: false,
        hideWhenScrolling: false,
        autoCapitalize: 'sentences',
    }
    onChangeText({nativeEvent}) {
        var {onChangeText} = this.props as any;
        var {eventCount, text} = nativeEvent;
        if (this.ref.current && this.ref.current.setNativeProps)
            this.ref.current.setNativeProps({mostRecentEventCount: eventCount});
        if (onChangeText)
            onChangeText(text)

    }
    render() {
        return (
            <NVSearchBar
                {...this.props}
                ref={this.ref}
                onChangeText={this.onChangeText}
                style={{position: 'absolute'}} />
        );
    }
} 

var NVSearchBar = requireNativeComponent<any>('NVSearchBar', null);

export default Platform.OS === 'ios' ? SearchBar : () => null;
