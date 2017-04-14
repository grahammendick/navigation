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
            var sharedElements = this.context.getSharedElements();
            for(var i = 0; i < sharedElements.length; i++) {
                // sharedElements[i].oldElement.ref.setNativeProps({style: {opacity: 0}})
                sharedElements[i].mountedElement.ref.setNativeProps({style: {opacity: 0}})
            }
            if (sharedElements.length === 0 && prevSharedElements.length > 0) {
                for(var i = 0; i < prevSharedElements.length; i++) {
                    prevSharedElements[i].mountedElement.ref.setNativeProps({style: {opacity: 1}});
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
        var {children, elementStyle} = this.props;
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
                            mounted.ref.setNativeProps({style: {opacity: 1}})
                            this.setState(({animatedCount}) => ({animatedCount: animatedCount + 1}))
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
