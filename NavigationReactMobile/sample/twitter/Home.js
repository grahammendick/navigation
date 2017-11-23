import React from 'react';
import {NavigationLink} from 'navigation-react';

export default ({tweets, stateNavigator}) => (
  <div>
    <h1>Home</h1>
    <ul>
      {tweets.map(({account: {id: accountId, name, logo}, id, text}) => (
        <li className="tweet">
          <NavigationLink
            stateKey="tweet"
            navigationData={{id}}
            stateNavigator={stateNavigator}>
            <NavigationLink
              stateKey="timeline"
              navigationData={{id: accountId}}
              stateNavigator={stateNavigator}>
              <img src={logo}/>
            </NavigationLink>
          </NavigationLink>
        </li>
      ))}
    </ul>
  </div>
);

