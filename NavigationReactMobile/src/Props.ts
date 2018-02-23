import { StateNavigator, State } from 'navigation';
import * as React from 'react';

interface NavigationMotionProps {
    unmountedStyle: any;
    mountedStyle: any;
    crumbStyle: any;
    duration: number;
    sharedElementMotion: (props: any) => any;
    stateNavigator?: StateNavigator;
    children: (style: any, scene: React.ReactNode, key: number, active: boolean, state: State, data: any) => React.ReactNode;
}

export { NavigationMotionProps }

