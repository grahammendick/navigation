import { ReactElement } from 'react';
import { State } from 'navigation';
import { MobileHistoryManager, SharedElementNavigationMotionProps, SharedElementMotion } from 'navigation-react-mobile';

declare module 'navigation-react-native' {
    namespace NavigationStack {
        /**
         * Manages history with the HTML5 history api. Produces friendly Urls in Mobile
         * web apps. If the applicationPath is undefined it uses the browser's Url hash
         */
        export class HistoryManager extends MobileHistoryManager {}
        /**
         * Animates Shared Elements when navigating
         */
        export class SharedElementTransition extends SharedElementMotion {}
    }

    interface NavigationStackProps {
        /**
         * A Scene's unmounted style
         */
        unmountedStyle?: any;
        /**
         * A Scene's mounted style
         */
        mountedStyle?: any;
        /**
         * A Scene's crumb trail style
         */
        crumbedStyle?: any;
        /**
         * The animation duration
         */
        duration?: number;
        /**
         * The Shared Element Transitiom component
         */
        sharedElementTransition?: (props: SharedElementNavigationMotionProps) => ReactElement<SharedElementMotion>;
        /**
         * Renders the Scene with the interpoated styles
         */
        children?: (style: any, scene: ReactElement<any>, key: string, active: boolean, state: State, data: any) => ReactElement<any>;
    }

    interface TabBarItemProps {
        /**
         * The tab hyperlink
         */
        href?: string;
    }

    interface NavigationBarProps {
        /**
         * The navigation button hyperlink
         */
        navigationHref?: string;
    }

    interface BarButtonProps {
        /**
         * The button hyperlink
         */
        href?: string;
    }
}
