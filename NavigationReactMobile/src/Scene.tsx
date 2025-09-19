import React from 'react';
import { State } from 'navigation';
import { NavigationContext, NavigationDeferredContext, NavigationEvent } from 'navigation-react';
import withStateNavigator from './withStateNavigator.js';
import { SceneProps } from './Props.js';
type SceneState = { navigationEvent: NavigationEvent, navigationDeferredEvent: NavigationEvent };

class Scene extends React.Component<SceneProps & {navigationEvent: NavigationEvent}, SceneState> {
    constructor(props) {
        super(props);
        this.state = {navigationEvent: null, navigationDeferredEvent: null};
    }
    static defaultProps = {
        renderScene: (state: State, data: any) => state.renderScene(data)
    }
    static getDerivedStateFromProps(props: SceneProps & {navigationEvent: NavigationEvent, navigationDeferredEvent: NavigationEvent}) {
        var {url, navigationEvent, navigationDeferredEvent} = props;
        var {url: currentUrl, state} = navigationEvent.stateNavigator.stateContext;
        return (!state || url !== currentUrl) ? null : {navigationEvent, navigationDeferredEvent};
    }
    shouldComponentUpdate({crumb, rest, navigationEvent}) {
        var {crumbs} = navigationEvent.stateNavigator.stateContext;
        var freezableOrCurrent = rest && (!!React.Suspense || crumbs.length === crumb);
        return freezableOrCurrent || navigationEvent !== this.props.navigationEvent;
    }
    render() {
        var {navigationEvent, navigationDeferredEvent} = this.state;
        var {crumb, navigationEvent: {stateNavigator}, className, style, wrap} = this.props;
        var {crumbs} = stateNavigator.stateContext;
        var stateContext = navigationEvent?.stateNavigator?.stateContext;
        var {state, data} = stateContext || crumbs[crumb] || {};
        return (
            <NavigationContext.Provider value={navigationEvent}>
                <NavigationDeferredContext.Provider value={navigationDeferredEvent}>
                    {wrap ? (
                        <div data-scene="true" className={className}
                            style={{...style, display: navigationEvent ? style?.display || undefined : 'none'}}>
                            {navigationEvent && this.props.renderScene(state, data)}
                        </div>
                    ) : (
                        navigationEvent && this.props.renderScene(state, data)
                    )}
                </NavigationDeferredContext.Provider>
            </NavigationContext.Provider>
        );
    }
}

export default withStateNavigator(Scene);
