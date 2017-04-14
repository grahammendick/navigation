import * as React from 'react';
import { Motion } from 'react-motion';
import { Modal } from 'react-native';

class SharedElementMotion extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            url: this.getStateNavigator().stateContext.url,
            sharedElements: this.context.getSharedElements()
        };
    }
    static contextTypes = {
        stateNavigator: React.PropTypes.object,
        getSharedElements: React.PropTypes.func
    }
    getStateNavigator() {
        return this.props.stateNavigator || this.context.stateNavigator;
    }
    componentWillReceiveProps() {
        this.setState(({sharedElements: prevSharedElements}) => {
            var sharedElements = this.context.getSharedElements();
            return {sharedElements};
        });
    }
    stripStyle(style) {
        var newStyle = {};
        for(var key in style) {
            newStyle[key] = style[key].val;
        }
        return newStyle;
    }
    render() {
        var {children, elementStyle} = this.props;
        var {url, sharedElements} = this.state;
        return (url === this.getStateNavigator().stateContext.url &&
            <Modal
                transparent={true}
                animationType="none"
                onRequestClose={() => {}}
                supportedOrientations={['portrait', 'landscape']}
                visible={sharedElements.length !== 0 && !this.state.hide}>
                {sharedElements.map(({name, oldElement: old, mountedElement: mounted}) => (
                    <Motion
                        key={name}
                        onRest={() => {this.setState({hide: true})}}
                        defaultStyle={this.stripStyle(elementStyle(name, {...old.measurements, ...old.data}))}
                        style={elementStyle(name, {...mounted.measurements, ...mounted.data})}>
                        {tweenStyle => children(tweenStyle, name, old.data, mounted.data)}
                    </Motion>
                ))}
            </Modal>
        );
    }
}

export default SharedElementMotion;
