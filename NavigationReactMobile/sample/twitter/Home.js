import React from 'react';
import {NavigationLink} from 'navigation-react';
import Tweets from './Tweets';

export default ({tweets}) => (
  <div>
    <div className="tabs">
      <h1>Home</h1>
      <svg className="home" viewBox="0 0 24 24">
        <g>
          <path d="M22.58 7.35L12.475 1.897a1 1 0 0 0-.95 0L1.425 7.35A1.002 1.002 0 0 0 1.9 9.231c.16 0 .324-.038.475-.12l.734-.396 1.59 11.25c.216 1.214 1.31 2.062 2.66 2.062h9.282c1.35 0 2.444-.848 2.662-2.088l1.588-11.225.737.398a1 1 0 0 0 .95-1.759zM12 15.435a3.25 3.25 0 1 1 0-6.5 3.25 3.25 0 0 1 0 6.5z"></path>
        </g>
      </svg>
    </div>
    <Tweets tweets={tweets} />
  </div>
);

