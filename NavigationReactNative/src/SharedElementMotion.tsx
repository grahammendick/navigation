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
        this.state = { force: 1 };
    }
    static defaultProps = {
        onAnimating: () => {},
        onAnimated: () => {}
    }
    componentDidMount() {
        this.props.stateNavigator.onNavigate(this.reset);
    }
    componentWillUnmount() {
        this.props.stateNavigator.offNavigate(this.reset);
    }
    componentWillReceiveProps({sharedElements, rest}) {
        var {sharedElements: prevSharedElements, onAnimating, onAnimated} = this.props;
        for (var i = 0; i < sharedElements.length; i++) {
            var {name, oldElement: old, mountedElement: mounted} = sharedElements[i];
            var prevSharedElement = prevSharedElements.filter(element => element.name === name)[0] || {};
            if (prevSharedElement.mountedElement !== mounted)
                onAnimating(name, old.ref, mounted.ref, old.data, mounted.data);
        }
        if (rest) {
            for (var i = 0; i < prevSharedElements.length; i++) {
                var {name, oldElement, mountedElement: mounted} = prevSharedElements[i];
                var old = sharedElements.length ? oldElement : {};
                onAnimated(name, old.ref, mounted.ref, old.data, mounted.data);
            }
        }
    }
    reset() {
        this.setState(({force}) => ({force: force + 1}));
    }
    getStyle(name, {measurements, data, style}) {
        return this.props.elementStyle(name, {...measurements, ...data});
    }
    render() {
        var {sharedElements, style, children, duration, easing, rest} = this.props;
        var {force} = this.state;
        return (!rest &&
            <View style={style}>
                {sharedElements.map(({name, oldElement: old, mountedElement: mounted}) => (
                    <Animate
                        key={name}
                        duration={duration} easing={easing} immutable={false}
                        data={{...this.getStyle(name, mounted), __force: force}}
                        default={{...this.getStyle(name, old), __force: 0}}>
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
