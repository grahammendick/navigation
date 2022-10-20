import React, { useRef, useState } from 'react';
import { View } from 'react-native';
import TabBarItemContext from './TabBarItemContext';
import Freeze from './Freeze';

const TabBarItem = ({selected, lazy = false, children}) => {
    const [loaded, setLoaded] = useState(selected || lazy);
    const onLoad = useRef({ onLoad: () => setLoaded(true)});
    if (!loaded && selected) setLoaded(true);
    return (
        <Freeze enabled={loaded && !selected}>
            <View style={{display: selected ? 'flex' : 'none', flex: 1}}>
                <TabBarItemContext.Provider value={onLoad.current}>
                    {children}
                </TabBarItemContext.Provider>
            </View>
        </Freeze>
    )
};

export default TabBarItem;
