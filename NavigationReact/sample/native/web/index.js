import Back from './Back.js';
import ComponentA from './ComponentA.js';
import ComponentB from './ComponentB.js';
import {spring} from 'react-motion';
import {StateNavigator} from 'navigation';
import SceneNavigator from './SceneNavigator.js';
import React from 'react';
import ReactDOM from 'react-dom';

var stateNavigator = new StateNavigator([
    {key: 'first', renderScene: () => ({component: ComponentA, props: {title: "First", stateNavigator, next: 'second'}}), styleStart: () => ({x: 200})},
    {key: 'second', trackCrumbTrail: true, renderScene: () => ({component: ComponentA, props: {title: "Second", stateNavigator, next: 'third'}})},
    {key: 'third', trackCrumbTrail: true, renderScene: () => ({component: ComponentB, props: {title: "Third", stateNavigator}})}
]);

stateNavigator.start('/first');

ReactDOM.render(
    <div>
        <Back stateNavigator={stateNavigator} />
        <SceneNavigator
            styleStart={() => ({x: 400})}
            styleMiddle={({x}, show) => ({
                position: 'absolute',
                display: !show ? 'none' : 'block',
                width: '200px',
                height: '500px',
                backgroundColor: '#fff',
                transform: `translate3d(${x}px, 0, 0)`})}
            styleEnd={(show) => ({x: spring(!show ? 0 : 200)})}
            stateNavigator={stateNavigator} />
    </div>,
    document.getElementById('content')
);
