import { ReactElement, ReactNode } from 'react';
import { StateNavigator, State } from 'navigation';
import SharedElementMotion from './SharedElementMotion.js';
import SharedElementRegistry from './SharedElementRegistry.js';

interface MotionProps<T> {
    data: T[];
    getKey: (item: T) => string;
    duration: number;
    enter: (item: T) => any;
    update: (item: T) => any;
    leave?: (item: T) => any;
    onRest?: (item: T) => void;
    progress?: number;
    children: (items: {style: any, data: T, key: string, rest: boolean, progress: number, start: any, end: any }[]) => ReactElement<any>[];
}

interface SharedElementProps {
    name: string;
    data?: any;
    unshare?: boolean;
    sharedElementRegistry: SharedElementRegistry;
    stateNavigator: StateNavigator;
    children: ReactElement<any>;
}

interface SharedItem {
    name: string;
    oldElement: {ref: HTMLElement; data: any};
    mountedElement: {ref: HTMLElement; data: any};
}

interface SharedElementNavigationMotionProps {
    key: string;
    sharedElements: SharedItem[];
    progress: number;
    duration: number;
}

interface SharedElementMotionProps {
    onAnimated?: (name: string, ref: HTMLElement, data: any) => void;
    onAnimating?: (name: string, ref: HTMLElement, data: any) => void;
    elementStyle?: (name: string, ref: HTMLElement, data: any) => any;
    children: (style: any, name: string, oldElementData: any, mountedElementData: any) => ReactElement<any>;
}

interface NavigationMotionProps {
    unmountedStyle?: any;
    mountedStyle?: any;
    unmountStyle?: any;
    crumbStyle?: any;
    sharedElements?: any;
    className?: any;
    style?: any;
    duration?: number;
    stackInvalidatedLink?: string;
    sharedElementMotion?: (props: SharedElementNavigationMotionProps) => ReactElement<SharedElementMotion>;
    renderScene: (state: State, data: any) => ReactNode,
    stateNavigator?: StateNavigator;
    renderMotion?: (style: any, scene: ReactElement<any>, key: string, active: boolean, state: State, data: any) => ReactElement<any>;
    children?: any;
}

interface SceneProps {
    crumb: number;
    url: string;
    id: string;
    rest: boolean;
    className: string;
    style: any;
    wrap?: boolean;
    renderScene?: (state: State, data: any) => ReactNode;
}

export { MotionProps, SharedElementProps, SharedItem, SharedElementNavigationMotionProps, SharedElementMotionProps, NavigationMotionProps, SceneProps }

