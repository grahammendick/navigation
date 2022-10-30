jest.mock('navigation-react-native', () => {
    const React = require('react');
    const ReactNative = require('react-native');
    const NavigationReactNative = jest.requireActual('navigation-react-native');
    return  {
        TabBarItem: NavigationReactNative.TabBarItem,
        NavigationStack: NavigationReactNative.NavigationStack,
        Scene: NavigationReactNative.Scene,
        NavigationBar: ({ title, children, ...props }) => (
            <ReactNative.View accessibilityRole="toolbar" {...props}>
                <ReactNative.Text accessibilityRole="header">{title}</ReactNative.Text>
                {children}
            </ReactNative.View>
        ),
        LeftBar: ({children}) => children,
        RightBar: ({children}) => children,
        TabBar: ({children}) => children,
        CoordinatorLayout: ({children}) => children,
    };
});
