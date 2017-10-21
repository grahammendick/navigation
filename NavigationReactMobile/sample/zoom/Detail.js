import React from 'react';
import {SharedElement} from 'navigation-react-mobile';

export default ({color, stateNavigator}) => {
  const {url} = stateNavigator.stateContext;
  return (
    <div>
      <div
        onClick={() => {
          if (url === stateNavigator.stateContext.url)
            stateNavigator.navigateBack(1);
        }}>
        X
      </div>
      <SharedElement
        name={color}
        data={{color}}
        stateNavigator={stateNavigator}>
        <div style={{backgroundColor: color}} />
      </SharedElement>
      <SharedElement
        name={`text${color}`}
        data={{color, fontSize: 80, fontColor: '#000'}}
        stateNavigator={stateNavigator}>
        <div>{color}</div>
      </SharedElement>
    </div>
  );
};
