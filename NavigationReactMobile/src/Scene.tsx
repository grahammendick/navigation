import React from 'react';
import { State } from 'navigation';
import { NavigationContext, TransitionContext, NavigationEvent } from 'navigation-react';
import withStateNavigator from './withStateNavigator.js';
import Freeze from './Freeze.js';
import { SceneProps } from './Props.js';
type SceneState = { navigationEvent: NavigationEvent, navigationTransition: {navigationEvent: NavigationEvent, nextNavigationEvent: NavigationEvent }, peekNavigationEvent: NavigationEvent };

class Scene extends React.Component<SceneProps & {navigationEvent: NavigationEvent, refetchControl: any}, SceneState> {
    private offInvalidate: () => void;
    constructor(props) {
        super(props);
        this.state = {navigationEvent: null, navigationTransition: null, peekNavigationEvent: null};
        this.onBeforeNavigate = this.onBeforeNavigate.bind(this);
        this.onNavigate = this.onNavigate.bind(this);
        this.checkStale = this.checkStale.bind(this);
    }
    static defaultProps = {
        renderScene: (state: State, data: any) => state.renderScene(data),
        primeRefetch: () => {}
    }
    static getDerivedStateFromProps(props: SceneProps & {navigationEvent: NavigationEvent, navigationTransition: {navigationEvent: NavigationEvent, nextNavigationEvent: NavigationEvent}}, {navigationEvent: stateNavigationEvent}: SceneState) {
        var {url, navigationEvent, navigationTransition} = props;
        var {url: currentUrl, state} = navigationEvent.stateNavigator.stateContext;
        if (!state || url !== currentUrl) return null;
        if (stateNavigationEvent?.['refetching']) {
            navigationEvent['ignoreCache'] = true;
            navigationEvent['rscCache'] = stateNavigationEvent['rscCache'] ||= {};
        }
        return {navigationEvent, navigationTransition};
    }
    componentDidMount() {
        var {stateNavigator} = this.props.navigationEvent;
        stateNavigator.onBeforeNavigate(this.onBeforeNavigate);
        stateNavigator.onNavigate(this.onNavigate);
        this.offInvalidate = this.props.refetchControl?.onInvalidate?.(this.checkStale);
    }
    shouldComponentUpdate({crumb, rest, navigationEvent}, {navigationEvent: stateNavigationEvent, peekNavigationEvent}) {
        var {crumbs} = navigationEvent.stateNavigator.stateContext;
        var freezableOrCurrent = rest && (!!React.Suspense || crumbs.length === crumb);
        return freezableOrCurrent || navigationEvent !== this.props.navigationEvent
            || stateNavigationEvent !== this.state.navigationEvent || peekNavigationEvent !== this.state.peekNavigationEvent;
    }
    componentWillUnmount() {
        var {stateNavigator} = this.props.navigationEvent;
        stateNavigator.offBeforeNavigate(this.onBeforeNavigate);
        stateNavigator.offNavigate(this.onNavigate);
        this.offInvalidate?.();
    }
    onBeforeNavigate(state, _data, url: string) {
        var {crumb, refetchControl} = this.props;
        var {navigationEvent} = this.state;
        if (url.split('crumb=').length - 1 === crumb) {
            this.setState({peekNavigationEvent: this.props.navigationEvent});
            if (navigationEvent && state === navigationEvent.state && refetchControl?.isStale?.(crumb, navigationEvent.state.key)) {
                var refetchNavigationEvent = {...navigationEvent, ignoreCache: true, refetching: true, rscCache: undefined, rscFetching: this.props.primeRefetch(), rscFetch: undefined, trackable: undefined};
                React.startTransition(() => {
                    this.setState({navigationEvent: refetchNavigationEvent, navigationTransition: {navigationEvent: refetchNavigationEvent, nextNavigationEvent: refetchNavigationEvent}});
                });
            }
        }
        return true;
    }
    onNavigate(_oldState, _state, _data, _asyncData, stateContext) {
        this.checkStale(stateContext);
    }
    checkStale(stateContext) {
        var {crumb, refetchControl} = this.props;
        var {navigationEvent} = this.state;
        var {crumbs} = stateContext;
        if (navigationEvent && crumb < crumbs.length && (crumb === crumbs.length - 1 || crumb === 0) && refetchControl?.isStale?.(crumb, navigationEvent.state.key)) {
            var refetchNavigationEvent = {...navigationEvent, ignoreCache: true, refetching: true, rscCache: undefined, rscFetching: this.props.primeRefetch(), rscFetch: undefined, trackable: undefined};
            React.startTransition(() => {
                this.setState({navigationEvent: refetchNavigationEvent, navigationTransition: {navigationEvent: refetchNavigationEvent, nextNavigationEvent: refetchNavigationEvent}});
            });
        }
    }
    render() {
        var {navigationEvent, navigationTransition} = this.state;
        var {crumb, rest, unmounted, navigationEvent: {stateNavigator}, className, style, wrap} = this.props;
        var {crumbs} = stateNavigator.stateContext;
        var stateContext = navigationEvent?.stateNavigator?.stateContext;
        var {state, data} = stateContext || crumbs[crumb] || {};
        return (
            <NavigationContext.Provider value={navigationEvent}>
                <TransitionContext.Provider value={navigationTransition}>
                    {wrap ? (
                        <Freeze enabled={rest && (crumb < crumbs.length || unmounted) && this.state.peekNavigationEvent !== this.props.navigationEvent}>
                            <div data-scene="true" className={className}
                                style={{...style, display: navigationEvent ? style?.display || undefined : 'none'}}>
                                {navigationEvent && this.props.renderScene(state, data)}
                            </div>
                        </Freeze>
                    ) : (
                        navigationEvent && this.props.renderScene(state, data)
                    )}
                </TransitionContext.Provider>
            </NavigationContext.Provider>
        );
    }
}

export default withStateNavigator(Scene);
