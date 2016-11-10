import Back from './Back.js';
import ComponentA from './ComponentA.js';
import ComponentB from './ComponentB.js';
import {spring} from 'react-motion';
import {StateNavigator} from 'navigation';
import SceneNavigator from './SceneNavigator.js';
import React from 'react';
import ReactDOM from 'react-dom';

var stateNavigator = new StateNavigator([
    {key: 'first'},
    {key: 'second', trackCrumbTrail: true},
    {key: 'third', trackCrumbTrail: true}
]);

var {first, second, third} = stateNavigator.states;
first.renderScene = () => <ComponentA title="First" stateNavigator={stateNavigator} next="second"/>;
second.renderScene = () => <ComponentA title="Second" stateNavigator={stateNavigator} next="third"/>;
third.renderScene = () => <ComponentB title="Third" stateNavigator={stateNavigator}/>;

stateNavigator.start('/first');
//stateNavigator.start('/third?crumb=%2Ffirst&crumb=%2Fsecond');

ReactDOM.render(
    <div>
        <Back stateNavigator={stateNavigator} />
        <SceneNavigator
            getDefaultStyle={(state) => ({x: state == first ? 200 : 400})}
            getStyle={(active) => ({x: spring(!active ? 0 : 200)})}
            interpolateStyle={({x}, active) => ({
                position: 'absolute',
                display: !active ? 'none' : 'block',
                width: '200px',
                height: '500px',
                backgroundColor: '#fff',
                transform: `translate3d(${x}px, 0, 0)`})}
            stateNavigator={stateNavigator} />
    </div>,
    document.getElementById('content')
);
