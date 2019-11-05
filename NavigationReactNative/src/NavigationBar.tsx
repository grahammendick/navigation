import React, { ReactElement } from 'react';
import { requireNativeComponent, Image, Platform, UIManager } from 'react-native';
import LeftBar from './LeftBar';
import RightBar from './RightBar';
import SearchBar from './SearchBar';
import TitleBar from './TitleBar';

var NavigationBar = ({hidden, logo, navigationImage, overflowImage, children, style, ...otherProps}) => {
    if (Platform.OS === 'android' && hidden)
        return null
    var constants = (UIManager as any).getViewManagerConfig('NVNavigationBar').Constants;
    var childrenArray = (React.Children.toArray(children) as ReactElement<any>[]);
    var menuItems = childrenArray
        .filter(({type}) => (type === LeftBar || type === RightBar))
        .sort((a, b) => (a.type === b.type ? 0 : (a.type === RightBar ? 1 : -1)))
        .map(({props}) => (
            (React.Children.toArray(props.children) as ReactElement<any>[])
                .map(({props}) => ({
                    ...props,
                    show: Platform.OS === 'android' ? constants.ShowAsAction[props.show] : undefined,
                    image: Image.resolveAssetSource(props.image),
                })
            )
        ))
        .reduce((a, b) => a.concat(b), [])
    return (
        <>
            <NVNavigationBar
                menuItems={menuItems}
                logo={Image.resolveAssetSource(logo)}
                navigationImage={Image.resolveAssetSource(navigationImage)}
                overflowImage={Image.resolveAssetSource(overflowImage)}
                style={Platform.OS === 'android' ? {height: 56} : undefined}
                hidden={hidden}
                {...otherProps}
                onActionSelected={({nativeEvent}) => {
                    var onPress = menuItems[nativeEvent.position].onPress;
                    if (onPress)
                        onPress();
            }}>
                {childrenArray.find(({type}) => type === TitleBar)}
            </NVNavigationBar>
            {childrenArray.find(({type}) => type === SearchBar)}
        </>
    )
}

var NVNavigationBar = requireNativeComponent<any>('NVNavigationBar', null);

export default NavigationBar;