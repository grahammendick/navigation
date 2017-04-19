import * as React from 'react';
import { Motion } from 'react-motion';
import { Modal } from 'react-native';
import spring from './spring';

class SharedElementMotion extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.animate = this.animate.bind(this);
        this.reset = this.reset.bind(this);
        this.state = {
            url: this.getStateNavigator().stateContext.url,
            sharedElements: [], animatedElements: {}, force: 1,
        };
    }
    static defaultProps = {
        onAnimating: () => { },
        onAnimated: () => { }
    }
    static contextTypes = {
        stateNavigator: React.PropTypes.object,
        movingSharedElement: React.PropTypes.func,
        getSharedElements: React.PropTypes.func
    }
    getStateNavigator() {
        return this.props.stateNavigator || this.context.stateNavigator;
    }
    componentDidMount() {
        this.getStateNavigator().onNavigate(this.reset);
        this.animate();
        this.animateTimeout = setTimeout(() => cancelAnimationFrame(this.animateFrame), 500);
    }
    componentWillUnmount() {
        this.getStateNavigator().offNavigate(this.reset);
        cancelAnimationFrame(this.animateFrame);
        clearTimeout(this.animateTimeout);
    }
    animate() {
        this.animateFrame = requestAnimationFrame(() => {
            var sharedElements = this.context.getSharedElements();
            if (sharedElements.length !== 0) {
                this.setState({ sharedElements }, () => {
                    for (var i = 0; i < sharedElements.length; i++) {
                        var { name, oldElement: old, mountedElement: mounted } = sharedElements[i];
                        if (!this.state.animatedElements[name])
                            this.props.onAnimating(name, old.ref, mounted.ref, old.data, mounted.data);
                    }
                });
            }
            this.animate();
        });
    }
    reset() {
        cancelAnimationFrame(this.animateFrame);
        clearTimeout(this.animateTimeout);
        if (this.state.url === this.getStateNavigator().stateContext.url) {
            this.setState(({ force }) => ({ sharedElements: [], animatedElements: {}, force: force + 1 }));
            this.animate();
            this.animateTimeout = setTimeout(() => cancelAnimationFrame(this.animateFrame), 500);
        }
    }
    onAnimated(name, old, mounted) {
        this.setState(
            ({ animatedElements }) => ({ animatedElements: { ...animatedElements, [name]: true } }),
            () => {
                this.context.movingSharedElement(this.state.url, name, null);
                this.props.onAnimated(name, old.ref, mounted.ref, old.data, mounted.data)
            }
        );
    }
    getStyle(name, { measurements, data, style: defaultStyle }, strip = false) {
        if (strip && defaultStyle)
            return defaultStyle;
        var style = this.props.elementStyle(name, { ...measurements, ...data });
        var newStyle = {};
        for (var key in style)
            newStyle[key] = !strip ? style[key] : style[key].val;
        return newStyle;
    }
    render() {
        var { url, sharedElements, animatedElements, force } = this.state;
        return (url === this.getStateNavigator().stateContext.url &&
            <Modal
                transparent={true} animationType="none"
                onRequestClose={() => {this.getStateNavigator().navigateBack(1)}}
                visible={sharedElements.length > Object.keys(animatedElements).length}
                supportedOrientations={['portrait', 'landscape', 'landscape-left', 'landscape-right']}>
                {sharedElements.map(({ name, oldElement: old, mountedElement: mounted }) => (
                    <Motion
                        key={name} onRest={() => { this.onAnimated(name, old, mounted) }}
                        defaultStyle={{ ...this.getStyle(name, old, true), __force: 0 }}
                        style={{ ...this.getStyle(name, mounted), __force: spring(force) }}>
                        {({ __force, ...tweenStyle }) => {
                            this.context.movingSharedElement(url, name, tweenStyle);
                            return this.props.children(tweenStyle, name, old.data, mounted.data)
                        }}
                    </Motion>
                ))}
            </Modal>
        );
    }
}

export default SharedElementMotion;
