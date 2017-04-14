import * as React from 'react';
import { Motion } from 'react-motion';
import { Modal } from 'react-native';

class SharedElementMotion extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            url: this.getStateNavigator().stateContext.url,
            sharedElements: this.context.getSharedElements(),
            animatedCount: 0,
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
            var {onAnimating, onAnimated} = this.props;
            var sharedElements = this.context.getSharedElements();
            for(var i = 0; i < sharedElements.length && onAnimating; i++) {
                var {name, oldElement, mountedElement} = sharedElements[i];
                onAnimating(name, oldElement.ref, mountedElement.ref);
            }
            if (sharedElements.length === 0 && prevSharedElements.length > 0) {
                for(var i = 0; i < prevSharedElements.length && onAnimated; i++) {
                    var {name, oldElement, mountedElement} = prevSharedElements[i];
                    onAnimated(name, null, mountedElement.ref);
                }                
            }
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
        var {children, elementStyle, onAnimated} = this.props;
        var {url, sharedElements} = this.state;
        return (url === this.getStateNavigator().stateContext.url &&
            <Modal
                transparent={true}
                animationType="none"
                onRequestClose={() => {}}
                supportedOrientations={['portrait', 'landscape']}
                visible={sharedElements.length !== 0 && sharedElements.length !== this.state.animatedCount}>
                {sharedElements.map(({name, oldElement: old, mountedElement: mounted}) => (
                    <Motion
                        key={name}
                        onRest={() => {
                            if (onAnimated)
                                onAnimated(name, old.ref, mounted.ref);
                            this.setState(({animatedCount}) => ({animatedCount: animatedCount + 1}));
                        }}
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
