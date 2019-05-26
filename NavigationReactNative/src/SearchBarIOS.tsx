import React from 'react';
import { requireNativeComponent, Platform } from 'react-native';

const SearchBar = ({
    hidesWhenScrolling = false,
    textAutocapitalizationType = 'sentences',
}) => (
    <NVSearchBar
        hidesWhenScrolling={hidesWhenScrolling}
        textAutocapitalizationType={textAutocapitalizationType}
        style={{position: 'absolute'}} /> 
);

const NVSearchBar: any = requireNativeComponent('NVSearchBar', SearchBar as any);

export default Platform.OS === 'ios' ? SearchBar : () => null;
