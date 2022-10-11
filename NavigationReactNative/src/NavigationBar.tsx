import React, { ReactElement } from 'react';
import { requireNativeComponent, Image, Platform, Animated, NativeModules } from 'react-native';
import LeftBar from './LeftBar';
import RightBar from './RightBar';
import SearchBar from './SearchBar';
import TitleBar from './TitleBar';
import CollapsingBar from './CollapsingBar';
import TabBar from './TabBar';
import StatusBar from './StatusBar';
import BottomAppBar from './BottomAppBar';

class NavigationBar extends React.Component<any, any> {
    constructor(props) {
        super(props);
    }
    getScrollEdgeProps() {
        var {barTintColor, titleColor, titleFontFamily, titleFontWeight, titleFontStyle, titleFontSize } = this.props;
        return {
            barTintColor: typeof barTintColor === 'function' ? barTintColor(true) : barTintColor,
            largeBarTintColor: typeof barTintColor === 'function' ? barTintColor(false) : barTintColor,
            titleColor: typeof titleColor === 'function' ? titleColor(true) : titleColor,
            largeTitleColor: typeof titleColor === 'function' ? titleColor(false) : titleColor,
            titleFontFamily: typeof titleFontFamily === 'function' ? titleFontFamily(true) : titleFontFamily,
            largeTitleFontFamily: typeof titleFontFamily === 'function' ? titleFontFamily(false) : titleFontFamily,
            titleFontWeight: typeof titleFontWeight === 'function' ? titleFontWeight(true) : titleFontWeight,
            largeTitleFontWeight: typeof titleFontWeight === 'function' ? titleFontWeight(false) : titleFontWeight,
            titleFontStyle: typeof titleFontStyle === 'function' ? titleFontStyle(true) : titleFontStyle,
            largeTitleFontStyle: typeof titleFontStyle === 'function' ? titleFontStyle(false) : titleFontStyle,
            titleFontSize: typeof titleFontSize === 'function' ? titleFontSize(true) : titleFontSize,
            largeTitleFontSize: typeof titleFontSize === 'function' ? titleFontSize(false) : null,
        }
    }
    render() {
        var {bottomBar, hidden, logo, navigationImage, overflowImage, backTitle, backImage, titleCentered, children, style = {height: undefined}, ...otherProps} = this.props;
        const Material3 = global.__turboModuleProxy != null ? require("./NativeMaterial3Module").default : NativeModules.Material3;
        const { on: material3 } = Platform.OS === 'android' ? Material3.getConstants() : { on: false };
        var scrollEdgeProps = this.getScrollEdgeProps()
        var childrenArray = (React.Children.toArray(children) as ReactElement<any>[]);
        var statusBar = childrenArray.find(({type}) => type === StatusBar);
        statusBar = (Platform.OS === 'android' || !statusBar) && (statusBar || <StatusBar />);
        if (Platform.OS === 'android' && hidden)
            return statusBar;
        if (bottomBar)
            return <BottomAppBar {...this.props} />
        var collapsingBar = Platform.OS === 'android' && childrenArray.find(({type}) => type === CollapsingBar);
        return (
            <>
                <NVNavigationBar
                    hidden={hidden}
                    backTitle={backTitle}
                    backTitleOn={backTitle !== undefined}
                    backImage={Image.resolveAssetSource(backImage)}
                    barHeight={!!collapsingBar ? style.height : 0}
                    style={{height: !!collapsingBar ? style.height : null}}
                    {...otherProps}
                    {...scrollEdgeProps}
                    barTintColor={!collapsingBar ? scrollEdgeProps.barTintColor : scrollEdgeProps.largeBarTintColor}>
                    {Platform.OS === 'ios' ? !hidden && children :
                        <Container
                            collapse={!!collapsingBar}
                            {...otherProps}
                            {...scrollEdgeProps}
                            {...(collapsingBar && collapsingBar.props)}>
                            {collapsingBar && collapsingBar.props.children}
                            <NVToolbar
                                logo={Image.resolveAssetSource(logo)}
                                navigationImage={Image.resolveAssetSource(navigationImage)}
                                overflowImage={Image.resolveAssetSource(overflowImage)}
                                pin={!!collapsingBar}
                                {...otherProps}
                                {...scrollEdgeProps}
                                barTintColor={!collapsingBar ? scrollEdgeProps.barTintColor : null}
                                titleCentered={!!titleCentered}
                                barHeight={!material3 ? 56 : 64}
                                style={{height: !material3 ? 56 : 64}}>
                                {[
                                    childrenArray.find(({type}) => type === TitleBar),
                                    childrenArray.find(({type}) => type === LeftBar),
                                    childrenArray.find(({type}) => type === RightBar)
                                ]}
                            </NVToolbar>
                            {childrenArray.find(({type}) => type === TabBar)}
                        </Container>}
                    {Platform.OS === 'ios' && statusBar}
                </NVNavigationBar>
                {Platform.OS === 'android' && statusBar}
                {Platform.OS === 'ios' ? null : childrenArray.find(({type}) => type === SearchBar)}
            </>
        )
    }
}

var Container: any = ({collapse, children, ...props}) => (
    !collapse ? children : <CollapsingBar {...props}>{children}</CollapsingBar>
)

var NVNavigationBar = global.nativeFabricUIManager ? require('./NavigationBarNativeComponent').default : requireNativeComponent('NVNavigationBar');
var NVToolbar = global.nativeFabricUIManager ? require('./ToolbarNativeComponent').default : requireNativeComponent('NVToolbar');

export default Animated.createAnimatedComponent(NavigationBar);
