import React from 'react';
import { requireNativeComponent, Platform, View } from 'react-native';

var SharedElement = ({transition, ...props}) => (
    Platform.OS == 'android' ? (
        <NVSharedElement
            enterTransition={typeof transition !== 'function' ? transition : transition(true)}
            exitTransition={typeof transition !== 'function' ? transition : transition(false)}
            {...props} />
    ) : <View {...props} />
);

var NVSharedElement = requireNativeComponent<any>('NVSharedElement', null);

export default SharedElement;
