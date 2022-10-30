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
        TabBar: ({onChangeTab, bottomTabs, primary = true, ...props}) => {
            bottomTabs = bottomTabs != null ? bottomTabs : primary;
            const tabBarItems = React.Children.toArray(props.children).filter(child => !!child);
            const tabLayout = tabBarItems.map(({props: {title, testID, onPress}}, index) => (
                <ReactNative.Text
                    key={index}
                    testID={testID}
                    accessibilityRole="tab"
                    onPress={() => {
                        onPress();
                        onChangeTab(index)
                    }} >
                    {title}
                </ReactNative.Text>
            ));
            return (
                <>
                    {!bottomTabs && tabLayout}
                    <ReactNative.View accessibilityRole="tablist" {...props} />
                    {bottomTabs && tabLayout}
                </>
            );            
        },
        CoordinatorLayout: ({children}) => children,
    };
});
