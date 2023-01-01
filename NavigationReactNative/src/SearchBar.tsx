import React, {useState} from 'react';
import { requireNativeComponent, Platform, StyleSheet, UIManager, NativeModules } from 'react-native';

const SearchBar = ({obscureBackground = true, hideNavigationBar= true, hideWhenScrolling = false, autoCapitalize = 'sentences', onChangeText,
    placeholder = Platform.OS === 'ios' ? 'Search' : undefined, children, bottomBar, scopeButton, scopeButtons, onChangeScopeButton, toolbar, ...props}) => {
    const [show, setShow] = useState(false);
    const [mostRecentEventCount, setMostRecentEventCount] = useState(0);
    const [mostRecentButtonEventCount, setMostRecentButtonEventCount] = useState(0);
    const changeText = ({nativeEvent}) => {
        var {eventCount: mostRecentEventCount, text} = nativeEvent;
        setMostRecentEventCount(mostRecentEventCount);
        if (onChangeText)
            onChangeText(text)
    }
    const changeScopeButton = ({nativeEvent}) => {
        var {eventCount: mostRecentButtonEventCount, scopeButton} = nativeEvent;
        setMostRecentButtonEventCount(mostRecentButtonEventCount);
        if (onChangeScopeButton)
            onChangeScopeButton(scopeButtons[scopeButton])
    }
    const Material3 = global.__turboModuleProxy != null ? require("./NativeMaterial3Module").default : NativeModules.Material3;
    const { on: material3 } = Platform.OS === 'android' ? Material3.getConstants() : { on: false };
    const constants = (UIManager as any).getViewManagerConfig('NVSearchBar').Constants;
    autoCapitalize = Platform.OS === 'android' ? constants.AutoCapitalize[autoCapitalize] : autoCapitalize;
    const top = !bottomBar && !toolbar ? (!material3 ? 56 : 64) : 0;
    const bottom= !bottomBar ? 0: (!material3 ? 56 : 88);
    const showStyle = Platform.OS === 'android' && {top, bottom, zIndex: show ? 58 : -58};
    const SearchBar = Platform.OS === 'ios' || !toolbar ? NVSearchBar : NVSearchResults;
    return (
        <SearchBar
            {...props}
            placeholder={placeholder}
            bottomBar={bottomBar}
            obscureBackground={obscureBackground}
            hideNavigationBar={hideNavigationBar}
            hideWhenScrolling={hideWhenScrolling}
            autoCapitalize={'' + autoCapitalize}
            scopeButton={scopeButton ? scopeButtons?.indexOf(scopeButton) : 0}
            scopeButtons={scopeButtons}
            mostRecentEventCount={mostRecentEventCount}
            mostRecentButtonEventCount={mostRecentButtonEventCount}
            onChangeText={changeText}
            onChangeScopeButton={changeScopeButton}
            onExpand={() => setShow(true)}
            onCollapse={() => setShow(false)}
            style={[styles.searchBar, showStyle]}>
            {children}
        </SearchBar>
    );
};

var NVSearchBar = global.nativeFabricUIManager ? require('./SearchBarNativeComponent').default : requireNativeComponent('NVSearchBar');
var NVSearchResults = global.nativeFabricUIManager ? require('./SearchBarNativeComponent').default : requireNativeComponent('NVSearchResults');

var styles = StyleSheet.create({
    searchBar: {
        position: 'absolute',
        ...Platform.select({
            android: {                
                right: 0, left: 0,
            },
        })
    },
});

export default SearchBar;
