import { StateNavigator } from 'navigation';
import * as React from 'react';
import { BackAndroid } from 'react-native';

class NavigationBackAndroid extends React.Component<any, any> {
    private onBack = () => {
        var stateNavigator = this.getStateNavigator();
        if (stateNavigator.canNavigateBack(1)) {
            stateNavigator.navigateBack(1);
            return true;
        }
        return false;
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
