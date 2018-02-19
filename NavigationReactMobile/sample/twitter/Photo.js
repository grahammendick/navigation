import React from 'react';
import {NavigationBackLink} from 'navigation-react';
import {SharedElement} from 'navigation-react-mobile';

export default ({photo}) => (
  <div className="photo">
    <NavigationBackLink distance={1}>
      <svg viewBox="0 0 24 24">
        <g>
          <path d="M13.414 12l5.793-5.793a1 1 0 0 0-1.414-1.414L12 10.586 6.207 4.793a1 1 0 0 0-1.414 1.414L10.586 12l-5.793 5.793a1 1 0 0 0 1.414 1.414L12 13.414l5.793 5.793a.996.996 0 0 0 1.414 0 1 1 0 0 0 0-1.414L13.414 12z"></path>
        </g>
      </svg>
    </NavigationBackLink>
    <SharedElement
      data={{src: photo, enable: true}}
      name={photo}>
      <img src={photo}/>
    </SharedElement>
  </div>
);

