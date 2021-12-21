import React from 'react';
import {View, TouchableHighlight, Image, StyleSheet} from 'react-native';

declare module 'react-native' {
    interface ViewProps {
      href?: string;
      accessibilityRole?: string;
    }
  }

class TabBar extends React.Component<any, any> {
    constructor(props) {
        super(props);
        this.state = {selectedTab: props.tab || props.defaultTab};
    }
    static defaultProps = {
        defaultTab: 0,
        barTintColor: '#fff',
        selectedTintColor: '#000',
        unselectedTintColor: '#808080'
    }
    static getDerivedStateFromProps({tab}, {selectedTab}) {
        if (tab != null && tab !== selectedTab)
            return {selectedTab: tab};
        return null;
    }
    changeTab(selectedTab, e) {
        var {tab, onChangeTab} = this.props;
        if (this.state.selectedTab !== selectedTab) {
            if (tab == null)
                this.setState({selectedTab});
            if (!!onChangeTab)
                onChangeTab(selectedTab, e);
            return true;
        }
        return false;
    }
    render() {
        var {children, barTintColor, selectedTintColor, unselectedTintColor} = this.props;
        var childrenArray = React.Children.toArray(children);
        return (
            <>
                {childrenArray.map((child, i) => (
                    <View key={i} style={{display: i === this.state.selectedTab ? 'flex' : 'none', flex: 1}}>
                        {child}
                    </View>
                ))}
                <View style={{flexDirection: 'row'}}>
                    {childrenArray.map(({props: {image, title, href}}: any, i) => (
                        <TouchableHighlight key={i} onPress={(e) => this.changeTab(i, e)} style={{flex: 1}}>
                            <View href={href} style={[styles.tab, {backgroundColor: barTintColor}]}>
                                <Image
                                    source={image}
                                    accessibilityLabel={title}
                                    style={{width: 24, height: 24, tintColor: i === this.state.selectedTab ? selectedTintColor : unselectedTintColor}}
                                />
                            </View>
                        </TouchableHighlight>
                    ))}
                </View>
            </>
        );
    }
}

const styles = StyleSheet.create({
    tab: {
        justifyContent: 'center',
        alignItems: 'center',
        height: 56,
    },
});

export default TabBar;
