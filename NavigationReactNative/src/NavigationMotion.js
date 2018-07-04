import React from 'react';
import {AppRegistry, BackHandler, NativeEventEmitter, NativeModules} from 'react-native';
import {StateNavigator, StateContext} from 'navigation';
import {NavigationContext} from 'navigation-react';

class NavigationMotion extends React.Component {
    constructor(props) {
        super(props);
        this.state = {navigationEvent: null};
    }
    static defaultProps = {
        crumb: 0,
        tab: 0
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
        var {crumb, tab, navigationEvent: {stateNavigator}} = this.props;
        if (!crumb) {
            var {NavigationModule} = NativeModules;
            this.handleNavigation = (_oldState, _state, _data, _asyncData, stateContext) => {
                var {crumbs, title, history} = stateContext;
                if (!history) {
                    var titles = crumbs.map(({title}) => title).concat(title);
                    NavigationModule.render(crumbs.length, tab, titles, AppRegistry.getAppKeys()[0]);
                }
            }
            stateNavigator.onNavigate(this.handleNavigation); 
            var emitter = new NativeEventEmitter(NavigationModule)
            this.subscription = emitter.addListener('Navigate', ({crumb, tab}) => {
                if (this.props.tab === tab) {
                    var distance = stateNavigator.stateContext.crumbs.length - crumb;
                    if (distance > 0) {
                        var url = stateNavigator.getNavigationBackLink(distance);
                        stateNavigator.navigateLink(url, undefined, true);
                    }
                }
            })
        }
        else {
            this.handleBack = () => {
                if (this.state.navigationEvent)
                    this.state.navigationEvent.stateNavigator.navigateBack(1);
                return !!this.state.navigationEvent;
            }
            BackHandler.addEventListener('hardwareBackPress', this.handleBack);
        }
    }
    shouldComponentUpdate(props, state) {
        return state.navigationEvent === props.navigationEvent;
    }
    componentWillUnmount() {
        var {crumb, navigationEvent: {stateNavigator}} = this.props;
        if (!crumb) {
            stateNavigator.offNavigate(this.handleNavigation); 
            this.subscription.remove();
        }
        else
            BackHandler.removeEventListener('hardwareBackPress', this.handleBack); 
    }
    render() {
        var {navigationEvent} = this.state;
        if (!navigationEvent) return null;
        var {state, data} = navigationEvent.stateNavigator.stateContext;
        return (
            <NavigationContext.Provider value={navigationEvent}>
                {state.renderScene(data)}
            </NavigationContext.Provider>
        );
    }
}

export default props => (
    <NavigationContext.Consumer>
        {(navigationEvent) => <NavigationMotion navigationEvent={navigationEvent} {...props} />}
    </NavigationContext.Consumer>
)
