import React from 'react';
import { requireNativeComponent, StyleSheet } from 'react-native';

class TabBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {selectedTab: 0};
    }
    render() {
        return (
            <NVTabBar
                {...this.props}
                onTabSelected={({nativeEvent}) => {
                    this.setState({selectedTab: nativeEvent.tab})
                }}
                style={styles.tabBar} />
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
