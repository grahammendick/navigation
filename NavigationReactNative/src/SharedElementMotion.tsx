import { StateNavigator } from 'navigation';
import * as React from 'react';
import { Animate } from 'react-move';
import { View } from 'react-native';

class SharedElementMotion extends React.Component<any, any> {
    static defaultProps = {
        onAnimating: () => {},
        onAnimated: () => {}
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
    getStyle(name, {measurements, data, style}) {
        return this.props.elementStyle(name, {...measurements, ...data});
    }
    render() {
        var {sharedElements, style, children, duration, easing, rest} = this.props;
        return (!rest &&
            <View style={style}>
                {sharedElements.map(({name, oldElement: old, mountedElement: mounted}) => (
                    <Animate
                        key={name}
                        duration={duration} easing={easing} immutable={false}
                        data={{...this.getStyle(name, mounted)}}
                        default={{...this.getStyle(name, old)}}>
                        {tweenStyle => (
                            children(tweenStyle, name, old.data, mounted.data)
                        )}
                    </Animate>
                ))}
            </View>
        );
    }
}

export default SharedElementMotion;
