import React from 'react';
import {NavigationLink} from 'navigation-react';

export default ({tweets, onTimeline}) => (
  <ul>
    {tweets.map(({account: {id: accountId, name, logo}, id, text}) => (
      <li key={id} className="tweet">
        <NavigationLink
          className="logo"
          stateKey="timeline"
          navigationData={{id: accountId}}
          navigating={e => !onTimeline || onTimeline(e, accountId)}>
          <img src={logo} alt={name}/>
        </NavigationLink>
        <NavigationLink
          className="details"
          stateKey="tweet"
          navigationData={{id}}>
            <div className="name">{name}</div>
            <div>{text}</div>
        </NavigationLink>
      </li>
    ))}
  </ul>
);

