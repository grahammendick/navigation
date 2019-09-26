import React from 'react';
import { requireNativeComponent, StyleSheet } from 'react-native';
import BackButton from './BackButton';

class TabBar extends React.Component<any, any> {
    constructor(props) {
        super(props);
        this.state = {selectedTab: 0};
        this.handleBack = this.handleBack.bind(this);
    }
    handleBack() {
        var {selectedTab} = this.state;
        if (selectedTab)
            this.setState({selectedTab: 0});
        return !!selectedTab;
    }
    render() {
        var {children, ...props} = this.props;
        return (
            <NVTabBar
                {...props}
                onTabSelected={({nativeEvent}) => {
                    if (this.state.selectedTab !== nativeEvent.tab)
                        this.setState({selectedTab: nativeEvent.tab})
                }}
                selectedTab={this.state.selectedTab}
                style={styles.tabBar}>
                    <BackButton onPress={this.handleBack} />
                    {React.Children.map(children, (child: any, index) => {
                        var selected = index === this.state.selectedTab;
                        return child && React.cloneElement(child, {...child.props, selected});
                    })}
            </NVTabBar>
        );
    }
}

var NVTabBar = requireNativeComponent<any>('NVTabBar', null);

const styles = StyleSheet.create({
    tabBar: {
        flex: 1,
    },
});

export default TabBar;
