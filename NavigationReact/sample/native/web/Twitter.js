import React from 'react';
import SceneNavigator from './SceneNavigator.js';
import {spring} from 'react-motion';

export default ({stateNavigator}) => (
    <div style={styles.phone}>
        <div  style={styles.twitter}>
            <SceneNavigator
                getDefaultStyle={(state) => ({x: state.key == 'home' ? 0 : 400})}
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

var styles = {
    phone: {
        width: '324px',
        height: '588px',
        backgroundSize: '324px 588px',
        backgroundImage: 'url(phone.png)',
        margin: '0 auto'
    },
    twitter: {
        fontFamily: 'Segoe UI,sans-serif',
        fontSize: '80%',
        overflow: 'hidden',
        cursor: 'default',
        backgroundColor: '#fff',
        position: 'absolute',
        marginTop: '89px',
        marginLeft: '49px',
        width: '225px',
        height: '402px'
    }    
}