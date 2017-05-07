import { StateNavigator } from 'navigation';
import * as React from 'react';
import { Transition } from 'react-move';
import { View } from 'react-native';

class NavigationMotion extends React.Component<any, any> {
    private sharedElements = {};
    context: {
        stateNavigator: StateNavigator
    }
    constructor(props, context) {
        super(props, context);
        this.onNavigate = this.onNavigate.bind(this);
        this.registerSharedElement = this.registerSharedElement.bind(this);
        this.unregisterSharedElement = this.unregisterSharedElement.bind(this);
        this.getSharedElements = this.getSharedElements.bind(this);
        this.state = {scenes: {}, move: false};
    }
    static defaultProps = {
        duration: 300,
        easing: 'easeLinear'
    }
    static contextTypes = {
        stateNavigator: React.PropTypes.object
    }
    static childContextTypes = {
        registerSharedElement: React.PropTypes.func,
        unregisterSharedElement: React.PropTypes.func
    }
    getChildContext() {
        return {
            registerSharedElement: this.registerSharedElement,
            unregisterSharedElement: this.unregisterSharedElement
        };
    }
    private getStateNavigator(): StateNavigator {
        return this.props.stateNavigator || this.context.stateNavigator;
    }
    componentDidMount() {
        var stateNavigator = this.getStateNavigator();
        stateNavigator.onNavigate(this.onNavigate);
        var {startStateKey, startNavigationData} = this.props;
        if (startStateKey) {
            stateNavigator.stateContext.clear();
            stateNavigator.navigate(startStateKey, startNavigationData);
        }
    }
    componentWillUnmount() {
        this.getStateNavigator().offNavigate(this.onNavigate);
    }
    onNavigate(oldState, state, data) {
        this.setState(({scenes: prevScenes}) => {
            var scenes = {...prevScenes};
            var {url} = this.getStateNavigator().stateContext;
            var element = state.renderScene(this.getSceneData(data, url, prevScenes), this.moveScene(url));
            scenes[url] = {...scenes[url], element};
            return {scenes, move: false, rest: false};
        });
    }
    moveScene(url) {
        return data => {
            this.setState(({scenes: prevScenes}) => {
                var scenes = {...prevScenes};
                scenes[url] = {...scenes[url], data};
                return {scenes, move: !!data};
            });
        };
    }
    registerSharedElement(url, name, ref, measurements, data) {
        this.sharedElements[url] = this.sharedElements[url] || {};
        this.sharedElements[url][name] = {ref, measurements, data};
    }
    unregisterSharedElement(url, name) {
        if (this.sharedElements[url])
            delete this.sharedElements[url][name];
    }
    getSharedElements() {
        var {url, oldUrl} = this.getStateNavigator().stateContext;
        var oldSharedElements = this.sharedElements[oldUrl];
        var mountedSharedElements = this.sharedElements[url];
        var sharedElements = [];
        for(var name in mountedSharedElements) {
            if (oldSharedElements && oldSharedElements[name]) {
                sharedElements.push({
                    name,
                    oldElement: oldSharedElements[name],
                    mountedElement: mountedSharedElements[name]
                })
            }
        }
        return sharedElements;
    }
    clearScenes() {
        this.setState(({scenes: prevScenes}) => {
            var scenes = {...prevScenes};
            var urls = this.getScenes().reduce((urls, {url}) => {
                urls[url] = true;
                return urls;
            }, {});
            for(var url in prevScenes) {
                if (!urls[url]) {
                    delete scenes[url];
                    delete this.sharedElements[url];
                }
            }
            return {scenes, rest: true};
        });
    }
    getScenes(){
        var {crumbs, nextCrumb} = this.getStateNavigator().stateContext;
        return crumbs.concat(nextCrumb).map(({state, data, url}) => (
            {state, data, url, scene: this.state.scenes[url], mount: url === nextCrumb.url}
        ));
    }
    getSceneData(data, url, prevScenes?) {
        var scene = (prevScenes || this.state.scenes)[url];
        return {...data, ...(scene && scene.data)};
    }
    getStyle(styleProp, {state, data, url}) {
        return typeof styleProp === 'function' ? styleProp(state, this.getSceneData(data, url)) : styleProp;
    }
    render() {
        var {unmountedStyle, mountedStyle, crumbStyle, style, children, duration, easing, sharedElementMotion} = this.props;
        var {move, rest} = this.state;
        var {stateContext} = this.getStateNavigator();
        return (stateContext.state &&
            <Transition
                duration={!move ? duration : 50} easing={easing}
                data={this.getScenes()}
                getKey={sceneContext => sceneContext.url}
                enter={sceneContext => this.getStyle(stateContext.oldState ? unmountedStyle : mountedStyle, sceneContext)}
                update={sceneContext => this.getStyle(sceneContext.mount ? mountedStyle : crumbStyle, sceneContext)}
                leave={sceneContext => this.getStyle(unmountedStyle, sceneContext)}
                onRest={() => this.clearScenes()}>
                {tweenStyles => (
                    <View style={style}>
                        {tweenStyles.map(({key, data: {scene, state, data, url}, state: style}) => (
                            children(style, scene && scene.element, key, state, this.getSceneData(data, url))
                        ))}
                        {sharedElementMotion && sharedElementMotion({
                            sharedElements: !rest ? this.getSharedElements() : [],
                            duration, easing
                        })}
                    </View>
                )}
            </Transition>
        );
    }
}

export default NavigationMotion;
