import React from 'react';
import { requireNativeComponent } from 'react-native';

var SharedElement = ({transition, ...props}) => {
    var enterTransition = typeof transition !== 'function' ? transition : transition(true);
    var exitTransition = typeof transition !== 'function' ? transition : transition(false);
    return <NVSharedElement enterTransition={enterTransition} exitTransition={exitTransition} {...props} />
};
var NVSharedElement = requireNativeComponent<any>('NVSharedElement', null);

export default SharedElement;
