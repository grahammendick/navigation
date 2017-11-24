import React from 'react';
import {NavigationLink} from 'navigation-react';

export default ({tweets, stateNavigator}) => (
  <ul>
    {tweets.map(({account: {id: accountId, name, logo}, id, text}) => (
      <li key={id} className="tweet">
        <NavigationLink
          className="logo"
          stateKey="timeline"
          navigationData={{id: accountId}}
          stateNavigator={stateNavigator}>
          <img src={logo} alt={name}/>
        </NavigationLink>
        <NavigationLink
          className="details"
          stateKey="tweet"
          navigationData={{id}}
          stateNavigator={stateNavigator}>
            <div className="name">{name}</div>
            <div>{text}</div>
        </NavigationLink>
      </li>
    ))}
  </ul>
);

