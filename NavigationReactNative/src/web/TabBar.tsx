import React, {useState, useContext, useEffect} from 'react';
import {View, TouchableHighlight, Image, StyleSheet} from 'react-native';
import {NavigationContext} from 'navigation-react';

const TabBar = ({children, defaultTab = 0, tab, onChangeTab}) => {
    const {data} = useContext(NavigationContext);
    const [selectedTab, setSelectedTab] = useState(tab || (data.tab != null ? data.tab : defaultTab));
    useEffect(() => {
        if (tab != null)
            setSelectedTab(tab)
    }, [tab]);
    const changeTab = (i) => {
        if (selectedTab !== i) {
            if (tab == null)
                setSelectedTab({i});
            if (!!onChangeTab)
                onChangeTab(i);
        }
    }
    return (
        <>
            {React.Children.toArray(children)
                .map((child, i) => (
                    <View key={i} style={{display: i === selectedTab ? 'flex' : 'none', flex: 1}}>
                        {child}
                    </View>
                ))}
            <View style={styles.tabLayout}>
                {React.Children.toArray(children)
                    .map((child: any, i) => (
                        <TouchableHighlight key={i} onPress={() => changeTab(i)}>
                            <Image source={child.props.image} />
                        </TouchableHighlight>
                    ))}
            </View>
          </>
    );
}

const styles = StyleSheet.create({
    tabLayout: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center'
    },
});


export default TabBar;