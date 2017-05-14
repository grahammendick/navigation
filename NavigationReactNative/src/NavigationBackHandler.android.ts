import { StateNavigator } from 'navigation';
import * as React from 'react';
import { BackHandler } from 'react-native';

class NavigationBackHandler extends React.Component<any, any> {
    private url: string;
    constructor(props, context) {
        super(props, context);
        this.onBack = this.onBack.bind(this);
        this.url = this.getStateNavigator().stateContext.url;
    }
    static contextTypes = {
        stateNavigator: React.PropTypes.object
    }
    private getStateNavigator(): StateNavigator {
        return this.props.stateNavigator || (this.context as any).stateNavigator;
    }
    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.onBack);
    }
    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.onBack);
    }
    onBack() {
        var stateNavigator = this.getStateNavigator();
        if (this.url === stateNavigator.stateContext.url) {
            var listener = this.props.navigating;
            var navigate = true;
            if (listener)
                navigate = listener();
            var canNavigateBack = stateNavigator.canNavigateBack(1);
            if (navigate && canNavigateBack)
                stateNavigator.navigateBack(1);
            return !navigate || canNavigateBack;
        }
        return false;
    }
    render() {
        return null;
    }
}

export default NavigationBackHandler;
