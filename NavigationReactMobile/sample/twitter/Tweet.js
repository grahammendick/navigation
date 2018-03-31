import React from 'react';
import {NavigationLink} from 'navigation-react';
import Banner from './Banner';
import Tweets from './Tweets';

export default ({tweet: {account: {id: accountId, name, username, logo}, 
  id, text, photo, time, retweets, likes, replies}}) => (
  <div>
    <Banner title="Tweet" />
    <div className="tweet">
      <div className="heading">
        <NavigationLink
          className="logo"
          stateKey="timeline"
          navigationData={{id: accountId}}>
          <img src={logo} alt={name}/>
        </NavigationLink>
        <div className="details">
          <div className="name">{name}</div>
          <div className="username">{username}</div>
        </div>
      </div>
      <div className="text">{text}</div>
      {photo && <NavigationLink
        className="photo"
        stateKey="photo"
        navigationData={{id}}>
          <img src={photo}/>
      </NavigationLink>}
      <div className="time">{time}</div>
      <div className="interactions">
        <div className="count">{retweets}</div>
        <div className="interaction">Retweets</div>
        <div className="count">{likes}</div>
        <div className="interaction">Likes</div>
      </div>
    </div>
    <Tweets tweets={replies} />
  </div>
);

