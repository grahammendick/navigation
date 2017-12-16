import * as React from 'react';
import Motion from './Motion';
import { View, findNodeHandle } from 'react-native';

class SharedElementMotion extends React.Component<any, any> {
    static defaultProps = {
        duration: 300,
        easing: 'easeLinear',
        elementStyle: (name, data) => data
    }
    componentWillReceiveProps(nextProps) {
        var sharedElements = this.getSharedElements(nextProps.sharedElements);
        var prevSharedElements = this.getSharedElements(this.props.sharedElements);
        this.diff(prevSharedElements, sharedElements, this.props.onAnimated);
        this.diff(sharedElements, prevSharedElements, this.props.onAnimating);
    }
    diff(fromSharedElements, toSharedElements, action) {
        for(var name in fromSharedElements) {
            var from = fromSharedElements[name];
            var to = toSharedElements[name];
            if (!to || from.mountedElement.ref !== to.mountedElement.ref) {
                if (action && this.isMounted(from.oldElement.ref))
                    action(name, from.oldElement.ref, from.oldElement.data);
                if (action && this.isMounted(from.mountedRef))
                    action(name, from.mountedElement.ref, from.mountedElement.data);
            }
        }
    }
    getSharedElements(sharedElements) {
        return sharedElements.reduce((elements, element) => ({...elements, [element.name]: element}), {});
    }
    isMounted(ref) {
        try {
            findNodeHandle(ref);
            return true;
        } catch(e) {
            return false;
        }
    }
    getStyle(name, {measurements, data, style}) {
        return this.props.elementStyle(name, {...measurements, ...data});
    }
    getPropValue(prop, name) {
        return typeof prop === 'function' ? prop(name) : prop;
    }
    render() {
        var {sharedElements, style, children, duration, easing} = this.props;
        return (sharedElements.length !== 0 &&
            <Motion
                data={sharedElements}
                getKey={({name}) => name}
                enter={({name, oldElement}) => this.getStyle(name, oldElement)}
                update={({name, mountedElement}) => this.getStyle(name, mountedElement)}
                duration={({name}) => this.getPropValue(duration, name)}
                easing={({name}) => this.getPropValue(easing, name)}>
                {tweenStyles => (
                    <View style={style}>
                        {tweenStyles.map(({data: {name, oldElement, mountedElement}, style: tweenStyle}) => (
                            (children as any)(tweenStyle, name, oldElement.data, mountedElement.data)
                        ))}
                    </View>
                )}
            </Motion>
        );
    }
}

export default SharedElementMotion;
