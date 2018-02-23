import * as React from 'react';
import Motion from './Motion';
import { SharedElement, SharedElementNavigationMotionProps, SharedElementMotionProps } from './Props';

class SharedElementMotion extends React.Component<SharedElementNavigationMotionProps & SharedElementMotionProps, any> {
    static defaultProps = {
        duration: 300,
        elementStyle: (name, ref, data) => data
    }
    componentWillReceiveProps(nextProps) {
        var sharedElements = this.getSharedElements(nextProps.sharedElements);
        var prevSharedElements = this.getSharedElements(this.props.sharedElements);
        this.diff(prevSharedElements, sharedElements, this.props.onAnimated);
        this.diff(sharedElements, prevSharedElements, this.props.onAnimating);
    }
    diff(fromSharedElements: { [name: string]: SharedElement },
        toSharedElements: { [name: string]: SharedElement },
        action: (name: string, ref: HTMLElement, data: any) => void) {
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
    getSharedElements(sharedElements: SharedElement[]): { [name: string]: SharedElement } {
        return sharedElements.reduce((elements, element) => ({...elements, [element.name]: element}), {});
    }
    getStyle(name, {ref, data}) {
        var { top, left, width, height } = ref.getBoundingClientRect();
        return this.props.elementStyle(name, ref, { top, left, width, height, ...data});
    }
    getPropValue(prop, name) {
        return typeof prop === 'function' ? prop(name) : prop;
    }
    render() {
        var {sharedElements, children, progress, duration} = this.props;
        var ElementMotion: new() => Motion<SharedElement> = Motion as any;
        return (sharedElements.length !== 0 &&
            <ElementMotion
                data={sharedElements}
                getKey={({name}) => name}
                enter={({name, oldElement}) => this.getStyle(name, oldElement)}
                update={({name, mountedElement}) => this.getStyle(name, mountedElement)}
                progress={progress}
                duration={duration}>
                {tweenStyles => (
                    tweenStyles.map(({data: {name, oldElement, mountedElement}, style: tweenStyle}) => (
                        children(tweenStyle, name, oldElement.data, mountedElement.data)
                    ))
                )}
            </ElementMotion>
        );
    }
}

export default SharedElementMotion;
