import React from 'react';
import { requireNativeComponent, Platform, StyleSheet, View } from 'react-native';
import BackButton from './BackButton';

class TabBar extends React.Component<any, any> {
    constructor(props) {
        super(props);
        this.state = {selectedTab: 0};
        this.handleBack = this.handleBack.bind(this);
    }
    static defaultProps = {
        bottomTabs: false,
        scrollable: false,
        segmented: false,
        swipeable: true
    }
    handleBack() {
        var {selectedTab} = this.state;
        if (selectedTab)
            this.setState({selectedTab: 0});
        return !!selectedTab;
    }
    render() {
        var {children, barTintColor, selectedTintColor, unselectedTintColor, bottomTabs, scrollable, segmented, swipeable} = this.props;
        var tabBarItems = React.Children.toArray(children).filter(child => !!child);
        var titleOnly = !tabBarItems.find(({props}: any) => props.title && props.image);
        var tabViewHeight = swipeable ? (titleOnly ? 48 : 72) : 56
        tabViewHeight = Platform.OS === 'android' ? tabViewHeight : 28;
        var TabBar = (Platform.OS === 'android' || !segmented) ? NVTabBar : View;
        var TabView = swipeable ? NVTabLayout : NVTabNavigation;
        TabView = Platform.OS === 'android' ? TabView : NVSegmentedControl;
        var tabLayout = (Platform.OS === 'android' || segmented) && (
            <TabView
                selectedTintColor={selectedTintColor}
                unselectedTintColor={unselectedTintColor}
                selectedIndicatorAtTop={bottomTabs}
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
                    tabCount={tabBarItems.length}
                    onTabSelected={({nativeEvent}) => {
                        if (this.state.selectedTab !== nativeEvent.tab)
                            this.setState({selectedTab: nativeEvent.tab})
                    }}
                    selectedTab={this.state.selectedTab}
                    barTintColor={barTintColor}
                    selectedTintColor={selectedTintColor}
                    unselectedTintColor={unselectedTintColor}
                    swipeable={swipeable}
                    style={styles.tabBar}>
                        <BackButton onPress={this.handleBack} />
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
var NVSegmentedControl = requireNativeComponent<any>('NVSegmentedControl', null);
var NVTabBar = requireNativeComponent<any>('NVTabBar', null);

const styles = StyleSheet.create({
    tabBar: {
        flex: 1,
    },
});

export default TabBar;
