import React from 'react';
import { requireNativeComponent, Platform, StyleSheet, View } from 'react-native';
import BackButton from './BackButton';

class TabBar extends React.Component<any, any> {
    private ref: React.RefObject<View>;
    constructor(props) {
        super(props);
        this.state = {selectedTab: props.selectedTab || 0};
        this.ref = React.createRef<View>();
        this.onTabSelected = this.onTabSelected.bind(this);
    }
    static defaultProps = {
        scrollable: false,
        primary: Platform.OS === 'ios',
    }
    static getDerivedStateFromProps({selectedTab}, state) {
        if (selectedTab != null && selectedTab !== state.selectedTab)
            return {selectedTab};
        return null;
    }
    onTabSelected({nativeEvent}) {
        var {eventCount: mostRecentEventCount, tab} = nativeEvent;
        this.ref.current.setNativeProps({mostRecentEventCount});
        this.changeTab(tab);
    }
    changeTab(tab) {
        var {selectedTab, onChangeTab} = this.props;
        if (this.state.selectedTab !== tab) {
            if (selectedTab == null)
                this.setState({selectedTab: tab});
            if (!!onChangeTab)
                onChangeTab(tab);
            return true;
        }
        return false;
    }
    render() {
        var {children, barTintColor, selectedTintColor, unselectedTintColor, bottomTabs, scrollable, primary, swipeable} = this.props;
        bottomTabs = bottomTabs != null ? bottomTabs : primary;
        primary = (Platform.OS === 'android' && swipeable != null) ? !swipeable : primary;
        var tabBarItems = React.Children.toArray(children).filter(child => !!child);
        var titleOnly = !tabBarItems.find(({props}: any) => props.title && props.image);
        var tabViewHeight = !primary ? (titleOnly ? 48 : 72) : 56
        tabViewHeight = Platform.OS === 'android' ? tabViewHeight : 28;
        var TabBar = (Platform.OS === 'android' || primary) ? NVTabBar : View;
        var TabView = !primary ? NVTabLayout : NVTabNavigation;
        TabView = Platform.OS === 'android' ? TabView : NVSegmentedTab;
        var tabLayout = (Platform.OS === 'android' || !primary) && (
            <TabView
                bottomTabs={bottomTabs}
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
                    ref={this.ref}
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
