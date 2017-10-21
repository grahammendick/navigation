import React from 'react';
import {SharedElement} from 'navigation-react-mobile';

const colors = [
  'maroon', 'red', 'crimson', 'orange', 'brown', 'sienna', 'olive',
  'purple', 'fuchsia', 'indigo', 'green', 'navy', 'blue', 'teal', 'black'
];

export default ({stateNavigator}) => {
  const {url} = stateNavigator.stateContext;
  return (
    <div>
      <div>
        {colors.map(color => (
          <SharedElement
            key={color}
            name={color}
            data={{color}}
            stateNavigator={stateNavigator}>
            <div
              style={{backgroundColor: color}}
              onClick={() => {
                if (url === stateNavigator.stateContext.url)
                  stateNavigator.navigate('detail', {color});
              }}>
              <div>
                <SharedElement
                  data={{color, fontSize: 20, fontColor: '#fff'}}
                  name={`text${color}`}
                  stateNavigator={stateNavigator}>
                  <div>{color}</div>
                </SharedElement>
              </div>
            </div>
          </SharedElement>
        ))}
      </div>
    </div>
  );
};
