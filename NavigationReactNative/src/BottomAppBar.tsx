import React, { cloneElement, ReactElement, useContext } from 'react';
import { Platform, Image, requireNativeComponent, NativeModules } from 'react-native';
import { NavigationContext } from 'navigation-react';
import SearchBar from './SearchBar';

const BottomAppBar = ({ navigationImage, overflowImage, onNavigationPress, children, style, ...props }: any) => {
    const navigationEvent = useContext(NavigationContext);
    var {stateNavigator} = navigationEvent;
    var crumb = stateNavigator.stateContext.crumbs.length;
    if (Platform.OS === 'ios') return null;
    const Material3 = global.__turboModuleProxy != null ? require("./NativeMaterial3Module").default : NativeModules.Material3;
    const { on: material3 } = Platform.OS === 'android' ? Material3.getConstants() : { on: false };
    var childrenArray = (React.Children.toArray(children) as ReactElement<any>[]);
    var searchBar: any = childrenArray.find(({type}) => type === SearchBar);
    searchBar = searchBar && cloneElement(searchBar, { bottomBar: true });
    return (
        <>
            <NVBottomAppBar
                crumb={crumb}
                autoNavigation={!onNavigationPress}
                navigationImage={Image.resolveAssetSource(navigationImage)}
                overflowImage={Image.resolveAssetSource(overflowImage)}
                barHeight={!material3 ? 56 : 80}
                style={{height: !material3 ? 56 : 80}}
                {...props}
                onNavigationPress={() => {
                    if (onNavigationPress) onNavigationPress();
                    else if (crumb > 0) stateNavigator.navigateBack(1);
                }}>
                {childrenArray.filter(({type}) => type !== SearchBar)}
            </NVBottomAppBar>
            {searchBar}
        </>
    );
}

var NVBottomAppBar = global.nativeFabricUIManager ? require('./BottomAppBarNativeComponent').default : requireNativeComponent('NVBottomAppBar');

export default BottomAppBar;
