import React, {ReactElement} from 'react';
import {requireNativeComponent, Image, Platform, UIManager} from 'react-native';
import LeftBar from './LeftBar';
import RightBar from './RightBar';

var NVNavigationBar = requireNativeComponent<any>('NVNavigationBar', null);
var NavigationBar = ({hidden, logo, navigationImage, overflowImage, children, ...otherProps}) => {
    if (Platform.OS === 'android' && hidden)
        return null
    var menuItems = (React.Children.toArray(children) as ReactElement<any>[])
        .filter(({type}) => (type === LeftBar || type === RightBar))
        .sort((a, b) => (a.type === b.type ? 0 : (a.type === RightBar ? 1 : -1)))
        .map(({props}) => (
            (React.Children.toArray(props.children) as ReactElement<any>[])
                .map(({props}) => ({
                    ...props,
                    show: Platform.OS === 'android'
                     ? UIManager.getViewManagerConfig('NVNavigationBar').Constants.ShowAsAction[props.show]
                     : undefined,
                    image: Image.resolveAssetSource(props.image),
                })
            )
        ))
        .reduce((a, b) => a.concat(b), [])
    return (
        <NVNavigationBar
            menuItems={menuItems}
            logo={Image.resolveAssetSource(logo)}
            navigationImage={Image.resolveAssetSource(navigationImage)}
            overflowImage={Image.resolveAssetSource(overflowImage)}
            style={Platform.OS === 'android' ? { height: 50 } : undefined}
            hidden={hidden}
            {...otherProps}
            onActionSelected={({nativeEvent}) => {
                var onPress = menuItems[nativeEvent.position].onPress;
                if (onPress)
                    onPress();
        }}>
            {children}
        </NVNavigationBar>
    )
}
export default NavigationBar;