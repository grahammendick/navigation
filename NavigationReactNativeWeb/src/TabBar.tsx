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
        unselectedTintColor: '#808080',
        primary: false
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
        var {children, barTintColor, selectedTintColor, unselectedTintColor, bottomTabs, primary} = this.props;
        bottomTabs = bottomTabs != null ? bottomTabs : primary;
        var tabBarItems = React.Children.toArray(children).filter(child => !!child);
        var titleOrImageOnly = !tabBarItems.find(({props}: any) => props.title && props.image);
        var height = !primary ? (titleOrImageOnly ? 48 : 72) : 56;
        var paddingTop = !primary ? 12 : (titleOrImageOnly ? 16 : 8);
        var tabLayout = (
            <View style={{flexDirection: 'row'}}>
                {tabBarItems.map(({props: {image, title, fontFamily, fontWeight, fontStyle, fontSize = 12, href}}: any, i) => {
                    var color = i === this.state.selectedTab ? selectedTintColor : unselectedTintColor;
                    var highlight = !primary && i === this.state.selectedTab;
                    return (
                        <TouchableHighlight key={i} href={href} onPress={(e) => this.changeTab(i, e)} style={{flex: 1}}>
                            <View style={{alignItems: 'center', height, backgroundColor: barTintColor, paddingTop, borderBottomWidth: highlight ? 2 : 0, borderBottomColor: highlight ? color : undefined}}>
                                {(primary || !titleOrImageOnly || image) && (
                                    <Image source={image} accessibilityLabel={title} style={{width: 24, height: 24, tintColor: color}} />
                                )}
                                {title && (
                                    <Text style={{textTransform: !primary ? 'uppercase' : undefined, fontFamily, fontWeight, fontStyle, fontSize, lineHeight: !primary ? 20 : 12, marginTop: !primary ? 4 : 0, color: color}}>{title}</Text>
                                )}
                            </View>
                        </TouchableHighlight>
                    )
                })}
            </View>
        )
        return (
            <>
                {!bottomTabs && tabLayout}
                {tabBarItems.map((child, i) => (
                    <View key={i} style={{display: i === this.state.selectedTab ? 'flex' : 'none', flex: 1}}>
                        {child}
                    </View>
                ))}
                {bottomTabs && tabLayout}
            </>
        );
    }
}

export default TabBar;
