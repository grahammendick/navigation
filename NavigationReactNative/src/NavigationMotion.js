import React from 'react';
import {BackHandler} from 'react-native';
import {StateNavigator, StateContext} from 'navigation';
import {NavigationContext} from 'navigation-react';

class NavigationMotion extends React.Component {
    constructor(props) {
        super(props);
        this.state = {navigationEvent: null};
        this.handleBack = this.handleBack.bind(this);
    }
    static defaultProps = {
        crumb: 0,
        tab: 0,
        renderScene: (state, data) => state.renderScene(data)
    }
    static getDerivedStateFromProps(props, {navigationEvent: prevNavigationEvent}) {
        var {crumb, navigationEvent} = props;
        var {state, crumbs} = navigationEvent.stateNavigator.stateContext;
        if (state && crumbs.length === crumb)
            return {navigationEvent};
        if (state && !prevNavigationEvent && crumb < crumbs.length) {
            var {stateNavigator} = navigationEvent;
            var caretakerNavigator = new StateNavigator(stateNavigator, stateNavigator.historyManager);
            caretakerNavigator.stateContext = NavigationMotion.createStateContext(crumbs, crumb);
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
        BackHandler.addEventListener('hardwareBackPress', this.handleBack);
    }
    shouldComponentUpdate(props, state) {
        return state.navigationEvent === props.navigationEvent;
    }
    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBack); 
    }
    handleBack() {
        var {navigationEvent} = this.state;
        if (navigationEvent && navigationEvent.stateNavigator.canNavigateBack(1)) {
            navigationEvent.stateNavigator.navigateBack(1);
            return true;
        }
        return false;
}
    render() {
        var {navigationEvent} = this.state;
        if (!navigationEvent) return null;
        var {state, data} = navigationEvent.stateNavigator.stateContext;
        return (
            <NavigationContext.Provider value={navigationEvent}>
                {this.props.renderScene(state, data)}
            </NavigationContext.Provider>
        );
    }
}

export default props => (
    <NavigationContext.Consumer>
        {(navigationEvent) => <NavigationMotion navigationEvent={navigationEvent} {...props} />}
    </NavigationContext.Consumer>
)
