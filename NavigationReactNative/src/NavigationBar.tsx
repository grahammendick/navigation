import React, { ReactElement } from 'react';
import { requireNativeComponent, Image, Platform, UIManager } from 'react-native';
import LeftBar from './LeftBar';
import RightBar from './RightBar';
import SearchBar from './SearchBar';
import TitleBar from './TitleBar';
import CollapsingBar from './CollapsingBar';

var NavigationBar = ({hidden, title, logo, navigationImage, overflowImage, scrollFlags = [], children, style, ...otherProps}) => {
    if (Platform.OS === 'android' && hidden)
        return null
    var constants = (UIManager as any).getViewManagerConfig('NVNavigationBar').Constants;
    var childrenArray = (React.Children.toArray(children) as ReactElement<any>[]);
    var menuItems = childrenArray
        .filter(({type}) => (type === LeftBar || type === RightBar))
        .sort((a, b) => (a.type === b.type ? 0 : (a.type === RightBar ? 1 : -1)))
        .reduce((buttons, {props}) => (
            buttons.concat((React.Children.toArray(props.children))
                .map(({props}: ReactElement<any>) => ({
                    ...props,
                    show: Platform.OS === 'android' ? constants.ShowAsAction[props.show] : undefined,
                    image: Image.resolveAssetSource(props.image),
                })
            ))
        ), []);
    var flags = (typeof scrollFlags === 'string' ? [scrollFlags] : scrollFlags)
        .reduce((flags, flag) => flags | constants.ScrollFlag[flag], 0);
    var collapsingBar = childrenArray.find(({type}) => type === CollapsingBar);
    var Container = ({children}) => (
        collapsingBar ? <CollapsingBar title={title}>{children}</CollapsingBar> : children
    )
    return (
        <>
            <NVNavigationBar
                hidden={hidden}
                {...otherProps}
                style={Platform.OS === 'android' ? {height: 56} : undefined}>
                {Platform.OS === 'ios' ? children :
                    <Container>
                        {collapsingBar && collapsingBar.props.children}
                        <NVToolbar
                            menuItems={menuItems}
                            logo={Image.resolveAssetSource(logo)}
                            navigationImage={Image.resolveAssetSource(navigationImage)}
                            overflowImage={Image.resolveAssetSource(overflowImage)}
                            scrollFlags={flags}
                            {...otherProps}
                            style={{height: 56}}
                            onActionSelected={({nativeEvent}) => {
                                var onPress = menuItems[nativeEvent.position].onPress;
                                if (onPress)
                                    onPress();
                            }}>
                            {childrenArray.find(({type}) => type === TitleBar)}
                        </NVToolbar>
                    </Container>}
            </NVNavigationBar>
            {Platform.OS === 'ios' ? null : childrenArray.find(({type}) => type === SearchBar)}
        </>
    )
}

var NVNavigationBar = requireNativeComponent<any>('NVNavigationBar', null);
var NVToolbar = requireNativeComponent<any>('NVToolbar', null);

export default NavigationBar;