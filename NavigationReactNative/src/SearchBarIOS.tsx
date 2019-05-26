import React from 'react';
import { requireNativeComponent, Platform } from 'react-native';

const SearchBar = (props) => (
    <NVSearchBar {...props} style={{position: 'absolute'}} /> 
);

const NVSearchBar = requireNativeComponent('NVSearchBar', SearchBar as any);

export default Platform.OS === 'ios' ? SearchBar : () => null;
