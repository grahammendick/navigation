import React from 'react';
import {SharedElementMotion} from 'navigation-react-mobile';

export default (props) => (
  <SharedElementMotion
    {...props}
    onAnimating={(name, ref) => {ref.style.opacity = 0}}
    onAnimated={(name, ref) => {ref.style.opacity = 1}}>
    {({fontColor, ...style}, name, {left, top, width, height, fontSize, color}) => {
      var position = {
        position: 'absolute',
        left, top, width, height,
        transformOrigin: 'top left',
        transform: `
          translate(${style.left - left}px, ${style.top - top}px)
          scale(${style.width / width}, ${style.height / height})
        `,      
      };
      return !name.startsWith('text') ? <div key={name}
        style={{
          ...position,
          backgroundColor: color,
        }}>
      </div> : <div key={name}     
        style={{
          ...position,
          fontSize: `${fontSize}%`,
          color: `rgb(${Array(3).fill(Math.round(fontColor)).join(',')})`,
          zIndex: 1,
        }}>
          {color}
        </div>
    }}
  </SharedElementMotion>
);
