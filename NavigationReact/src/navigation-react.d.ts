// Type definitions for NavigationReact 2.0.3
// Project: http://grahammendick.github.io/navigation/
// Definitions by: Graham Mendick <https://github.com/grahammendick>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped

///<reference path="navigation.d.ts"/>
///<reference path="react.d.ts"/>

declare module 'navigation-react' {
    export = NavigationReact;
}

declare namespace NavigationReact {
    import React = __React;

    interface LinkProps extends React.HTMLProps<HTMLAnchorElement> {
        lazy?: boolean;
        historyAction?: string;
        navigating?: (e: MouseEvent, domId: string, link: string) => boolean;
        stateNavigator?: Navigation.StateNavigator;
    }

    interface RefreshLinkProps extends LinkProps {
        navigationData?: any;
        includeCurrentData?: boolean;
        currentDataKeys?: string;
        activeCssClass?: string;
        disableActive?: boolean;
    }

    class RefreshLink extends React.Component<RefreshLinkProps, any> { }

    interface NavigationLinkProps extends RefreshLinkProps {
        stateKey: string;
    }

    class NavigationLink extends React.Component<NavigationLinkProps, any> { }

    interface NavigationBackLinkProps extends RefreshLinkProps {
        distance: number;
    }

    class NavigationBackLink extends React.Component<NavigationBackLinkProps, any> { }
}
