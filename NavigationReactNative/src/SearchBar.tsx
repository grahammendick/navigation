import React, {useState} from 'react';
import { requireNativeComponent, Platform, StyleSheet, UIManager, NativeModules } from 'react-native';

const SearchBar = ({obscureBackground = true, hideNavigationBar= true, hideWhenScrolling = false, autoCapitalize = 'sentences',
    barTintColor, onChangeText, placeholder = Platform.OS === 'ios' ? 'Search' : undefined as any, children, bottomBar,
    active, onChangeActive, scopeButton, scopeButtons, onChangeScopeButton, toolbar, ...props}) => {
    const [show, setShow] = useState(false);
    const [mostRecentEventCount, setMostRecentEventCount] = useState(0);
    const [mostRecentButtonEventCount, setMostRecentButtonEventCount] = useState(0);
    const [mostRecentActiveEventCount, setMostRecentActiveEventCount] = useState(0);
    const changeText = ({nativeEvent}) => {
        const {eventCount: mostRecentEventCount, text} = nativeEvent;
        setMostRecentEventCount(mostRecentEventCount);
        if (onChangeText)
            onChangeText(text)
    }
    if (active != null && show !== active) setShow(active);
    const onChangeShow = ({nativeEvent}) => {
        const {eventCount: mostRecentActiveCount, active: newActive} = nativeEvent;
        setMostRecentActiveEventCount(mostRecentActiveCount);
        if (show !== newActive) {
            if (active == null)
                setShow(newActive);
            if (!!onChangeActive)
                onChangeActive(newActive);
        }
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
    const bottom= !bottomBar ? 0: (!material3 ? 56 : 80);
    const showStyle = Platform.OS === 'android' && {top, bottom, zIndex: show ? 58 : -58};
    const SearchBar = Platform.OS === 'ios' || !toolbar ? NVSearchBar : NVSearchResults;
    barTintColor = typeof barTintColor === 'function' ? barTintColor(!toolbar) : barTintColor;
    placeholder = typeof placeholder === 'function' ? placeholder(!toolbar) : placeholder;
    return (
        <SearchBar
            {...props}
            active={show}
            placeholder={placeholder}
            bottomBar={bottomBar}
            barTintColor={barTintColor}
            obscureBackground={obscureBackground}
            hideNavigationBar={hideNavigationBar}
            hideWhenScrolling={hideWhenScrolling}
            autoCapitalize={'' + autoCapitalize}
            scopeButton={scopeButton ? scopeButtons?.indexOf(scopeButton) : 0}
            scopeButtons={scopeButtons}
            mostRecentEventCount={mostRecentEventCount}
            mostRecentActiveEventCount={mostRecentActiveEventCount}
            mostRecentButtonEventCount={mostRecentButtonEventCount}
            onChangeText={changeText}
            onChangeActive={onChangeShow}
            onChangeScopeButton={changeScopeButton}
            style={[styles.searchBar, showStyle]}>
            {children}
        </SearchBar>
    );
};

var NVSearchBar = global.nativeFabricUIManager ? require('./SearchBarNativeComponent').default : requireNativeComponent('NVSearchBar');
var NVSearchResults = global.nativeFabricUIManager ? require('./SearchResultsNativeComponent').default : requireNativeComponent('NVSearchResults');

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
