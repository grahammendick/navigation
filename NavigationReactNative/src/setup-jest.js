jest.mock('navigation-react-native', () => {
    const React = require('react');
    const ReactNative = require('react-native');
    const NavigationReactNative = jest.requireActual('navigation-react-native');

    const TabBar = ({tab, defaultTab = 0, onChangeTab, bottomTabs, primary = true, ...props}) => {
        const [selectedTab, setSelectedTab] = React.useState(tab || defaultTab);
        bottomTabs = bottomTabs != null ? bottomTabs : primary;
        const tabBarItems = React.Children.toArray(props.children).filter(child => !!child);
        const tabLayout = tabBarItems.map(({props: {title, testID, onPress}}, index) => (
            <ReactNative.Pressable
                key={index}
                testID={testID}
                accessibilityState={{selected: index === selectedTab}}
                accessibilityRole="tab"
                onPress={() => {
                    onPress();
                    if (selectedTab !== index) {
                        if (tab == null)
                            setSelectedTab(index);
                        if (!!onChangeTab)
                            onChangeTab(index);
                    }
                }} >
                <ReactNative.Text>{title}</ReactNative.Text>
            </ReactNative.Pressable>
        ));
        return (
            <>
                {!bottomTabs && tabLayout}
                <ReactNative.View accessibilityRole="tablist">
                    {tabBarItems.map((child, index) => {
                        const selected = index === selectedTab;
                        return React.cloneElement(child, {...child.props, selected})
                })}
                </ReactNative.View>
                {bottomTabs && tabLayout}
            </>
        );            
    };

    const TabBarItem = ({ selected, ...props }) => (
        <ReactNative.View
            accessibilityRole="tabpanel"
            accessibilityState={{selected}}
            {...props} />
    );

    return  {
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
        TabBar,
        TabBarItem,
        CoordinatorLayout: ({children}) => children,
    };
});
