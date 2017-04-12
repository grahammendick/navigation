import * as React from 'react';
import { Motion } from 'react-motion';
import { View, Modal } from 'react-native';

class SharedElementMotion extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {url: this.getStateNavigator().stateContext.url};
    }
    static contextTypes = {
        stateNavigator: React.PropTypes.object,
        getSharedElements: React.PropTypes.func
    }
    getStateNavigator() {
        return this.props.stateNavigator || this.context.stateNavigator;
    }
    render() {
        var {style, children, fromStyle = m => m, toStyle = m => m} = this.props;
        return (
            this.state.url === this.getStateNavigator().stateContext.url &&
            <Modal
                visible={!this.state.hide}
                transparent={true}
                animationType="none">
                {this.context.getSharedElements().map(({name, from, to}) => (
                    <Motion key={name} onRest={() => {this.setState({hide: true})}} defaultStyle={fromStyle(from.measurements)} style={toStyle(to.measurements)}>
                        {tweenStyle => children(tweenStyle, from.element, name)}
                    </Motion>
                ))}
            </Modal>
        );
    }
}

export default SharedElementMotion;
