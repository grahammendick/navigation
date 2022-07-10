import React from 'react';
import { requireNativeComponent, Platform, StyleSheet, View, I18nManager , UIManager} from 'react-native';
import BackButton from './BackButton';

class TabBar extends React.Component<any, any> {
    private ref: React.RefObject<View>;
    private swiping = false;
    constructor(props) {
        super(props);
        this.state = {selectedTab: props.tab || props.defaultTab, mostRecentEventCount: 0};
        this.ref = React.createRef<View>();
        this.onTabSelected = this.onTabSelected.bind(this);
        this.onTabSwipeStateChanged = this.onTabSwipeStateChanged.bind(this);
    }
    static defaultProps = {
        defaultTab: 0,
        scrollable: false,
        primary: Platform.OS === 'ios',
        scrollsToTop: true,
        labelVisibilityMode: 'auto'
    }
    static getDerivedStateFromProps({tab}, {selectedTab}) {
        if (tab != null && tab !== selectedTab)
            return {selectedTab: tab};
        return null;
    }
    onTabSelected({nativeEvent}) {
        var {eventCount: mostRecentEventCount, tab} = nativeEvent;
        this.setState({mostRecentEventCount});
        this.changeTab(tab);
    }
    onTabSwipeStateChanged({nativeEvent}) {
        this.swiping = nativeEvent.swiping;
    }
    changeTab(selectedTab) {
        var {tab, onChangeTab} = this.props;
        if (this.state.selectedTab !== selectedTab) {
            if (tab == null)
                this.setState({selectedTab});
            if (!!onChangeTab)
                onChangeTab(selectedTab);
            return true;
        }
        return false;
    }
    render() {
        var {children, labelVisibilityMode, barTintColor, selectedTintColor, unselectedTintColor, bottomTabs, scrollable, primary, scrollsToTop} = this.props;
        bottomTabs = bottomTabs != null ? bottomTabs : primary;
        var tabBarItems = React.Children.toArray(children).filter(child => !!child);
        var titleOnly = !tabBarItems.find(({props}: any) => props.title && props.image);
        var {fontFamily, fontWeight, fontStyle, fontSize, badgeColor} = (tabBarItems[0] as any)?.props || {};
        var tabViewHeight = !primary ? (titleOnly ? 48 : 72) : 56
        tabViewHeight = Platform.OS === 'android' ? tabViewHeight : 28;
        var TabBarPager = (Platform.OS === 'ios' || !I18nManager.isRTL) ? NVTabBarPager : NVTabBarPagerRTL;
        var TabBar = primary ? NVTabBar : TabBarPager;
        var TabView = primary ? NVTabNavigation : (!I18nManager.isRTL ? NVTabLayout : NVTabLayoutRTL);
        TabView = Platform.OS === 'android' ? TabView : NVSegmentedTab;
        var constants = Platform.OS === 'android' ? (UIManager as any).getViewManagerConfig('NVTabNavigation').Constants : null;
        labelVisibilityMode = !(labelVisibilityMode === 'selected' && tabBarItems.length > 3) ? labelVisibilityMode : 'auto';
        var tabLayout = (Platform.OS === 'android' || !primary) && (
            <TabView
                bottomTabs={bottomTabs}
                labelVisibilityMode={constants?.LabelVisibility[labelVisibilityMode]}
                itemHorizontalTranslation={labelVisibilityMode !== 'selected'}
                selectedTintColor={selectedTintColor}
                unselectedTintColor={unselectedTintColor}
                selectedIndicatorAtTop={bottomTabs}
                tabs={tabBarItems.map(({props: {title, testID}}: any) => ({title, testID}))}
                titles={tabBarItems.map(({props: {title = ''}}: any) => title)}
                testIDs={tabBarItems.map(({props: {testID = ''}}: any) => testID)}
                fontFamily={fontFamily} fontWeight={fontWeight}
                fontStyle={fontStyle} fontSize={fontSize}
                scrollable={scrollable}
                style={{
                    height: tabViewHeight,
                    backgroundColor: barTintColor
                }} />
        );
        return (
            <>
                {!bottomTabs && tabLayout}
                {!!tabBarItems.length && <TabBar
                    ref={this.ref}
                    tabCount={tabBarItems.length}
                    onTabSelected={this.onTabSelected}
                    onTabSwipeStateChanged={this.onTabSwipeStateChanged}
                    onMoveShouldSetResponderCapture={() => this.swiping}
                    selectedTab={this.state.selectedTab}
                    barTintColor={barTintColor}
                    selectedTintColor={selectedTintColor}
                    unselectedTintColor={unselectedTintColor}
                    badgeColor={badgeColor}
                    scrollsToTop={scrollsToTop}
                    fontFamily={fontFamily} fontWeight={fontWeight}
                    fontStyle={fontStyle} fontSize={fontSize}
                    mostRecentEventCount={this.state.mostRecentEventCount}
                    style={styles.tabBar}>
                        <BackButton onPress={() => this.changeTab(0)} />
                        {tabBarItems
                            .filter(child => !!child)
                            .map((child: any, index) => {
                                var selected = index === this.state.selectedTab;
                                return React.cloneElement(child, {...child.props, index, selected})
                            })}
                </TabBar>}
                {bottomTabs && tabLayout}
            </>
        );
    }
}

var NVTabLayout = global.nativeFabricUIManager ? require('./TabLayoutNativeComponent').default : requireNativeComponent('NVTabLayout');
var NVTabLayoutRTL = global.nativeFabricUIManager ? require('./TabLayoutRTLNativeComponent').default : requireNativeComponent('NVTabLayoutRTL');
var NVTabNavigation = global.nativeFabricUIManager ? require('./TabNavigationNativeComponent').default : requireNativeComponent('NVTabNavigation');
var NVSegmentedTab = global.nativeFabricUIManager ? require('./SegmentedTabNativeComponent').default : requireNativeComponent('NVSegmentedTab');
var NVTabBar = global.nativeFabricUIManager ? require('./TabBarNativeComponent').default : requireNativeComponent('NVTabBar');
var NVTabBarPager = global.nativeFabricUIManager ? require('./TabBarPagerNativeComponent').default : requireNativeComponent('NVTabBarPager');
var NVTabBarPagerRTL = global.nativeFabricUIManager ? require('./TabBarPagerRTLNativeComponent').default : requireNativeComponent('NVTabBarPagerRTL');

const styles = StyleSheet.create({
    tabBar: {
        flex: 1,
    },
});

export default TabBar;
