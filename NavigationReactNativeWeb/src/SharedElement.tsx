import React from 'react';
import { View } from 'react-native';
import { SharedElement } from 'navigation-react-mobile';

const SharedEl = ({style, ...props}: any) => (
    <View style={style}><SharedElement {...props} /></View>
);

export default SharedEl;
