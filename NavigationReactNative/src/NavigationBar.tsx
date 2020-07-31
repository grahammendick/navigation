import React, { ReactElement } from 'react';
import { requireNativeComponent, Image, Platform, UIManager, Animated } from 'react-native';
import LeftBar from './LeftBar';
import RightBar from './RightBar';
import SearchBar from './SearchBar';
import TitleBar from './TitleBar';
import CollapsingBar from './CollapsingBar';
import TabBar from './TabBar';

class NavigationBar extends React.Component<any, any> {
    constructor(props) {
        super(props);
    }
    render() {
        var {hidden, logo, navigationImage, overflowImage, children, style = {height: undefined}, ...otherProps} = this.props;
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
        var collapsingBar = childrenArray.find(({type}) => type === CollapsingBar);
        var tabBar = childrenArray.find(({type}) => type === TabBar);
        tabBar = !collapsingBar ? tabBar : collapsingBar.props.children.find(({type}) => type === TabBar);
        var marginBottom = (collapsingBar && tabBar) ? (!tabBar.props.hasImages ? 48 : 72) : null;
        return (
            <>
                <NVNavigationBar
                    hidden={hidden}
                    style={{height: Platform.OS === 'android' && collapsingBar ? style.height : null}}
                    {...otherProps}>
                    {Platform.OS === 'ios' ? children :
                        <Container
                            collapse={!!collapsingBar}
                            {...otherProps}
                            {...(collapsingBar && collapsingBar.props)}>
                            {collapsingBar && collapsingBar.props.children}
                            <NVToolbar
                                menuItems={menuItems}
                                logo={Image.resolveAssetSource(logo)}
                                navigationImage={Image.resolveAssetSource(navigationImage)}
                                overflowImage={Image.resolveAssetSource(overflowImage)}
                                pin={!!collapsingBar}
                                {...otherProps}
                                barTintColor={!collapsingBar ? otherProps.barTintColor : null}
                                style={{height: 56, marginBottom}}
                                onActionSelected={({nativeEvent}) => {
                                    var onPress = menuItems[nativeEvent.position].onPress;
                                    if (onPress)
                                        onPress();
                                }}>
                                {childrenArray.find(({type}) => type === TitleBar)}
                            </NVToolbar>
                            {tabBar}
                        </Container>}
                </NVNavigationBar>
                {Platform.OS === 'ios' ? null : childrenArray.find(({type}) => type === SearchBar)}
            </>
        )
    }
}

var Container: any = ({collapse, children, ...props}) => (
    !collapse ? children : <CollapsingBar {...props}>{children}</CollapsingBar>
)

var NVNavigationBar = requireNativeComponent<any>('NVNavigationBar', null);
var NVToolbar = requireNativeComponent<any>('NVToolbar', null);

export default Animated.createAnimatedComponent(NavigationBar);