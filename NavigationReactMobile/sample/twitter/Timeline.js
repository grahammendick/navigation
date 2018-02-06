import React from 'react';
import {NavigationLink} from 'navigation-react';
import Banner from './Banner';
import Tweets from './Tweets';

export default ({timeline: {id, name, username, logo, bio, 
  followers, following, tweets}}) => (
  <div>
    <Banner title={name} />
    <div className="profile">
      <div className="pic" />
      <img src={logo} alt={name}/>
      <div className="details">
        <div className="name">{name}</div>
        <div className="username">{username}</div>
        <div className="bio">{bio}</div>
      </div>
      <div className="interactions">
        <div className="count">{following.toLocaleString()}</div>
        <div className="interaction">Following</div>
        <div className="count">{followers.toLocaleString()}</div>
        <div className="interaction">Followers</div>
      </div>
    </div>
    <Tweets
      tweets={tweets}
      onTimeline={(e, accountId) => { 
        if (accountId === id) {
          e.preventDefault();
          e.target.closest('.scene').scrollTop = 0;
        }
        return accountId !== id;
      }} />
  </div>
);

