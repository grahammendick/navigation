import React from 'react';
import {NavigationLink} from 'navigation-react';
import Banner from './Banner';

export default ({timeline: {id, name, username, logo, bio, 
  followers, following, tweets}, stateNavigator}) => (
  <div>
    <Banner title={name} stateNavigator={stateNavigator} />
    <div className="profile">
      <div className="pic" />
      <img src={logo} alt={name}/>
      <div className="details">
        <div className="name">{name}</div>
        <div className="username">{username}</div>
        <div className="bio">{bio}</div>
        </div>
      </div>
  </div>
);

