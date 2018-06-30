import React from 'react';
import {onNavigate} from './NavigationMotion.js';
import {StateNavigator, StateContext} from 'navigation';
import {NavigationContext} from 'navigation-react';

class Scene extends React.Component {
    constructor(props) {
        super(props);
        this.state = {navigationEvent: null};
    }
    static defaultProps = {
        crumb: 0
    }
    static getDerivedStateFromProps(props, {navigationEvent: prevNavigationEvent}) {
        var {crumb, navigationEvent} = props;
        var {state, crumbs} = navigationEvent.stateNavigator.stateContext;
        if (state && crumbs.length === crumb)
            return {navigationEvent};
        if (state && !prevNavigationEvent && crumb < crumbs.length) {
            var {stateNavigator} = navigationEvent;
            var caretakerNavigator = new StateNavigator(stateNavigator, stateNavigator.historyManager);
            caretakerNavigator.stateContext = Scene.createStateContext(crumbs, crumb);
            caretakerNavigator.configure = stateNavigator.configure;
            caretakerNavigator.onBeforeNavigate = stateNavigator.onBeforeNavigate;
            caretakerNavigator.offBeforeNavigate = stateNavigator.offBeforeNavigate;
            caretakerNavigator.onNavigate = stateNavigator.onNavigate;
            caretakerNavigator.offNavigate = stateNavigator.offNavigate;
            caretakerNavigator.navigateLink = stateNavigator.navigateLink.bind(stateNavigator);
            var {oldState, state, data, asyncData} = caretakerNavigator.stateContext;
            return {navigationEvent: {oldState, state, data, asyncData, stateNavigator: caretakerNavigator}};
        }
        return null;
    }
    static createStateContext(crumbs, crumb) {
        var stateContext = new StateContext();
        var {state, data, url, title} = crumbs[crumb];
        stateContext.state = state;
        stateContext.data = data;
        stateContext.url = url;
        stateContext.title = title;
        stateContext.crumbs = crumbs.slice(0, crumb);
        stateContext.nextCrumb = crumbs[crumb];
        if (crumb > 1) {
            var {state, data, url} = crumbs[crumb - 1];
            stateContext.previousState = stateContext.oldState = state;
            stateContext.previousData = stateContext.oldData = data;
            stateContext.previousUrl = stateContext.oldUrl = url;
        }
        return stateContext;
    }
    componentDidMount() {
        if (!this.props.crumb) {
            this.subscription = onNavigate(({crumb, tab}) => {
                if (this.props.tab === tab) {
                    var {stateNavigator} = this.props.navigationEvent;
                    var distance = stateNavigator.stateContext.crumbs.length - crumb;
                    if (distance > 0) {
                        var url = stateNavigator.getNavigationBackLink(distance);
                        stateNavigator.navigateLink(url, undefined, true);
                    }
                }
            })
        }
    }
    shouldComponentUpdate(props, state) {
        return state.navigationEvent === props.navigationEvent;
    }
    componentWillUnmount() {
        if (!this.props.crumb)
            this.subscription.remove();
    }
    render() {
        var {crumb, navigationEvent, tab, ...props}  = this.props;
        var {navigationEvent} = this.state;
        if (!navigationEvent) return null;
        var {state, data} = navigationEvent.stateNavigator.stateContext;
        return (
            <NavigationContext.Provider value={navigationEvent}>
                {state.renderScene(data, props)}
            </NavigationContext.Provider>
        );
    }
}

export default props => (
    <NavigationContext.Consumer>
        {(navigationEvent) => <Scene navigationEvent={navigationEvent} {...props} />}
    </NavigationContext.Consumer>
)
