import * as React from 'react';
import { Motion } from 'react-motion';
import { Modal } from 'react-native';

class SharedElementMotion extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            url: this.getStateNavigator().stateContext.url,
            sharedElements: this.context.getSharedElements(),
            navigatedCount: 0,
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
        if (this.state.url === this.getStateNavigator().stateContext.url) {
            this.setState(({sharedElements: prevSharedElements, navigatedCount}) => {
                var {onNavigating, onNavigated} = this.props;
                var sharedElements = this.context.getSharedElements();
                for(var i = 0; i < sharedElements.length && sharedElements.length !== navigatedCount && onNavigating; i++) {
                    var {name, oldElement: old, mountedElement: mounted} = sharedElements[i];
                    onNavigating(name, old.ref, mounted.ref, old.data, mounted.data);
                }
                if (sharedElements.length === 0 && prevSharedElements.length > 0) {
                    for(var i = 0; i < prevSharedElements.length && onNavigated; i++) {
                        var {name, mountedElement: mounted} = prevSharedElements[i];
                        onNavigated(name, null, mounted.ref, null, mounted.data);
                    }                
                }
                return {sharedElements};
            });
        }
    }
    stripStyle(style) {
        var newStyle = {};
        for(var key in style) {
            newStyle[key] = style[key].val;
        }
        return newStyle;
    }
    render() {
        var {children, elementStyle, onNavigated = () => {}} = this.props;
        var {url, sharedElements} = this.state;
        return (url === this.getStateNavigator().stateContext.url &&
            <Modal
                transparent={true}
                animationType="none"
                onRequestClose={() => {}}
                supportedOrientations={['portrait', 'landscape']}
                visible={sharedElements.length !== 0 && sharedElements.length !== this.state.navigatedCount}>
                {sharedElements.map(({name, oldElement: old, mountedElement: mounted}) => (
                    <Motion
                        key={name}
                        onRest={() => {
                            onNavigated(name, old.ref, mounted.ref, old.data, mounted.data);
                            this.setState(({navigatedCount}) => ({navigatedCount: navigatedCount + 1}));
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
