import React from 'react';
import SceneNavigator from './SceneNavigator.js';
import {spring} from 'react-motion';

export default ({stateNavigator}) => (
    <div id="phone">
        <div id="twitter">
            <SceneNavigator
                getDefaultStyle={(state) => ({x: state.key == 'first' ? 0 : 400})}
                getStyle={(active) => ({x: spring(!active ? 0 : 0)})}
                interpolateStyle={({x}, active) => ({
                    position: 'absolute',
                    display: !active ? 'none' : 'block',
                    backgroundColor: '#fff',
                    transform: `translate3d(${x}px, 0, 0)`})}
                stateNavigator={stateNavigator} />
        </div>
    </div>    
);