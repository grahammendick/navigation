import { StateNavigator, State } from 'navigation';
import SharedElementMotion from './SharedElementMotion';
import { ReactElement } from 'react';

interface NavigationMotionProps {
    unmountedStyle: any;
    mountedStyle: any;
    crumbStyle: any;
    duration: number;
    sharedElementMotion: (props: SharedElementNavigationMotionProps) => SharedElementMotion;
    stateNavigator?: StateNavigator;
    children: (style: any, scene: ReactElement<any>, key: number, active: boolean, state: State, data: any) => ReactElement<any>;
}

interface SharedElementProps {
    name: string;
    data: any;
    unshare: boolean;
    stateNavigator?: StateNavigator;
    children: ReactElement<any>;
}

interface SharedElement {
    name: string;
    oldElement: { ref: HTMLElement; data: any };
    mountedElement: { ref: HTMLElement; data: any };
}

interface SharedElementNavigationMotionProps {
    sharedElements: SharedElement[];
    progress: number;
    duration: number;
}

interface SharedElementMotionProps {
    onAnimated: (name: string, ref: HTMLElement, data: any) => void;
    onAnimating: (name: string, ref: HTMLElement, data: any) => void;
    elementStyle: (name: string, ref: HTMLElement, data: any) => any;
    children: (style: any, name: string, oldElementData: any, mountedElementData: any) => ReactElement<any>;
}

export { NavigationMotionProps, SharedElementProps, SharedElement, SharedElementNavigationMotionProps, SharedElementMotionProps }

