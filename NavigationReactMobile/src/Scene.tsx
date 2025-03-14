import * as React from 'react';
import { State } from 'navigation';
import { NavigationContext, NavigationEvent } from 'navigation-react';
import withStateNavigator from './withStateNavigator';
import { SceneProps } from './Props';
type SceneState = { navigationEvent: NavigationEvent };

class Scene extends React.Component<SceneProps & {navigationEvent: NavigationEvent}, SceneState> {
    constructor(props) {
        super(props);
        this.state = {navigationEvent: null};
    }
    static defaultProps = {
        renderScene: (state: State, data: any) => state.renderScene(data)
    }
    static getDerivedStateFromProps(props: SceneProps & {navigationEvent: NavigationEvent}) {
        var {url, navigationEvent} = props;
        var {url: currentUrl, state} = navigationEvent.stateNavigator.stateContext;
        return (!state || url !== currentUrl) ? null : {navigationEvent};
    }
    shouldComponentUpdate({crumb, rest, navigationEvent}, nextState) {
        var {crumbs} = navigationEvent.stateNavigator.stateContext;
        var freezableOrCurrent = (rest && (!!React.Suspense || crumbs.length === crumb));
        return freezableOrCurrent || navigationEvent !== this.props.navigationEvent || nextState.navigationEvent !== this.state.navigationEvent;
    }
    render() {
        var {navigationEvent} = this.state;
        var {crumb, navigationEvent: {stateNavigator}, className, style, wrap} = this.props;
        var {crumbs} = stateNavigator.stateContext;
        var stateContext = navigationEvent?.stateNavigator?.stateContext;
        var {state, data} = stateContext || crumbs[crumb] || {};
        return (
            <NavigationContext.Provider value={navigationEvent}>
                {wrap ? (
                    <div data-scene="true" className={className}
                        style={{...style, display: navigationEvent ? style?.display || undefined : 'none'}}>
                        {navigationEvent && this.props.renderScene(state, data)}
                    </div>
                ) : (
                    navigationEvent && this.props.renderScene(state, data)
                )}
            </NavigationContext.Provider>
        );
    }
}

export default withStateNavigator(Scene);
