import React from 'react';
import { View } from 'react-native';

const TabBarItem = ({selected, children}) => {
    return (
        <View style={{display: selected ? 'flex' : 'none', flex: 1}}>
            {children}
        </View>
    )
};

export default TabBarItem;
