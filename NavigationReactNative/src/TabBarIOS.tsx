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
    }
    handleBack() {
        var {selectedTab} = this.state;
        if (selectedTab)
            this.setState({selectedTab: 0});
        return !!selectedTab;
    }
    render() {
        var {children, barTintColor, selectedTintColor, unselectedTintColor, bottomTabs} = this.props;
        var tabBarItems = React.Children.toArray(children).filter(child => !!child);
        var titleOnly = !tabBarItems.find(({props}: any) => props.title && props.image);
        var tabLayout = (
            <NVTabLayout
                selectedTintColor={selectedTintColor}
                unselectedTintColor={unselectedTintColor}
                selectedIndicatorAtTop={bottomTabs}
                style={{backgroundColor: barTintColor, height: titleOnly ? 48 : 72}} />
        );
        return (
            <>
                {Platform.OS === 'android' && !bottomTabs && tabLayout}
                <NVTabBar
                    tabCount={tabBarItems.length}
                    onTabSelected={({nativeEvent}) => {
                        if (this.state.selectedTab !== nativeEvent.tab)
                            this.setState({selectedTab: nativeEvent.tab})
                    }}
                    selectedTab={this.state.selectedTab}
                    style={styles.tabBar}>
                        <BackButton onPress={this.handleBack} />
                        {tabBarItems
                            .filter(child => !!child)
                            .map((child: any, index) => {
                                var selected = index === this.state.selectedTab;
                                return child && React.cloneElement(child, {...child.props, selected})
                            })}
                </NVTabBar>
                {Platform.OS === 'android' && bottomTabs && tabLayout}
            </>
        );
    }
}

var NVTabLayout = requireNativeComponent<any>('NVTabLayout', null);
var NVTabBar = requireNativeComponent<any>('NVTabBar', null);

const styles = StyleSheet.create({
    tabBar: {
        flex: 1,
    },
});

export default TabBar;
