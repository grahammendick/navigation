import * as React from 'react';
import { Motion } from 'react-motion';
import { View } from 'react-native';

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
            <View style={style}>
                {this.context.getSharedElements().map(({name, from, to}) => (
                    <Motion key={name} defaultStyle={fromStyle(from.measurements)} style={toStyle(to.measurements)}>
                        {tweenStyle => children(tweenStyle, from.element, name)}
                    </Motion>
                ))}
            </View>
        );
    }
}

export default SharedElementMotion;
