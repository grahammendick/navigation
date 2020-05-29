import React from 'react';
import { requireNativeComponent, Platform, StyleSheet, View } from 'react-native';
import BackButton from './BackButton';

class TabBar extends React.Component<any, any> {
    private ref: React.RefObject<View>;
    constructor(props) {
        super(props);
        this.state = {selectedTab: props.tab || props.defaultTab};
        this.ref = React.createRef<View>();
        this.onTabSelected = this.onTabSelected.bind(this);
    }
    static defaultProps = {
        defaultTab: 0,
        scrollable: false,
        primary: Platform.OS === 'ios',
    }
    static getDerivedStateFromProps({tab}, {selectedTab}) {
        if (tab != null && tab !== selectedTab)
            return {selectedTab: tab};
        return null;
    }
    onTabSelected({nativeEvent}) {
        var {eventCount: mostRecentEventCount, tab} = nativeEvent;
        this.ref.current.setNativeProps({mostRecentEventCount});
        this.changeTab(tab);
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
        var {children, barTintColor, selectedTintColor, unselectedTintColor, bottomTabs, scrollable, primary, swipeable} = this.props;
        bottomTabs = bottomTabs != null ? bottomTabs : primary;
        primary = (Platform.OS === 'android' && swipeable != null) ? !swipeable : primary;
        var tabBarItems = React.Children.toArray(children).filter(child => !!child);
        var titleOnly = !tabBarItems.filter(({props}: any) => props.title && props.image)[0];
        var tabViewHeight = !primary ? (titleOnly ? 48 : 72) : 56
        tabViewHeight = Platform.OS === 'android' ? tabViewHeight : 28;
        var TabBar = (Platform.OS === 'android' || primary) ? NVTabBar : View;
        var TabView = !primary ? NVTabLayout : NVTabNavigation;
        TabView = Platform.OS === 'android' ? TabView : NVSegmentedTab;
        var tabLayout = (Platform.OS === 'android' || !primary) && (
            <TabView
                ref={Platform.OS === 'ios' ? this.ref : undefined}
                bottomTabs={bottomTabs}
                onTabSelected={this.onTabSelected}
                selectedTab={this.state.selectedTab}
                selectedTintColor={selectedTintColor}
                unselectedTintColor={unselectedTintColor}
                selectedIndicatorAtTop={bottomTabs}
                titles={tabBarItems.map(({props}: any) => props.title)}
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
                    ref={(Platform.OS === 'android' || primary) ? this.ref : undefined}
                    tabCount={tabBarItems.length}
                    onTabSelected={this.onTabSelected}
                    selectedTab={this.state.selectedTab}
                    barTintColor={barTintColor}
                    selectedTintColor={selectedTintColor}
                    unselectedTintColor={unselectedTintColor}
                    swipeable={!primary}
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

var NVTabLayout = requireNativeComponent<any>('NVTabLayout', null);
var NVTabNavigation = requireNativeComponent<any>('NVTabNavigation', null);
var NVSegmentedTab = requireNativeComponent<any>('NVSegmentedTab', null);
var NVTabBar = requireNativeComponent<any>('NVTabBar', null);

const styles = StyleSheet.create({
    tabBar: {
        flex: 1,
    },
});

export default TabBar;
