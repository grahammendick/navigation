import React from 'react';
import { requireNativeComponent, StyleSheet } from 'react-native';

class TabBar extends React.Component<any, any> {
    constructor(props) {
        super(props);
        this.state = {selectedTab: 0};
    }
    render() {
        var {children, ...props} = this.props;
        return (
            <NVTabBar
                {...props}
                onTabSelected={({nativeEvent}) => {
                    this.setState({selectedTab: nativeEvent.tab})
                }}
                style={styles.tabBar}>
                    {React.Children.map(children, (child: any, index) => {
                        var selected = index === this.state.selectedTab;
                        return React.cloneElement(child, {...child.props, selected});
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
