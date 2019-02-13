import React from 'react';
import {SharedElementMotion} from 'navigation-react-mobile';

export default (props) => (
  <SharedElementMotion
    {...props}
    onAnimating={(name, ref) => {ref.style.opacity = 0}}
    onAnimated={(name, ref) => {ref.style.opacity = 1}}>
    {(style, name, {left, top, width, height, color}) => (
      <div key={name}
        style={{
          position: 'absolute',
          left, top, width, height,
          transformOrigin: 'top left',
          transform: `
            translate(${style.left - left}px, ${style.top - top}px)
            scale(${style.width / width}, ${style.height / height})
          `,      
            backgroundColor: color,
        }}>
      </div>
    )}
  </SharedElementMotion>
);
