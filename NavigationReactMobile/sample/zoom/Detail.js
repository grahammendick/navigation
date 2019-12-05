import React from 'react';
import {NavigationBackLink} from 'navigation-react';
import {SharedElement} from 'navigation-react-mobile';

export default ({color}) => (
  <div className="color">
    <NavigationBackLink
      distance={1}
      navigating={e => {
        e.preventDefault();
        history.back();
        return false;
      }}>
      X
    </NavigationBackLink>
    <SharedElement
      name={color}
      data={{color}}>
      <div style={{backgroundColor: color}} />
    </SharedElement>
    <div>
      <SharedElement
        name={`text${color}`}
        data={{color, fontSize: 300, fontColor: 0}}>
        <span>{color}</span>
      </SharedElement>
    </div>
  </div>
);

