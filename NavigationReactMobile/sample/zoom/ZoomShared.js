import React from 'react';
import {SharedElementMotion} from 'navigation-react-mobile';

export default (props) => (
  <SharedElementMotion
    {...props}
    onAnimating={(name, ref) => {ref.style.opacity = 0}}
    onAnimated={(name, ref) => {ref.style.opacity = 1}}>
    {({fontColor, ...style}, name, {left, top, width, height, fontSize, color}) => (
      !name.startsWith('text') ? <div key={name}
        style={{
          position: 'absolute',
          left,
          top,
          width,
          height,
          backgroundColor: color,
          transformOrigin: 'top left',
          transform: `translate(${style.left - left}px, ${style.top - top}px) scale(${style.width/width}, ${style.height/height})`,
        }}>
      </div> : <div key={name}     
        style={{
          position: 'absolute',
          left,
          top,
          width,
          height,
          fontSize: `${fontSize}%`,
          textAlign: 'center',
          color: `rgb(${Array(3).fill(Math.round(fontColor)).join(',')})`,
          zIndex: 1,
          transformOrigin: 'top left',
          transform: `translate(${style.left - left}px, ${style.top - top}px) scale(${style.width/width}, ${style.height/height})`,
        }}>
          {color}
        </div>
    )}
  </SharedElementMotion>
);
