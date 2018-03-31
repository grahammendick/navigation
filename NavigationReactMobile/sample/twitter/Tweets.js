import React from 'react';
import {NavigationLink} from 'navigation-react';
import {SharedElement} from 'navigation-react-mobile';

export default ({tweets, onTimeline}) => (
  <ul>
    {tweets.map(({account: {id: accountId, name, logo}, id, text, photo}) => (
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
        {photo && <NavigationLink
          className="photo"
          stateKey="photo"
          navigationData={{id}}>
            <SharedElement
              data={{src: photo, enable: false}}
              name={photo}>
              <img src={photo}/>
            </SharedElement>
        </NavigationLink>}
      </li>
    ))}
  </ul>
);

