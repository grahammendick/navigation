import React from 'react';
import {NavigationLink} from 'navigation-react';
import {SharedElement} from 'navigation-react-mobile';

const colors = [
  'maroon', 'red', 'crimson', 'orange', 'brown', 'sienna', 'olive',
  'purple', 'fuchsia', 'indigo', 'green', 'navy', 'blue', 'teal', 'black'
];

export default ({stateNavigator}) => (
  <div>
    <div>
      {colors.map(color => (
        <SharedElement
          key={color}
          name={color}
          data={{color}}
          stateNavigator={stateNavigator}>
          <NavigationLink
            style={{backgroundColor: color}}
            stateKey="details"
            navigationData={{color}}
            stateNavigator={stateNavigator}>
            <div>
              <SharedElement
                data={{color, fontSize: 20, fontColor: '#fff'}}
                name={`text${color}`}
                stateNavigator={stateNavigator}>
                <div>{color}</div>
              </SharedElement>
            </div>
          </NavigationLink>
        </SharedElement>
      ))}
    </div>
  </div>
);

