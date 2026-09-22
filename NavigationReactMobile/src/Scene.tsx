import React from 'react';
import { State } from 'navigation';
import { NavigationContext, TransitionContext, NavigationEvent } from 'navigation-react';
import withStateNavigator from './withStateNavigator.js';
import { SceneProps } from './Props.js';
type SceneState = { navigationEvent: NavigationEvent, navigationTransition: {navigationEvent: NavigationEvent, nextNavigationEvent: NavigationEvent } };

class Scene extends React.Component<SceneProps & {navigationEvent: NavigationEvent}, SceneState> {
    constructor(props) {
        super(props);
        this.state = {navigationEvent: null, navigationTransition: null};
    }
    static defaultProps = {
        renderScene: (state: State, data: any) => state.renderScene(data)
    }
    static getDerivedStateFromProps(props: SceneProps & {navigationEvent: NavigationEvent, navigationTransition: {navigationEvent: NavigationEvent, nextNavigationEvent: NavigationEvent}}) {
        var {url, navigationEvent, navigationTransition} = props;
        var {url: currentUrl, state} = navigationEvent.stateNavigator.stateContext;
        return (!state || url !== currentUrl) ? null : {navigationEvent, navigationTransition};
    }
    shouldComponentUpdate({crumb, rest, navigationEvent}) {
        var {crumbs} = navigationEvent.stateNavigator.stateContext;
        var freezableOrCurrent = rest && (!!React.Suspense || crumbs.length === crumb);
        return freezableOrCurrent || navigationEvent !== this.props.navigationEvent;
    }
    render() {
        var {navigationEvent, navigationTransition} = this.state;
        var {crumb, navigationEvent: {stateNavigator}, className, style, wrap} = this.props;
        var {crumbs} = stateNavigator.stateContext;
        var stateContext = navigationEvent?.stateNavigator?.stateContext;
        var {state, data} = stateContext || crumbs[crumb] || {};
        return (
            <NavigationContext.Provider value={navigationEvent}>
                <TransitionContext.Provider value={navigationTransition}>
                    {wrap ? (
                        <div data-scene="true" className={className}
                            style={{...style, display: navigationEvent ? style?.display || undefined : 'none'}}>
                            {navigationEvent && this.props.renderScene(state, data)}
                        </div>
                    ) : (
                        navigationEvent && this.props.renderScene(state, data)
                    )}
                </TransitionContext.Provider>
            </NavigationContext.Provider>
        );
    }
}

export default withStateNavigator(Scene);
