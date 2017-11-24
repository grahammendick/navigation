import React from 'react';
import {NavigationLink} from 'navigation-react';
import Banner from './Banner';
import Tweets from './Tweets';

export default ({tweet: {account: {id: accountId, name, username, logo}, 
  text, time, retweets, likes, replies}, stateNavigator}) => (
  <div>
    <Banner title="Tweet" stateNavigator={stateNavigator} />
    <div className="tweet">
      <div className="heading">
        <NavigationLink
          className="logo"
          stateKey="timeline"
          navigationData={{id: accountId}}
          stateNavigator={stateNavigator}>
          <img src={logo} alt={name}/>
        </NavigationLink>
        <div className="details">
          <div className="name">{name}</div>
          <div className="username">{username}</div>
        </div>
      </div>
      <div className="text">{text}</div>
      <div className="time">{time}</div>
      <div className="interactions">
        <div className="count">{retweets}</div>
        <div className="interaction">Retweets</div>
        <div className="count">{likes}</div>
        <div className="interaction">Likes</div>
      </div>
    </div>
    <Tweets tweets={replies} stateNavigator={stateNavigator} />
  </div>
);

