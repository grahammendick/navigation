import React from 'react';
import { BackHandler } from 'react-native';

class BackButton extends React.Component<{onPress: () => boolean}> {
    constructor(props) {
        super(props);
        this.handleBack = this.handleBack.bind(this);
    }
    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBack);
    }
    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBack);
    }
    handleBack() {
        return this.props.onPress();
    }
    render() {
        return null;
    }
}

export default BackButton;