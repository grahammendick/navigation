import React from 'react';
import { BackHandler } from 'react-native';
import BackHandlerContext from './BackHandlerContext';

class BackButton extends React.Component<{backHandler: BackHandler, onPress: () => boolean}> {
    constructor(props) {
        super(props);
        this.handleBack = this.handleBack.bind(this);
    }
    componentDidMount() {
        this.props.backHandler.addEventListener('hardwareBackPress', this.handleBack);
    }
    componentWillUnmount() {
        this.props.backHandler.removeEventListener('hardwareBackPress', this.handleBack);
    }
    handleBack() {
        return this.props.onPress();
    }
    render() {
        return null;
    }
}

export default props => (
    <BackHandlerContext.Consumer>
        {backHandler => (
            <BackButton {...props} backHandler={backHandler} />
        )}
    </BackHandlerContext.Consumer>
);
