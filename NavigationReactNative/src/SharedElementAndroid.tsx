import React, { ReactElement } from 'react';
import { requireNativeComponent } from 'react-native';
type SharedElementProps = { name: string; transition?: string | ((from: boolean) => string); children: ReactElement<any> };
type NVSharedElementProps = { name: string; enterTransition: string; exitTransition: string; children: ReactElement<any> };

var SharedElement = ({transition, ...props}: SharedElementProps) => {
    var enterTransition = typeof transition !== 'function' ? transition : transition(true);
    var exitTransition = typeof transition !== 'function' ? transition : transition(false);
    return <NVSharedElement enterTransition={enterTransition} exitTransition={exitTransition} {...props} />
};

var NVSharedElement = requireNativeComponent<NVSharedElementProps>('NVSharedElement', null);

export default SharedElement;
