import React, {useState, useContext, useEffect} from 'react';
import {View, TouchableHighlight, Image, StyleSheet} from 'react-native';
import {NavigationContext} from 'navigation-react';
import useNavigated from '../useNavigated';

const TabBar = ({children, defaultTab = 0, tab, onChangeTab}) => {
    const {data} = useContext(NavigationContext);
    const [selectedTab, setSelectedTab] = useState(data.tab != null ? data.tab : (tab || defaultTab));
    useNavigated(() => {
        if (selectedTab !== data.tab) {
            if (tab == null)
                setSelectedTab(data.tab)
            if (!!onChangeTab)
                onChangeTab(data.tab)
        }
    });
    useEffect(() => {
        setSelectedTab(tab)
    }, [tab]);
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
                        <TouchableHighlight key={i}>
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