import React from 'react';
import {NavigationLink} from 'navigation-react';

export default ({tweets, stateNavigator}) => (
  <div>
    <div className="banner">
      <h1>Home</h1>
      <svg class="_3k605FfW rn-4qtqp9 rn-yyyyoo rn-1xvli5t rn-dnmrzs rn-bnwqim rn-m6rgpd rn-lrvibr" viewBox="0 0 24 24">
        <g>
          <path d="M22.58 7.35L12.475 1.897a1 1 0 0 0-.95 0L1.425 7.35A1.002 1.002 0 0 0 1.9 9.231c.16 0 .324-.038.475-.12l.734-.396 1.59 11.25c.216 1.214 1.31 2.062 2.66 2.062h9.282c1.35 0 2.444-.848 2.662-2.088l1.588-11.225.737.398a1 1 0 0 0 .95-1.759zM12 15.435a3.25 3.25 0 1 1 0-6.5 3.25 3.25 0 0 1 0 6.5z"></path>
        </g>
      </svg>
    </div>
    <ul>
      {tweets.map(({account: {id: accountId, name, logo}, id, text}) => (
        <li className="tweet">
          <NavigationLink
            stateKey="tweet"
            navigationData={{id}}
            stateNavigator={stateNavigator}>
            <NavigationLink
              className="logo"
              stateKey="timeline"
              navigationData={{id: accountId}}
              navigating={e => {
                e.stopPropagation();
                return true;
              }}
              stateNavigator={stateNavigator}>
              <img src={logo} alt={name}/>
            </NavigationLink>
            <div className="details">
              <div className="name">{name}</div>
              <div>{text}</div>
            </div>
          </NavigationLink>
        </li>
      ))}
    </ul>
  </div>
);

