import * as React from 'react';
import { Motion } from 'react-motion';
import { Modal } from 'react-native';

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
        var {url} = this.getStateNavigator().stateContext;
        var sharedElements = this.state.url === url ? this.context.getSharedElements() : [];
        return (
            <Modal
                visible={sharedElements.length !== 0 && !this.state.hide}
                supportedOrientations={['portrait', 'landscape']}
                onRequestClose={() => {}}
                transparent={true}
                animationType="none">
                {sharedElements.map(({name, from, to}) => (
                    <Motion key={name} onRest={() => {this.setState({hide: true})}} defaultStyle={fromStyle(from.measurements)} style={toStyle(to.measurements)}>
                        {tweenStyle => children(tweenStyle, from.element, name)}
                    </Motion>
                ))}
            </Modal>
        );
    }
}

export default SharedElementMotion;
