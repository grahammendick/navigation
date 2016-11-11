import Back from './Back.js';
import React from 'react';

export default ({tweet: {name, username, logo, text, time, retweets, likes, replies}, stateNavigator}) => (
    <div style={styles.scene}>
        <div style={styles.nav}>
            <svg onClick={() => stateNavigator.navigateBack(1)} style={styles.icon} viewBox="0 0 46 72"><g><path d="M40 33H15.243l7.878-7.879a2.998 2.998 0 0 0 0-4.242 2.998 2.998 0 0 0-4.242 0l-13 13a2.998 2.998 0 0 0 0 4.242l13 13c.585.586 1.353.879 2.121.879s1.536-.293 2.121-.879a2.998 2.998 0 0 0 0-4.242L15.243 39H40a3 3 0 1 0 0-6z"></path></g></svg>
            <h1 style={styles.heading}>Tweet</h1>
        </div>
        <div style={styles.content}>
            <div style={styles.detail}>
                <img src={logo} style={styles.logo} />
                <h2 style={styles.name}>{name}</h2>
                <div style={styles.username}>{username}</div>
                <div style={styles.message}>{text}</div>
                <div style={styles.time}>{time}</div>
                <div style={styles.interactions}>
                    <span style={styles.count}>{retweets}</span><span>RETWEETS</span>
                    <span style={styles.count}>{likes}</span><span>LIKES</span>
                </div>
            </div>
            <ul style={styles.tweets}>
                {replies.map(({id, name, logo, text}) =>
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
    detail: {
        padding: '5% 3%',
        borderBottom: '1px solid #ccd6dd'
    },
    message: {
        fontSize: '125%',
        clear: 'both'
    },
    time: {
        color: '#657786',
        padding: '5px 0'
    },
    interactions: {
        fontSize: '90%',
        color: '#657786',
        borderTop: '1px solid #ccd6dd',
        paddingTop: '10px'
    },
    count: {
        color: '#000',
        fontWeight: 'bold',
        margin:'0 2%'
    },
    tweets: {
        padding: 0,
        margin: 0,
        listStyle: 'none'
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
    }
}