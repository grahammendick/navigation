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
            force: 1,
        };
    }
    static contextTypes = {
        stateNavigator: React.PropTypes.object,
        getSharedElements: React.PropTypes.func
    }
    getStateNavigator() {
        return this.props.stateNavigator || this.context.stateNavigator;
    }
    componentDidMount() {
        this.getStateNavigator().onNavigate(this.reset);
        this.animate();
    }
    componentWillUnmount() {
        this.getStateNavigator().offNavigate(this.reset);
        cancelAnimationFrame(this.animateId);
    }
    animate() {
        this.animatedId = requestAnimationFrame(() => {
            if (this.state.url !== this.getStateNavigator().stateContext.url)
                return;
            var {onAnimating, onAnimated} = this.props;
            var {sharedElements: prevSharedElements = [], animatedElements} = this.state;
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
            if (sharedElements.length !== 0)
                this.setState({sharedElements});
            this.animate();
        });
    }
    reset() {
        if (this.state.url !== this.getStateNavigator().stateContext.url)
            this.setState(({force}) => ({animatedElements: {}, force: force + 1}));
        else
            this.animate();
    }
    stripStyle(style) {
        var newStyle = {};
        for(var key in style) {
            newStyle[key] = style[key].val;
        }
        return newStyle;
    }
    onAnimated(name, old, mounted) {
        var {onAnimated = () => {}} = this.props;
        var unmounted = old.url = this.getStateNavigator().stateContext.oldUrl;
        onAnimated(name, !unmounted ? old.ref : null, mounted.ref, !unmounted ? old.data : null, mounted.data);
        this.setState(({animatedElements}) => ({animatedElements: {...animatedElements, [name]: true}}));        
    }
    render() {
        var {children, elementStyle} = this.props;
        var {url, sharedElements, force} = this.state;
        return (url === this.getStateNavigator().stateContext.url &&
            <Modal
                transparent={true} animationType="none" onRequestClose={() => {}}
                visible={sharedElements.length > Object.keys(this.state.animatedElements).length}
                supportedOrientations={['portrait', 'landscape', 'landscape-left', 'landscape-right']}>
                {sharedElements.map(({name, oldElement: old, mountedElement: mounted}) => (
                    <Motion
                        key={name} onRest={() => {this.onAnimated(name, old, mounted)}}
                        defaultStyle={{...this.stripStyle(elementStyle(name, {...old.measurements, ...old.data})), __force: 0}}
                        style={{...elementStyle(name, {...mounted.measurements, ...mounted.data}), __force: spring(force)}}>
                        {({__force, ...tweenStyle}) => children(tweenStyle, name, old.data, mounted.data)}
                    </Motion>
                ))}
            </Modal>
        );
    }
}

export default SharedElementMotion;
