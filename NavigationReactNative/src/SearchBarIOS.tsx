import React from 'react';
import { requireNativeComponent, Platform } from 'react-native';

var SearchBar = ({
    hideWhenScrolling = false,
    autoCapitalize = 'sentences',
    onChangeText,
    ...props
}) => (
    <NVSearchBar
        hideWhenScrolling={hideWhenScrolling}
        autoCapitalize={autoCapitalize}
        onChangeText={({nativeEvent}) => {
            if (onChangeText)
                onChangeText(nativeEvent.text)
        }}
        style={{position: 'absolute'}}
        {...props} />
);

var NVSearchBar = requireNativeComponent<any>('NVSearchBar', null);

export default Platform.OS === 'ios' ? SearchBar : () => null;
