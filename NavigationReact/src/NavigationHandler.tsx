import NavigationContext from './NavigationContext';
import { StateNavigator } from 'navigation';
import * as React from 'react';

class NavigationHandler extends React.Component<{ stateNavigator: StateNavigator }, any> {
    private onNavigate = () => {
        this.forceUpdate();
    }

    componentDidMount() {
        this.props.stateNavigator.onNavigate(this.onNavigate);
    }

    componentWillUnmount() {
        this.props.stateNavigator.offNavigate(this.onNavigate);
    }

    render() {
        var { children, stateNavigator } = this.props;
        var { oldState, state, data, asyncData } = stateNavigator.stateContext;
        return (
            <NavigationContext.Provider value={{ oldState, state, data, asyncData, stateNavigator }}>
                {children}
            </NavigationContext.Provider>
        );
    }
}
export default NavigationHandler;
