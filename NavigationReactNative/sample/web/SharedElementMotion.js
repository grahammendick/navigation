import * as React from 'react';
import { Animate } from 'react-move';

class SharedElementMotion extends React.Component {
    componentWillReceiveProps(nextProps) {
        var sharedElements = this.getSharedElements(nextProps.sharedElements);
        var prevSharedElements = this.getSharedElements(this.props.sharedElements);
        this.diff(sharedElements, prevSharedElements, this.props.onAnimating);
        this.diff(prevSharedElements, sharedElements, this.props.onAnimated);
    }
    diff(fromSharedElements, toSharedElements, action) {
        for(var name in fromSharedElements) {
            var from = fromSharedElements[name];
            var to = toSharedElements[name];
            if (!to || from.mountedElement.ref !== to.mountedElement.ref) {
                if (action)
                    action(name, from.oldElement.ref, from.oldElement.data);
                if (action)
                    action(name, from.mountedElement.ref, from.mountedElement.data);
            }
        }
    }
    getSharedElements(sharedElements) {
        return sharedElements.reduce((elements, element) => ({...elements, [element.name]: element}), {});
    }
    getStyle(name, {measurements, data, style}) {
        return this.props.elementStyle(name, {...measurements, ...data});
    }
    render() {
        var {sharedElements, style, children, duration, easing} = this.props;
        return (sharedElements.length !== 0 &&
            <View style={style}>
                {sharedElements.map(({name, oldElement: old, mountedElement: mounted}) => (
                    <Animate
                        key={name}
                        duration={duration} easing={easing} immutable={false}
                        data={this.getStyle(name, mounted)}
                        default={this.getStyle(name, old)}>
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
