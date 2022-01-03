import React from 'react';
import { View, TouchableHighlight, Image, Text, StyleSheet } from 'react-native';

declare module 'react-native' {
    interface TouchableHighlightProps {
      href?: string;
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
        } else {
            if (!e.ctrlKey && !e.shiftKey && !e.metaKey && !e.altKey && !e.button)
                e.preventDefault();
        }
    }
    render() {
        var {children, barTintColor, selectedTintColor, unselectedTintColor} = this.props;
        var childrenArray = React.Children.toArray(children);
        var tabBarItems = React.Children.toArray(children).filter(child => !!child);
        var titleOrimageOnly = !tabBarItems.find(({props}: any) => props.title && props.image);
        return (
            <>
                {childrenArray.map((child, i) => (
                    <View key={i} style={{display: i === this.state.selectedTab ? 'flex' : 'none', flex: 1}}>
                        {child}
                    </View>
                ))}
                <View style={{flexDirection: 'row'}}>
                    {childrenArray.map(({props: {image, title, href}}: any, i) => (
                        <TouchableHighlight key={i} href={href} onPress={(e) => this.changeTab(i, e)} style={{flex: 1}}>
                            <View style={[styles.tab, {backgroundColor: barTintColor, paddingTop: titleOrimageOnly ? 16 : 8}]}>
                                <Image
                                    source={image}
                                    accessibilityLabel={title}
                                    style={{width: 24, height: 24, tintColor: i === this.state.selectedTab ? selectedTintColor : unselectedTintColor}}
                                />
                                {title && (
                                    <Text style={{fontSize: 12, lineHeight: 12, color: i === this.state.selectedTab ? selectedTintColor : unselectedTintColor}}>{title}</Text>
                                )}
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
        alignItems: 'center',
        height: 56,
    },
});

export default TabBar;
