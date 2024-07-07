jest.mock('navigation-react-native', () => {
    const React = require('react');
    const ReactNative = require('react-native');
    const NavigationReact = require('navigation-react');
    const NavigationReactNative = jest.requireActual('navigation-react-native');

    const Scene = ({ crumb, renderScene = (state, data) => state.renderScene(data) }) => {
        const navEvent = React.useContext(NavigationReact.NavigationContext);
        const [navigationEvent, setNavigationEvent] = React.useState(null);
        const {crumbs} = navEvent.stateNavigator.stateContext;
        if (crumbs.length === crumb && navigationEvent !== navEvent)
            setNavigationEvent(navEvent);
        const stateContext = navigationEvent?.stateNavigator?.stateContext;
        const {state, data} = stateContext || crumbs[crumb] || {};
        return !!state && (
            <NavigationReact.NavigationContext.Provider value={navigationEvent}>
                {navigationEvent && renderScene(state, data)}
            </NavigationReact.NavigationContext.Provider>
        );
    };

    const NavigationStack = ({ stackInvalidatedLink, renderScene, children }) => {
        const {stateNavigator} = React.useContext(NavigationReact.NavigationContext);
        const [stackState, setStackState] = React.useState({stateNavigator: null, keys: []});
        const scenes = {};
        let firstLink;
        const findScenes = (elements = children, nested = false) => {
            for(const scene of React.Children.toArray(elements)) {
                const {stateKey, children} = scene.props;
                if (scene.type === NavigationReactNative.Scene) {
                    firstLink = firstLink || stateNavigator.fluent().navigate(stateKey).url;
                    scenes[stateKey] = scene;
                }
                else if (!nested) findScenes(children, true)
            }
        }
        findScenes();
        const prevScenes = React.useRef({});
        const allScenes = {...prevScenes.current, ...scenes};
        React.useEffect(() => {
            prevScenes.current = allScenes;
            const {state, crumbs, nextCrumb} = stateNavigator.stateContext;
            const validate = ({key}) => !!scenes[key];
            if (firstLink) {
                stateNavigator.onBeforeNavigate(validate);
                let resetLink = !state ? firstLink : undefined;
                if (!resetLink && [...crumbs, nextCrumb].find(({state}) => !scenes[state.key]))
                    resetLink = stackInvalidatedLink != null ? stackInvalidatedLink : firstLink;
                if (resetLink != null) stateNavigator.navigateLink(resetLink);
            }
            return () => stateNavigator.offBeforeNavigate(validate);
        }, [children, stateNavigator, scenes, allScenes, stackInvalidatedLink]);
        const {stateNavigator: prevStateNavigator, keys} = stackState;
        if (prevStateNavigator !== stateNavigator && stateNavigator.stateContext.state) {
            setStackState((prevStackState) => {
                const {keys: prevKeys, stateNavigator: prevStateNavigator} = prevStackState;
                const {state, crumbs, nextCrumb, history} = stateNavigator.stateContext;
                const prevState = prevStateNavigator && prevStateNavigator.stateContext.state;
                const currentKeys = crumbs.concat(nextCrumb).map((_, i) => `${i}`);
                const newKeys = currentKeys.slice(prevKeys.length);
                const keys = prevKeys.slice(0, currentKeys.length).concat(newKeys);
                if (prevKeys.length === keys.length && prevState !== state)
                    keys[keys.length - 1] = `${keys.length - 1}`;
                const refresh = prevKeys.length === keys.length && prevState === state;
                return {keys, stateNavigator};
            });
        }
        const {crumbs, nextCrumb} = stateNavigator.stateContext;
        return crumbs.concat(nextCrumb || []).map(({ state, data }, index, {length}) => {
            renderScene = firstLink ? ({key}) => allScenes[key] : renderScene;
            return (
                <ReactNative.View
                    key={state.key}
                    accessible
                    accessibilityRole="window"
                    accessibilityState={{selected: index === length - 1}}>
                    <Scene crumb={index} renderScene={renderScene} />
                </ReactNative.View>
            );
        });
    };

    const NavigationBar = ({ hidden, navigationImage, navigationTestID, title, onNavigationPress, children, ...props }) => {
        if (hidden) return null;
        const Left = React.Children.toArray(children).find(({type}) => type === LeftBar);
        return (
            <ReactNative.View accessible accessibilityRole="toolbar" {...props}>
                {!!navigationImage && (
                    <ReactNative.Pressable accessibilityRole="imagebutton"
                        testID={navigationTestID} onPress={onNavigationPress}>
                        <ReactNative.Image source={navigationImage} />
                    </ReactNative.Pressable> 
                )}
                {!!title && (
                    <ReactNative.Text accessibilityRole="header">{title}</ReactNative.Text>
                )}
                {!Left ? <LeftBar /> : null}
                {children}
            </ReactNative.View>
        );
    };

    const LeftBar = ({children, ...props}) => {
        const {stateNavigator} = React.useContext(NavigationReact.NavigationContext);
        return (children || stateNavigator.canNavigateBack(1)) && (
            <ReactNative.View accessibilityRole="menubar" {...props}>
                {stateNavigator.canNavigateBack(1) && (
                    <ReactNative.Pressable
                        accessibilityRole="menuitem"
                        onPress={() => stateNavigator.navigateBack(1)}>
                        <ReactNative.Text>Back</ReactNative.Text>
                    </ReactNative.Pressable>
                )}
                {children}
            </ReactNative.View>
        );
    };

    const RightBar = (props) => <ReactNative.View accessibilityRole="menubar" {...props} />;

    const BarButton = ({title, image, testID, onPress, children, ...props}) => {
        const [expanded, setExpanded] = React.useState(false);
        const actionBar = !!((React.Children.toArray(children))[0]?.type === ActionBar);
        let subview = children;
        if (actionBar) {
            const bar = React.Children.toArray(children)[0];
            subview = React.cloneElement(bar, {...bar.props, collapse: () => setExpanded(false)});
        }
        return (
            <ReactNative.Pressable
                accessibilityRole="menuitem"
                testID={testID}
                {...props}
                onPress={() => {
                    if (!actionBar) onPress();
                    else {
                        const {props} = React.Children.toArray(children)[0];
                        props.onExpanded?.();
                        setExpanded(true);
                    }
                }}>
                <>
                    {!!title && <ReactNative.Text>{title}</ReactNative.Text>}
                    {!!image && <ReactNative.Image source={image} />}
                    {!actionBar || expanded ? subview : null}
                </>
            </ReactNative.Pressable>
        );
    };

    const ActionBar =  ({collapse, onCollapsed, children}) => (
        <>
            <ReactNative.Pressable
                accessibilityRole="button"
                onPress={() => {
                    collapse();
                    onCollapsed?.();
                }}>
                <ReactNative.Text>Collapse</ReactNative.Text>
            </ReactNative.Pressable>
            {children}
        </>
    );

    const TitleBar = (props) => <ReactNative.View accessibilityRole="header" {...props} />;

    const SearchBar = ({ text, placeholder, onChangeText, children }) => (
        <ReactNative.View accessibilityRole="search">
            <ReactNative.TextInput placeholder={placeholder} onChangeText={onChangeText} />
            {!!text && children}
        </ReactNative.View>
    );

    const TabBar = ({tab, defaultTab = 0, onChangeTab, bottomTabs, primary = true, ...props}) => {
        const [selectedTab, setSelectedTab] = React.useState(tab || defaultTab);
        if (tab != null && tab !== selectedTab) setSelectedTab(tab);
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
                }}>
                <ReactNative.Text>{title}</ReactNative.Text>
            </ReactNative.Pressable>
        ));
        return (
            <>
                {!bottomTabs && tabLayout}
                <ReactNative.View accessible accessibilityRole="tablist">
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
            accessible
            accessibilityRole="tabpanel"
            accessibilityState={{selected}}
            {...props} />
    );

    const SharedElement = ({children}) => children;

    const CoordinatorLayout = ({children}) => children;

    const CollapsingBar = ({children}) => children;

    const BottomSheet = ({children}) => children;

    const Sheet = ({children}) => children;

    const FloatingActionButton = ({text, image, testID, onPress}) => (
        <ReactNative.Pressable
            accessibilityRole={text ? 'button' : 'imagebutton'}
            testID={testID} onPress={onPress}>
            {!!text && <ReactNative.Text>{text}</ReactNative.Text>}
            {!!image && <ReactNative.Image source={image} />}
        </ReactNative.Pressable> 
    );

    return  {
        ...NavigationReactNative,
        NavigationStack,
        NavigationBar,
        LeftBar,
        RightBar,
        BarButton,
        SearchBar,
        TitleBar,
        TabBar,
        TabBarItem,
        SharedElement,
        CoordinatorLayout,
        CollapsingBar,
        ActionBar,
        FloatingActionButton,
        BottomSheet,
        Sheet,
    };
});
