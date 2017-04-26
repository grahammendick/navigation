import { StateNavigator } from 'navigation';
import * as React from 'react';
import { Animate } from 'react-move';
import { Modal } from 'react-native';

class SharedElementMotion extends React.Component<any, any> {
    private animateTimeout: number;
    private animateFrame: number;
    context: {
        stateNavigator: StateNavigator,
        movingSharedElement: (url, name, style) => void,
        getSharedElements: () => any[]
    }
    constructor(props, context) {
        super(props, context);
        this.animate = this.animate.bind(this);
        this.reset = this.reset.bind(this);
        this.state = {
            url: this.getStateNavigator().stateContext.url,
            sharedElements: [], animatedElements: {}, force: 1
        };
    }
    static defaultProps = {
        onAnimating: () => {},
        onAnimated: () => {}
    }
    static contextTypes = {
        stateNavigator: React.PropTypes.object,
        movingSharedElement: React.PropTypes.func,
        getSharedElements: React.PropTypes.func
    }
    private getStateNavigator(): StateNavigator {
        return this.props.stateNavigator || this.context.stateNavigator;
    }
    componentDidMount() {
        this.getStateNavigator().onNavigate(this.reset);
        this.animate();
        this.animateTimeout = setTimeout(() => cancelAnimationFrame(this.animateFrame), 150);
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
                this.setState({sharedElements}, () => {
                    for (var i = 0; i < sharedElements.length; i++) {
                        var {name, oldElement: old, mountedElement: mounted} = sharedElements[i];
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
            this.setState(({force}) => ({sharedElements: [], animatedElements: {}, force: force + 1}));
            this.animate();
            this.animateTimeout = setTimeout(() => cancelAnimationFrame(this.animateFrame), 150);
        }
    }
    onAnimated(name, mounted) {
        this.setState(
            ({animatedElements}) => ({animatedElements: {...animatedElements, [name]: true}}),
            () => {
                var sharedElements = this.context.getSharedElements();
                var {oldElement: old = undefined} = sharedElements.filter(element => element.name === name)[0] || {};
                this.context.movingSharedElement(this.state.url, name, null);
                this.props.onAnimated(name, old && old.ref, mounted.ref, old && old.data, mounted.data)
            }
        );
    }
    getStyle(name, {measurements, data, style: defaultStyle}, strip = false) {
        if (strip && defaultStyle)
            return defaultStyle;
        return this.props.elementStyle(name, {...measurements, ...data});
    }
    render() {
        var {url, sharedElements, animatedElements, force} = this.state;
        return (url === this.getStateNavigator().stateContext.url &&
            <Modal
                transparent={true} animationType="none" onOrientationChange={() => {}}
                onRequestClose={() => {this.getStateNavigator().navigateBack(1)}}
                visible={sharedElements.length > Object.keys(animatedElements).length}
                supportedOrientations={['portrait', 'landscape', 'landscape-left', 'landscape-right']}>
                {sharedElements.map(({name, oldElement: old, mountedElement: mounted}) => (
                    <Animate
                        key={name}
                        duration={300} easing="easeLinear" immutable={false}
                        data={{...this.getStyle(name, mounted), __force: force}}
                        default={{...this.getStyle(name, old, true), __force: 0}}
                        onRest={() => {this.onAnimated(name, mounted)}}>
                        {({__force, ...tweenStyle}) => {
                            this.context.movingSharedElement(url, name, tweenStyle);
                            return this.props.children(tweenStyle, name, old.data, mounted.data)
                        }}
                    </Animate>
                ))}
            </Modal>
        );
    }
}

export default SharedElementMotion;
