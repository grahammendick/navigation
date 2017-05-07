import { StateNavigator } from 'navigation';
import * as React from 'react';
import { Animate } from 'react-move';
import { View } from 'react-native';

class SharedElementMotion extends React.Component<any, any> {
    private animateTimeout: number;
    private animateFrame: number;
    constructor(props, context) {
        super(props, context);
        this.reset = this.reset.bind(this);
        this.state = { animatedElements: {}, force: 1 };
    }
    static defaultProps = {
        onAnimating: () => {},
        onAnimated: () => {},
    }
    componentDidMount() {
        this.props.stateNavigator.onNavigate(this.reset);
    }
    componentWillUnmount() {
        this.props.stateNavigator.offNavigate(this.reset);
    }
    componentWillUpdate() {
        var {sharedElements, onAnimating} = this.props;
        for (var i = 0; i < sharedElements.length; i++) {
            var {name, oldElement: old, mountedElement: mounted} = sharedElements[i];
            if (!this.state.animatedElements[name])
                onAnimating(name, old.ref, mounted.ref, old.data, mounted.data);
        }
    }
    reset() {
        this.setState(({force}) => ({animatedElements: {}, force: force + 1}));
    }
    onAnimated(name, mounted, old) {
        this.setState(
            ({animatedElements}) => ({animatedElements: {...animatedElements, [name]: true}}),
            () => {this.props.onAnimated(name, old.ref, mounted.ref, old.data, mounted.data)}
        );
    }
    getStyle(name, {measurements, data, style}) {
        return this.props.elementStyle(name, {...measurements, ...data});
    }
    render() {
        var {sharedElements, style, children, duration, easing} = this.props;
        var {animatedElements, force} = this.state;
        return (sharedElements.length > Object.keys(animatedElements).length &&
            <View style={style}>
                {sharedElements.map(({name, oldElement: old, mountedElement: mounted}) => (
                    <Animate
                        key={name}
                        duration={duration} easing={easing} immutable={false}
                        data={{...this.getStyle(name, mounted), __force: force}}
                        default={{...this.getStyle(name, old), __force: 0}}
                        onRest={() => {this.onAnimated(name, mounted, old)}}>
                        {({__force, ...tweenStyle}) => (
                            children(tweenStyle, name, old.data, mounted.data)
                        )}
                    </Animate>
                ))}
            </View>
        );
    }
}

export default SharedElementMotion;
