import React, { ReactElement } from 'react';
import { requireNativeComponent, Image, Platform, Animated } from 'react-native';
import LeftBar from './LeftBar';
import RightBar from './RightBar';
import SearchBar from './SearchBar';
import TitleBar from './TitleBar';
import CollapsingBar from './CollapsingBar';
import TabBar from './TabBar';
import StatusBar from './StatusBar';

class NavigationBar extends React.Component<any, any> {
    constructor(props) {
        super(props);
    }
    render() {
        var {hidden, logo, navigationImage, overflowImage, children, style = {height: undefined}, ...otherProps} = this.props;
        if (Platform.OS === 'android' && hidden)
            return null
        var childrenArray = (React.Children.toArray(children) as ReactElement<any>[]);
        var collapsingBar = childrenArray.find(({type}) => type === CollapsingBar);
        return (
            <>
                <NVNavigationBar
                    hidden={hidden}
                    style={{height: Platform.OS === 'android' && collapsingBar ? style.height : null}}
                    {...otherProps}>
                    {Platform.OS === 'ios' ? !hidden && children :
                        <Container
                            collapse={!!collapsingBar}
                            {...otherProps}
                            {...(collapsingBar && collapsingBar.props)}>
                            {collapsingBar && collapsingBar.props.children}
                            <NVToolbar
                                logo={Image.resolveAssetSource(logo)}
                                navigationImage={Image.resolveAssetSource(navigationImage)}
                                overflowImage={Image.resolveAssetSource(overflowImage)}
                                pin={!!collapsingBar}
                                {...otherProps}
                                barTintColor={!collapsingBar ? otherProps.barTintColor : null}
                                style={{height: 56}}>
                                {[
                                    childrenArray.find(({type}) => type === TitleBar),
                                    childrenArray.find(({type}) => type === LeftBar),
                                    childrenArray.find(({type}) => type === RightBar)
                                ]}
                            </NVToolbar>
                            {childrenArray.find(({type}) => type === TabBar)}
                        </Container>}
                        {childrenArray.find(({type}) => type === StatusBar)}
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