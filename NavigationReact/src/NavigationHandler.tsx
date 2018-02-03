import { Provider } from './NavigationContext';
import * as React from 'react';

class NavigationHandler extends React.Component<any, any> {
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
            <Provider value={{ oldState, state, data, asyncData, stateNavigator }}>
                {children}
            </Provider>
        );
    }
}
export default NavigationHandler;
