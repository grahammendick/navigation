import Back from './Back.js';
import React from 'react';

export default ({stateNavigator}) => (
    <div style={styles.scene}>
        <div style={styles.nav}>
            <svg onClick={() => stateNavigator.navigateBack(1)} style={styles.icon} viewBox="0 0 46 72"><g><path d="M40 33H15.243l7.878-7.879a2.998 2.998 0 0 0 0-4.242 2.998 2.998 0 0 0-4.242 0l-13 13a2.998 2.998 0 0 0 0 4.242l13 13c.585.586 1.353.879 2.121.879s1.536-.293 2.121-.879a2.998 2.998 0 0 0 0-4.242L15.243 39H40a3 3 0 1 0 0-6z"></path></g></svg>
            <h1 style={styles.heading}>Tweet</h1>
        </div>
        <div style={styles.detail}>
            <img src="react.png" style={styles.logo} />
            <h2 style={styles.name}>React</h2>
            <div style={styles.username}>@reactjs</div>
            <div style={styles.message}>Have you tried our 15.4 release candidate? Give it a shot and let us know if you have any issues before we ship it! </div>
            <span style={styles.time}>3h</span>
        </div>
        <ul style={styles.tweets}>
            <li style={styles.tweet} onClick={() => stateNavigator.navigate('tweet')}>
                <h2 style={styles.name}>React</h2>
                <span style={styles.username}>@reactjs</span><span style={styles.time}>3h</span>
                <img src="react.png" style={styles.logo} />
                <div style={styles.text}>Have you tried our 15.4 release candidate? Give it a shot and let us know if you have any issues before we ship it! </div>
            </li>
       </ul>
    </div>
);

var styles = {
    scene: {
        border: '1px solid #ccd6dd',
        height: '400px'
    },
    icon: {
        display: 'inline-block',
        fill: '#1da1f2',
        width: '10%',
        marginLeft: '5%',
        verticalAlign: 'text-bottom'
    },
    heading: {
        fontSize: '120%',
        margin: '5px 0 0 5%',
        verticalAlign: 'top',
        display: 'inline-block'
    },
    nav: {
        padding: '10px 0',
        boxShadow: '0 0 4px #657786',
        height: '30px'
    },
    detail: {
        padding: '5% 3%'  
    },
    message: {
        fontSize: '125%',
        clear: 'both'
    },
    tweets: {
        padding: 0,
        margin: 0,
        listStyle: 'none',
        height: '351px',
        overflow: 'auto'
    },
    logo: {
        width: '20%',
        display: 'block',
        float: 'left',
        borderRadius: '.35rem',
        marginRight: '3%'
    },
    tweet: {
        padding: '3%',
        borderBottom: '1px solid #ccd6dd'
    },
    text: {
        marginLeft: '23%'
    },
    name: {
        display: 'inline',
        fontSize: '100%',            
        marginRight: '2%'
    },
    username: {
        color: '#657786'
    },
    time: {
        color: '#657786',
        float: 'right'
    }
}