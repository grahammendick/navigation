import React from 'react';
import {NavigationBackLink} from 'navigation-react';

export default ({title}) => (
  <div className="banner">
    <NavigationBackLink distance={1}>
      <svg className="back" viewBox="0 0 24 24">
        <g>
          <path d="M20 11H7.414l4.293-4.293a1 1 0 0 0-1.414-1.414l-6 6a1 1 0 0 0 0 1.414l6 6a.996.996 0 0 0 1.414 0 1 1 0 0 0 0-1.414L7.414 13H20a1 1 0 1 0 0-2z"></path>
        </g>
      </svg>
    </NavigationBackLink>
    <h1>{title}</h1>
  </div>
);

