import React from 'react';
import {View, TouchableHighlight, Image, StyleSheet} from 'react-native';

class TabBar extends React.Component<any, any> {
    constructor(props) {
        super(props);
        this.state = {selectedTab: props.tab || props.defaultTab};
    }
    static defaultProps = {
        defaultTab: 0,
    }
    static getDerivedStateFromProps({tab}, {selectedTab}) {
        if (tab != null && tab !== selectedTab)
            return {selectedTab: tab};
        return null;
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
        var {children} = this.props;
        var childrenArray = React.Children.toArray(children);
        return (
            <>
                {childrenArray.map((child, i) => (
                    <View key={i} style={{display: i === this.state.selectedTab ? 'flex' : 'none', flex: 1}}>
                        {child}
                    </View>
                ))}
                <View style={styles.tabLayout}>
                    {childrenArray.map((child: any, i) => (
                        <TouchableHighlight key={i} onPress={() => this.changeTab(i)}>
                            <Image source={child.props.image} />
                        </TouchableHighlight>
                    ))}
                </View>
            </>
        );
    }
}

const styles = StyleSheet.create({
    tabLayout: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center'
    },
});


export default TabBar;