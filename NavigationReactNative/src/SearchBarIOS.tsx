import React from 'react';
import { requireNativeComponent, Platform } from 'react-native';

var SearchBar = ({
    hideWhenScrolling = false,
    autoCapitalize = 'sentences',
    ...props
}) => (
    <NVSearchBar
        hideWhenScrolling={hideWhenScrolling}
        autoCapitalize={autoCapitalize}
        style={{position: 'absolute'}}
        {...props} />
);

var NVSearchBar = requireNativeComponent<any>('NVSearchBar', null);

export default Platform.OS === 'ios' ? SearchBar : () => null;
