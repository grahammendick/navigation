import {Motion, spring} from 'react-motion';
import React, {Component} from 'react';

class SceneNavigator extends Component{
    constructor(props) {
        super(props);
        var {stateContext: {state, data, url}} = props.stateNavigator;
        this.state = {scenes: {[url]: state.renderScene(data)}};
    }
    componentDidMount() {
        var {stateNavigator} = this.props;
        stateNavigator.onNavigate(() => {
            this.setState((prevState) => {
                var {stateContext: {state, data, url, crumbs}} = stateNavigator;
                var scenes = {[url]: state.renderScene(data)};
                for(var i = 0; i < crumbs.length; i++) {
                    scenes[crumbs[i].url] = prevState.scenes[crumbs[i].url]; 
                }
                return {scenes};
            });
        });
    }
    render() {
        var {stateContext: {url, crumbs}} = this.props.stateNavigator;
        var urls = crumbs.map((crumb) => crumb.url).concat(url);
        var scenes = urls.map((url) => {
            var {component: Component, props} = this.state.scenes[url];
            return (
                <Motion key={url} defaultStyle={{x: 0}} style={{x: spring(400)}}>
                    {({x}) =>
                        <div style={{
                            position: 'absolute',
                            width: '200px',
                            height: '500px',
                            backgroundColor: '#fff',
                            transform: `translate3d(${x}px, 0, 0)`}}>
                            <Component {...props} />
                        </div>
                    }
                </Motion>
            );
        });
        return <div>{scenes}</div>;
    }
}

export default SceneNavigator;
