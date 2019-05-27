import React from 'react';
import { requireNativeComponent, Platform } from 'react-native';

var SearchBar = ({
    children,
    text,
    hideWhenScrolling = false,
    autoCapitalize = 'sentences',
}) => (
    <NVSearchBar
        text={text}
        hideWhenScrolling={hideWhenScrolling}
        autoCapitalize={autoCapitalize}
        style={{position: 'absolute'}} >
        {children}
    </NVSearchBar>
);

var NVSearchBar = requireNativeComponent<any>('NVSearchBar', null);

export default Platform.OS === 'ios' ? SearchBar : () => null;
