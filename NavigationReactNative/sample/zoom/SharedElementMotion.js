import * as React from 'react';
import { Motion } from 'react-motion';

class SharedElementMotion extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.onRegisterSharedElement = this.onRegisterSharedElement.bind(this);
        this.state = {url: this.getStateNavigator().stateContext.url, sharedElements: {}};
    }
    static contextTypes = {
        stateNavigator: React.PropTypes.object,
        onRegisterSharedElement: React.PropTypes.func
    }
    getStateNavigator() {
        return this.props.stateNavigator || this.context.stateNavigator;
    }
    componentDidMount() {
        this.context.onRegisterSharedElement(this.onRegisterSharedElement);
    }
    componentWillUnmount() {
        this.context.offRegisterSharedElement(this.onRegisterSharedElement);
    }
    onRegisterSharedElement(url, name, element, measurements) {
        this.setState(({sharedElements: prevSharedElements}) => {
            var sharedElements = {...prevSharedElements};
            var sharedElement = {element, measurements};
            sharedElements[url] = {...sharedElements[url], [name]: sharedElement};
            return {sharedElements};
        });
    }
    render() {
        return null;
    }
}

export default SharedElementMotion;
