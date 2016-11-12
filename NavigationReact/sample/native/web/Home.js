import React from 'react';

export default ({tweets, stateNavigator}) => (
    <div style={styles.scene}>
        <div style={styles.nav}>
            <svg style={styles.icon} viewBox="0 0 64 72"><g><path d="M60.034 33.795l-26-23.984a2.997 2.997 0 0 0-4.068 0l-26 23.984a3 3 0 0 0 4.068 4.41l2.265-2.09 6.809 24.683A3 3 0 0 0 20 63h24a3 3 0 0 0 2.892-2.202l6.809-24.683 2.265 2.09a2.988 2.988 0 0 0 2.033.795 3 3 0 0 0 2.035-5.205zM32 53a3 3 0 1 1 0-6 3 3 0 0 1 0 6zm0-11a6.999 6.999 0 1 1 0-13.998A7 7 0 1 1 32 42z"></path></g></svg>
            <h1 style={styles.heading}>Home</h1>
        </div>
        <div style={styles.content}>
            <ul style={styles.tweets}>
                {tweets.map(({id, name, logo, text}) =>
                    <li key={id} style={styles.tweet} onClick={() => stateNavigator.navigate('tweet', {id})}>
                        <h2 style={styles.name}>{name}</h2>
                        <img src={logo} style={styles.logo} />
                        <div style={styles.text}>{text}</div>
                    </li>
                )}
            </ul>
        </div>
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
        padding: '5px 0 0 5%',
        margin: '0',
        verticalAlign: 'top',
        display: 'inline-block'
    },
    nav: {
        padding: '10px 0',
        boxShadow: '0 0 4px #657786',
        height: '30px'
    },   
    content: {
        height: '350px',
        overflow: 'auto'
    },
    tweets: {
        padding: 0,
        margin: 0,
        listStyle: 'none',
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
    }
}