import React from 'react';
import {NavigationLink} from 'navigation-react';
import {SharedElement} from 'navigation-react-mobile';

const colors = [
  'maroon', 'red', 'crimson', 'orange', 'brown', 'sienna', 'olive',
  'purple', 'fuchsia', 'indigo', 'green', 'navy', 'blue', 'teal', 'black'
];

export default () => (
  <ul>
    {colors.map(color => (
      <SharedElement
        key={color}
        name={color}
        data={{color}}>
        <li style={{backgroundColor: color}}>
          <NavigationLink            
            stateKey="detail"
            navigationData={{color}}>
            <div>
              <SharedElement
                data={{color, fontSize: 150, fontColor: 255}}
                name={`text${color}`}>
                <span>{color}</span>
              </SharedElement>
            </div>
          </NavigationLink>
        </li>
      </SharedElement>
    ))}
  </ul>
);

