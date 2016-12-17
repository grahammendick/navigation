import { StateNavigator } from 'navigation';
import * as React from 'react';
import { BackAndroid } from 'react-native';

class NavigationBackAndroid extends React.Component<any, any> {
    private onBack = () => {
        var stateNavigator = this.getStateNavigator();
        if (this.state.state === stateNavigator.stateContext.state) {
            var listener = this.props.navigating;
            var navigate = true;
            if (listener)
                navigate = listener();
            if (navigate && stateNavigator.canNavigateBack(1))
                stateNavigator.navigateBack(1);
            return true;
        }
        return false;
    }
    constructor(props, context) {
        super(props, context);
        this.state = { state: this.getStateNavigator().stateContext.state };
    }
    static contextTypes = {
        stateNavigator: React.PropTypes.object
    }
    private getStateNavigator(): StateNavigator {
        return this.props.stateNavigator || (this.context as any).stateNavigator;
    }
    componentDidMount() {
        BackAndroid.addEventListener('hardwareBackPress', this.onBack);
    }
    componentWillUnmount() {
        BackAndroid.removeEventListener('hardwareBackPress', this.onBack);
    }
}

export default NavigationBackAndroid;
