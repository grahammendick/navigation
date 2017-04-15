import * as React from 'react';
import { Motion } from 'react-motion';
import { Modal } from 'react-native';
import spring from './spring';

class SharedElementMotion extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.reset = this.reset.bind(this);
        this.state = {
            url: this.getStateNavigator().stateContext.url,
            sharedElements: this.context.getSharedElements(),
            animatedElements: {},
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
            this.setState(({sharedElements: prevSharedElements, animatedElements}) => {
                var {onAnimating, onAnimated} = this.props;
                var sharedElements = this.context.getSharedElements();
                for(var i = 0; i < sharedElements.length && onAnimating; i++) {
                    var {name, oldElement: old, mountedElement: mounted} = sharedElements[i];
                    if (!animatedElements[name])
                        onAnimating(name, old.ref, mounted.ref, old.data, mounted.data);
                }
                if (sharedElements.length === 0 && prevSharedElements.length > 0) {
                    for(var i = 0; i < prevSharedElements.length && onAnimated; i++) {
                        var {name, mountedElement: mounted} = prevSharedElements[i];
                        onAnimated(name, null, mounted.ref, null, mounted.data);
                    }                
                }
                return {sharedElements};
            });
        }
    }
    componentDidMount() {
        this.getStateNavigator().onNavigate(this.reset);
    }
    componentWillUnmount() {
        this.getStateNavigator().offNavigate(this.reset);
    }
    reset() {
        this.setState({animatedElements: {}});
    }
    stripStyle(style) {
        var newStyle = {};
        for(var key in style) {
            newStyle[key] = style[key].val;
        }
        return newStyle;
    }
    render() {
        var {children, elementStyle, onAnimated = () => {}} = this.props;
        var {url, sharedElements} = this.state;
        return (url === this.getStateNavigator().stateContext.url &&
            <Modal
                transparent={true}
                animationType="none"
                onRequestClose={() => {}}
                supportedOrientations={['portrait', 'landscape', 'landscape-left', 'landscape-right']}
                visible={sharedElements.length !== Object.keys(this.state.animatedElements).length}>
                {sharedElements.map(({name, oldElement: old, mountedElement: mounted}) => (
                    <Motion
                        key={name}
                        onRest={() => {
                            onAnimated(name, old.ref, mounted.ref, old.data, mounted.data);
                            this.setState(({animatedElements}) => ({animatedElements: {...animatedElements, [name]: true}}));
                        }}
                        defaultStyle={{...this.stripStyle(elementStyle(name, {...old.measurements, ...old.data})), __force: 0}}
                        style={{...elementStyle(name, {...mounted.measurements, ...mounted.data}), __force: spring(1)}}>
                        {({__force, ...tweenStyle}) => children(tweenStyle, name, old.data, mounted.data)}
                    </Motion>
                ))}
            </Modal>
        );
    }
}

export default SharedElementMotion;
