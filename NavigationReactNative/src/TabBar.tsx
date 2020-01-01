import React from 'react';
import { requireNativeComponent, Platform, StyleSheet } from 'react-native';
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
        swipeable: true
    }
    handleBack() {
        var {selectedTab} = this.state;
        if (selectedTab)
            this.setState({selectedTab: 0});
        return !!selectedTab;
    }
    render() {
        var {children, barTintColor, selectedTintColor, unselectedTintColor, bottomTabs, scrollable, swipeable} = this.props;
        var tabBarItems = React.Children.toArray(children).filter(child => !!child);
        var titleOnly = !tabBarItems.find(({props}: any) => props.title && props.image);
        var NVTabView = swipeable ? NVTabLayout : NVTabNavigation;
        var tabLayout = Platform.OS === 'android' && (
            <NVTabView
                selectedTintColor={selectedTintColor}
                unselectedTintColor={unselectedTintColor}
                selectedIndicatorAtTop={bottomTabs}
                scrollable={scrollable}
                style={{
                    backgroundColor: barTintColor,
                    height: swipeable ? (titleOnly ? 48 : 72) : 56
                }} />
        );
        return (
            <>
                {!bottomTabs && tabLayout}
                <NVTabBar
                    images={tabBarItems.map(({props}: any) => props.image)}
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
                                return React.cloneElement(child, {...child.props, selected})
                            })}
                </NVTabBar>
                {bottomTabs && tabLayout}
            </>
        );
    }
}

var NVTabLayout = requireNativeComponent<any>('NVTabLayout', null);
var NVTabNavigation = requireNativeComponent<any>('NVTabNavigation', null);
var NVTabBar = requireNativeComponent<any>('NVTabBar', null);

const styles = StyleSheet.create({
    tabBar: {
        flex: 1,
    },
});

export default TabBar;
