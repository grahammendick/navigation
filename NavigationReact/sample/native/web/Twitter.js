import React from 'react';
import SceneNavigator from './SceneNavigator.js';
import {spring} from 'react-motion';

export default ({stateNavigator}) => (
    <div style={styles.phone}>
        <div style={styles.twitter}>
            <SceneNavigator
                unmountedStyle={{translate: 100, scale: 1}}
                mountStyle={{translate: spring(0), scale: spring(1)}}
                mountedStyle={{translate: spring(5), scale: spring(0.9)}}
                unmountStyle={{translate: spring(100, {precision: 10}), scale: 1}}
                stateNavigator={stateNavigator}>
                    {({translate, scale}, scene) => <div style={{...styles.scene,
                        transform: `translate(${translate}%) scale(${scale}, ${scale})`}}>{scene}</div>}
            </SceneNavigator>
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