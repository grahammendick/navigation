import React from 'react';
import { requireNativeComponent, Platform } from 'react-native';

var SearchBar = ({
    children,
    hidesWhenScrolling = false,
    textAutocapitalizationType = 'sentences',
}) => (
    <NVSearchBar
        hidesWhenScrolling={hidesWhenScrolling}
        textAutocapitalizationType={textAutocapitalizationType}
        style={{position: 'absolute'}} >
        {children}
    </NVSearchBar>
);

var NVSearchBar = requireNativeComponent<any>('NVSearchBar', null);

export default Platform.OS === 'ios' ? SearchBar : () => null;
