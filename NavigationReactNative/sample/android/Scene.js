import React from 'react';
import {AppRegistry, BackHandler, NativeModules} from 'react-native';
import {NavigationContext} from 'navigation-react';

class Scene extends React.Component {
    constructor(props) {
        super(props);
        this.state = {navigationEvent: null};
        this.handleBack = this.handleBack.bind(this);
    }
    static defaultProps = {
        crumb: 0
    }
    static getDerivedStateFromProps(props) {
        var {crumb, navigationEvent} = props;
        var {state, crumbs} = navigationEvent.stateNavigator.stateContext;
        return (state && crumbs.length === crumb) ? {navigationEvent} : null;
    }
    componentDidMount() {
        var {crumb, navigationEvent: {stateNavigator}} = this.props;
        if (!crumb)
            stateNavigator.onNavigate(this.handleNavigate);
        else
            BackHandler.addEventListener('hardwareBackPress', this.handleBack); 
    }
    shouldComponentUpdate(props, state) {
        return state.navigationEvent === props.navigationEvent;
    }
    componentWillUnmount() {
        var {crumb, navigationEvent: {stateNavigator}} = this.props;
        if (!crumb)
            stateNavigator.offNavigate(this.handleNavigate);
        else
            BackHandler.removeEventListener('hardwareBackPress', this.handleBack); 
    }
    handleNavigate(_oldState, _state, _data, _asyncData, {crumbs}) {
        NativeModules.NavigationMotion.render(crumbs.length, AppRegistry.getAppKeys()[0]);
    }
    handleBack() {
        this.state.navigationEvent.stateNavigator.navigateBack(1);
        return true;
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
        {(navigationEvent) => <Scene navigationEvent={navigationEvent} {...props} />}
    </NavigationContext.Consumer>
)
