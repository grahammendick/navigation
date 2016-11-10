import React from 'react';
import SceneNavigator from './SceneNavigator.js';
import {spring} from 'react-motion';

export default ({stateNavigator}) => (
    <div style={styles.phone}>
        <div  style={styles.twitter}>
            <SceneNavigator
                getDefaultStyle={(state) => ({translate: state.key == 'home' ? 0 : 100, scale: 1})}
                getStyle={(active) => ({translate: spring(!active ? 5: 0), scale: spring(!active ? 0.9: 1)})}
                interpolateStyle={({translate, scale}) => ({...styles.scene,
                    transform: `translate(${translate}%) scale(${scale}, ${scale})`})}
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
        backgroundColor: '#000',
        position: 'absolute',
        marginTop: '89px',
        marginLeft: '49px',
        width: '225px',
        height: '402px'
    },
    scene: {
        position: 'absolute',
        top: 0,
        backgroundColor: '#fff',
        height: '402px'
    }
}