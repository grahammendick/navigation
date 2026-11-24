import React, { ReactNode } from 'react';
import { requireNativeComponent, StyleSheet } from 'react-native';
import { StateNavigator, State } from 'navigation';
import { NavigationContext, TransitionContext, RefetchContext, NavigationEvent } from 'navigation-react';
import BackButton from './BackButton';
import Freeze from './Freeze';
import OverlapContext from './OverlapContext';
type SceneProps = { crumb: number, url: string, sceneKey: string, rest: boolean, renderScene: (state: State, data: any) => ReactNode, customAnimation: boolean, crumbStyle: any, unmountStyle: any, hidesTabBar: any, backgroundColor: any, landscape: any, title: (state: State, data: any) => string, popped: (key: string) => void, primeRefetch: () => any, navigationEvent: NavigationEvent, navigationTransition: {navigationEvent: NavigationEvent, nextNavigationEvent: NavigationEvent}, refetchControl: any };
type SceneState = { navigationEvent: NavigationEvent, navigationTransition: {navigationEvent: NavigationEvent, nextNavigationEvent: NavigationEvent}, peekNavigationEvent: NavigationEvent };

class Scene extends React.Component<SceneProps, SceneState> {
    private timer: any;
    private offInvalidate: () => void;
    constructor(props) {
        super(props);
        this.state = {navigationEvent: null, navigationTransition: null, peekNavigationEvent: null};
        this.handleBack = this.handleBack.bind(this);
        this.onBeforeNavigate = this.onBeforeNavigate.bind(this);
        this.onNavigate = this.onNavigate.bind(this);
        this.checkStale = this.checkStale.bind(this);
    }
    static defaultProps = {
        title: (state: State) => state.title,
        renderScene: (state: State, data: any) => state.renderScene(data)
    }
    componentDidMount() {
        var {stateNavigator} = this.props.navigationEvent;
        stateNavigator.onBeforeNavigate(this.onBeforeNavigate);
        stateNavigator.onNavigate(this.onNavigate);
        this.offInvalidate = this.props.refetchControl?.onInvalidate?.(this.checkStale);
        this.backgroundPeekNavigate();
    }
    static getDerivedStateFromProps(props: SceneProps, {navigationEvent: stateNavigationEvent}: SceneState) {
        var {url, navigationEvent, navigationTransition} = props;
        var {url: currentUrl, state} = navigationEvent.stateNavigator.stateContext;
        if (!state || url !== currentUrl) return null;
        if (stateNavigationEvent?.['refetching']) {
            navigationEvent['ignoreCache'] = true;
            navigationEvent['rscCache'] = stateNavigationEvent['rscCache'] ||= {};
        }
        return {navigationEvent, navigationTransition};
    }
    shouldComponentUpdate({crumb, rest, navigationEvent: {stateNavigator}}: SceneProps, {navigationEvent}: SceneState) {
        var {crumbs} = stateNavigator.stateContext;
        var freezableOrCurrent = rest && (!!React.Suspense || crumbs.length === crumb);
        return freezableOrCurrent || navigationEvent !== this.state.navigationEvent || (this.fluentPeekable() && !this.timer);
    }
    componentDidUpdate() {
        this.backgroundPeekNavigate();
    }
    componentWillUnmount() {
        var {stateNavigator} = this.props.navigationEvent;
        stateNavigator.offBeforeNavigate(this.onBeforeNavigate);
        stateNavigator.offNavigate(this.onNavigate);
        this.offInvalidate?.();
        clearTimeout(this.timer);
    }
    fluentPeekable() {
        var {navigationEvent, crumb} = this.props;
        var {crumbs} = navigationEvent.stateNavigator.stateContext;
        return !this.state.navigationEvent && crumb === crumbs.length -1;
    }
    backgroundPeekNavigate() {
        return;
        if (this.fluentPeekable() && !this.timer) {
            this.timer = setTimeout(() => {
                if (this.fluentPeekable()) this.peekNavigate();
                else this.timer = null;
            }, 0);
        }
    }
    handleBack() {
        var {navigationEvent} = this.state;
        if (navigationEvent && navigationEvent.stateNavigator.canNavigateBack(1)) {
            navigationEvent.stateNavigator.navigateBack(1);
            return true;
        }
        return false;
    }
    onBeforeNavigate(_state, _data, url: string, history: boolean) {
        var {crumb} = this.props;
        if (url.split('crumb=').length - 1 === crumb)
            this.setState({peekNavigationEvent: this.props.navigationEvent});
        // if (url.split('crumb=').length - 1 === crumb && history)
        //     this.peekNavigate();
        return true;
    }
    onNavigate(_oldState, _state, _data, _asyncData, stateContext) {
        this.checkStale(stateContext);
    }
    checkStale(stateContext) {
        var {crumb, refetchControl} = this.props;
        var {navigationEvent} = this.state;
        if (navigationEvent && crumb === stateContext.crumbs.length - 1 && refetchControl?.isStale?.(crumb, navigationEvent.state.key)) {
            var refetchNavigationEvent = {...navigationEvent, ignoreCache: true, refetching: true, rscCache: undefined, rscFetching: this.props.primeRefetch(), rscFetch: undefined, trackable: undefined};
            React.startTransition(() => {
                this.setState({navigationEvent: refetchNavigationEvent, navigationTransition: {navigationEvent: refetchNavigationEvent, nextNavigationEvent: refetchNavigationEvent}});
            });
        }
    }
    peekNavigate() {
        var {crumb, navigationEvent} = this.props;
        var {crumbs} = navigationEvent.stateNavigator.stateContext;
        var {stateNavigator} = navigationEvent;
        var peekNavigator = new StateNavigator(stateNavigator, stateNavigator.historyManager);
        peekNavigator.navigateLink(crumbs[crumb].url);
        peekNavigator.stateContext['peek'] = navigationEvent;
        var {oldState, state, data, asyncData} = peekNavigator.stateContext;
        this.setState({navigationEvent: {oldState, state, data, asyncData, stateNavigator: peekNavigator}});
    }
    getAnimation() {
        var {crumb, navigationEvent, customAnimation, unmountStyle, crumbStyle, hidesTabBar, backgroundColor, landscape} = this.props;
        var {stateNavigator} = this.state.navigationEvent || navigationEvent;
        var {crumbs, nextCrumb} = stateNavigator.stateContext;
        var {state, data} = crumbs[crumb] || nextCrumb;
        var currentCrumbs = crumbs.slice(0, crumb);
        if (crumb > crumbs.length) return null;
        if (crumb > 0) {
            var {state: prevState, data: prevData} = crumbs[crumb - 1];
            var prevCrumbs = crumbs.slice(0, crumb - 1);
            var enterAnim = typeof crumbStyle === 'function' ? crumbStyle(true, prevState, prevData, prevCrumbs, state, data) : crumbStyle;
        }
        var exitAnim = typeof unmountStyle === 'function' ? unmountStyle(false, state, data, currentCrumbs) : unmountStyle;
        var hidesTabBar = hidesTabBar(state, data, currentCrumbs);
        var backgroundColor = backgroundColor(state, data, currentCrumbs) || '#fff';
        var landscape = landscape(state, data, currentCrumbs);
        let enterTrans = typeof enterAnim === 'string' ? null : enterAnim;
        let exitTrans = typeof exitAnim === 'string' ? null : exitAnim;
        enterTrans = !enterTrans?.type ? enterTrans : [enterTrans];
        exitTrans = !exitTrans?.type ? exitTrans : [exitTrans];
        enterTrans = !Array.isArray(enterTrans) ? enterTrans : {items: enterTrans};
        exitTrans = !Array.isArray(exitTrans) ? exitTrans : {items: exitTrans};
        const convertEnterTrans = ({type, axis, start, from, startX, fromX, startY, fromY, pivotX, pivotY, items, duration}) => ({
            type, axis,
            from: (start ?? from) !== undefined ? '' + (start ?? from) : undefined,
            fromX: (startX ?? fromX) !== undefined ? '' + (startX ?? fromX) : undefined,
            fromY: (startY ?? fromY) !== undefined ? '' + (startY ?? fromY) : undefined,
            pivotX: pivotX !== undefined ? '' + pivotX : undefined,
            pivotY: pivotY !== undefined ? '' + pivotY : undefined,
            duration: duration !== undefined ? '' + duration : undefined,
            items: items?.map(convertEnterTrans),
        })
        const convertExitTrans = ({type, axis, start, to, startX, toX, startY, toY, pivotX, pivotY, items, duration}) => ({
            type, axis,
            to: (start ?? to) !== undefined ? '' + (start ?? to) : undefined,
            toX: (startX ?? toX) !== undefined ? '' + (startX ?? toX) : undefined,
            toY: (startY ?? toY) !== undefined ? '' + (startY ?? toY) : undefined,
            pivotX: pivotX !== undefined ? '' + pivotX : undefined,
            pivotY: pivotY !== undefined ? '' + pivotY : undefined,
            duration: duration !== undefined ? '' + duration : undefined,
            items: items?.map(convertExitTrans),
        });
        enterTrans = enterTrans ? convertEnterTrans(enterTrans) : null;
        exitTrans = exitTrans ? convertExitTrans(exitTrans) : null;
        enterAnim = !enterTrans ? enterAnim : null;
        exitAnim = !exitTrans ? exitAnim : null;
        enterTrans = customAnimation ? enterTrans : undefined;
        exitTrans = customAnimation ? exitTrans : undefined;
        enterAnim = customAnimation || enterAnim === '' ? enterAnim : undefined;
        exitAnim = customAnimation || exitAnim === '' ? exitAnim : undefined;
        return {enterAnim, exitAnim, enterTrans, exitTrans, hidesTabBar, backgroundColor, landscape};
    }
    render() {
        var {navigationEvent, navigationTransition} = this.state;
        var {crumb, title, sceneKey, rest, popped, navigationEvent: {stateNavigator}} = this.props;
        var freezable = rest && !!React.Suspense;
        var {crumbs} = stateNavigator.stateContext;
        var stateContext = navigationEvent?.stateNavigator?.stateContext;
        var {state, data} = stateContext || crumbs[crumb] || {};
        return !!state && (
            <Freeze enabled={freezable && crumb < crumbs.length && navigationEvent && this.state.peekNavigationEvent !== this.props.navigationEvent
                && (!stateContext['peek'] || stateContext['peek'] !== this.props.navigationEvent)}>
                <NVScene
                    ref={(ref: any) => {
                        const viewConfig = ref?.viewConfig || ref?._viewConfig || ref?.__viewConfig;
                        if (!!React.Suspense && viewConfig?.validAttributes?.style) {
                            viewConfig.validAttributes.style = {
                                ...viewConfig.validAttributes.style,
                                display: null
                            };
                        }
                    }}
                    crumb={crumb}
                    sceneKey={sceneKey}
                    {...this.getAnimation()}
                    title={title(state, data)}
                    style={styles.scene}
                    onPopped={() => popped(sceneKey)}>
                    <BackButton onPress={this.handleBack} />
                    <NavigationContext.Provider value={navigationEvent}>
                        <TransitionContext.Provider value={navigationTransition}>
                            <OverlapContext.Provider value={0}>
                                {navigationEvent && this.props.renderScene(state, data)}
                            </OverlapContext.Provider>
                        </TransitionContext.Provider>
                    </NavigationContext.Provider>
                </NVScene>
            </Freeze>
        );
    }
}

var NVScene = global.nativeFabricUIManager ? require('./SceneNativeComponent').default : requireNativeComponent('NVScene');

const styles = StyleSheet.create({
    scene: {
        position: 'absolute',
        top: 0, right: 0,
        bottom: 0, left: 0,
    },
});

export default props => (
    <NavigationContext.Consumer>
        {(navigationEvent) => (
            <TransitionContext.Consumer>
                {(navigationTransition) => (
                    <RefetchContext.Consumer>
                        {(refetchControl) => <Scene navigationEvent={navigationEvent} navigationTransition={navigationTransition} refetchControl={refetchControl} {...props} />}
                    </RefetchContext.Consumer>
                )}
            </TransitionContext.Consumer>
        )}
    </NavigationContext.Consumer>
)
