import React from 'react';

export default () => (
    <div>
        <div style={styles.nav}>
            <svg style={styles.home} viewBox="0 0 64 72"><g><path d="M60.034 33.795l-26-23.984a2.997 2.997 0 0 0-4.068 0l-26 23.984a3 3 0 0 0 4.068 4.41l2.265-2.09 6.809 24.683A3 3 0 0 0 20 63h24a3 3 0 0 0 2.892-2.202l6.809-24.683 2.265 2.09a2.988 2.988 0 0 0 2.033.795 3 3 0 0 0 2.035-5.205zM32 53a3 3 0 1 1 0-6 3 3 0 0 1 0 6zm0-11a6.999 6.999 0 1 1 0-13.998A7 7 0 1 1 32 42z"></path></g></svg>
            <h1 style={styles.heading}>Home</h1>
        </div>
        <ul style={styles.tweets}>
            <li style={styles.tweet}>
                <h2 style={styles.name}>React</h2>
                <span style={styles.username}>@reactjs</span><span style={styles.time}>3h</span>
                <img src="react.png" style={styles.logo} />
                <div style={styles.text}>Have you tried our 15.4 release candidate? Give it a shot and let us know if you have any issues before we ship it! </div>
            </li>
       </ul>
    </div>
);

var styles = {
    home: {
        display: 'inline-block',
        fill: '#1da1f2',
        width: '10%',
        marginLeft: '5%',
        verticalAlign: 'text-bottom'
    },
    heading: {
        fontSize: '120%',
        marginLeft: '5%',
        display: 'inline'
    },
    nav: {
        padding: '10px 0',
        boxShadow: '0 0 4px #657786'
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
        float: 'left'
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
        marginLeft: '3%',
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