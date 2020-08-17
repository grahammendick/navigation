import React from 'react';
import { requireNativeComponent, Platform, View } from 'react-native';

var SharedElement = ({transition, ...props}) => {
    var enterTransition = typeof transition !== 'function' ? transition : transition(true);
    var exitTransition = typeof transition !== 'function' ? transition : transition(false);
    return Platform.OS == 'android' ? (
        <NVSharedElement
            enterTransition={enterTransition}
            exitTransition={exitTransition}
            {...props} />
    ) : <View {...props} />;
};
var NVSharedElement = requireNativeComponent<any>('NVSharedElement', null);

export default SharedElement;
