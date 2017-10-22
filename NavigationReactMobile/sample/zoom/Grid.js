import React from 'react';
import {NavigationLink} from 'navigation-react';
import {SharedElement} from 'navigation-react-mobile';

const colors = [
  'maroon', 'red', 'crimson', 'orange', 'brown', 'sienna', 'olive',
  'purple', 'fuchsia', 'indigo', 'green', 'navy', 'blue', 'teal', 'black'
];

export default ({stateNavigator}) => (
  <ul>
    {colors.map(color => (
      <SharedElement
        key={color}
        name={color}
        data={{color}}
        stateNavigator={stateNavigator}>
        <li style={{backgroundColor: color}}>
          <NavigationLink            
            stateKey="detail"
            navigationData={{color}}
            stateNavigator={stateNavigator}>
            <div>
              <SharedElement
                data={{color, fontSize: '150%', fontColor: '#fff'}}
                name={`text${color}`}
                stateNavigator={stateNavigator}>
                <div>{color}</div>
              </SharedElement>
            </div>
          </NavigationLink>
        </li>
      </SharedElement>
    ))}
  </ul>
);

