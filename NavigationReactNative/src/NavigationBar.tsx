import React, { ReactElement } from 'react';
import { requireNativeComponent, Image, Platform, Animated, NativeModules } from 'react-native';
import { NavigationContext } from 'navigation-react';
import LeftBar from './LeftBar';
import RightBar from './RightBar';
import SearchBar from './SearchBar';
import TitleBar from './TitleBar';
import CollapsingBar from './CollapsingBar';
import TabBar from './TabBar';
import StatusBar from './StatusBar';
import BottomAppBar from './BottomAppBar';
import InsetsContext from './InsetsContext';
import OverlapContext from './OverlapContext';

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
        var {navigationEvent, bottomBar, hidden, logo, navigationImage, overflowImage, backTitle, backImage, titleCentered, shadowColor, insets, overlap, children, onNavigationPress, style = {height: undefined}, ...otherProps} = this.props;
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
        var collapsingBar = Platform.OS === 'android' && !searchToolbar && childrenArray.find(({type}) => type === CollapsingBar);
        var searchBar = childrenArray.find(({type}) => type === SearchBar);
        var searchToolbar = !!searchBar?.props.toolbar;
        var Toolbar = !searchToolbar ? NVToolbar : NVSearchToolbar;
        var searchBarTintColor = searchBar?.props.barTintColor;
        searchBarTintColor = typeof searchBarTintColor === 'function' ? searchBarTintColor(true) : searchBarTintColor;
        var toolbarTintColor = searchToolbar ? searchBarTintColor : scrollEdgeProps.barTintColor;
        var placeholder = searchBar?.props.placeholder;
        var {stateNavigator} = navigationEvent;
        var crumb = stateNavigator.stateContext.crumbs.length;
        const toolbarHeight = !material3 || searchToolbar ? 56 : 64;
        const barHeight = toolbarHeight + (searchToolbar ? 32 : 0);
        return (
            <>
                <NVNavigationBar
                    crumb={crumb}
                    isHidden={hidden}
                    backTitle={backTitle}
                    backTitleOn={backTitle !== undefined}
                    backImage={Image.resolveAssetSource(backImage)}
                    barHeight={!!collapsingBar ? style.height : barHeight}
                    includeInset={!collapsingBar}
                    overlap={overlap}
                    style={{height: !!collapsingBar ? style.height - overlap : Platform.OS === 'android' ? barHeight + insets.top : null}}
                    {...otherProps}
                    {...scrollEdgeProps}
                    shadowColor={shadowColor}
                    barTintColor={!collapsingBar ? scrollEdgeProps.barTintColor : scrollEdgeProps.largeBarTintColor}>
                    {Platform.OS === 'ios' ? !hidden && children :
                        <Container
                            collapse={!!collapsingBar}
                            {...otherProps}
                            {...scrollEdgeProps}
                            {...(collapsingBar && collapsingBar.props)}>
                            {collapsingBar && collapsingBar.props.children}
                            <Toolbar
                                crumb={crumb}
                                autoNavigation={!onNavigationPress}
                                logo={Image.resolveAssetSource(logo)}
                                navigationImage={Image.resolveAssetSource(navigationImage)}
                                overflowImage={Image.resolveAssetSource(overflowImage)}
                                pin={!!collapsingBar}
                                {...otherProps}
                                {...scrollEdgeProps}
                                barTintColor={!collapsingBar ? toolbarTintColor : null}
                                placeholder={typeof placeholder === 'function' ? placeholder(true) : placeholder}
                                fontFamily={searchBar?.props.fontFamily}
                                fontWeight={searchBar?.props.fontWeight}
                                fontStyle={searchBar?.props.fontStyle}
                                fontSize={searchBar?.props.fontSize}
                                titleCentered={!!titleCentered}
                                barHeight={toolbarHeight}
                                onNavigationPress={() => {
                                    if (onNavigationPress) onNavigationPress();
                                    else if (crumb > 0) stateNavigator.navigateBack(1);
                                }}
                                style={{height: toolbarHeight, margin: searchToolbar ? 16 : undefined}}>
                                {[
                                    !searchToolbar && childrenArray.find(({type}) => type === TitleBar),
                                    childrenArray.find(({type}) => type === LeftBar),
                                    childrenArray.find(({type}) => type === RightBar)
                                ]}
                            </Toolbar>
                            {!searchToolbar && childrenArray.find(({type}) => type === TabBar)}
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
var NVSearchToolbar = global.nativeFabricUIManager ? require('./SearchToolbarNativeComponent').default : requireNativeComponent('NVSearchToolbar');


const AnimatedNavigationBar =  Animated.createAnimatedComponent(NavigationBar);

export default props => (
    <InsetsContext.Consumer>
        {(insets) => (
            <OverlapContext.Consumer>
                {(overlap) => (
                    <NavigationContext.Consumer>
                        {(navigationEvent) => (
                            <AnimatedNavigationBar
                                navigationEvent={navigationEvent} insets={insets} overlap={overlap} {...props} />
                        )}
                    </NavigationContext.Consumer>
                )}
            </OverlapContext.Consumer>
        )}
    </InsetsContext.Consumer>
);
