import React from 'react';
import {SharedElementMotion} from 'navigation-react-mobile';

export default (props) => (
  <SharedElementMotion
    {...props}
    onAnimating={(name, ref) => {ref.style.opacity = 0}}
    onAnimated={(name, ref) => {ref.style.opacity = 1}}>
    {({left, top, width, height, fontSize, fontColor}, name, {color}) => (
      !name.startsWith('text') ? <div key={name}
        style={{
          position: 'absolute',
          left,
          top,
          width,
          height,
          backgroundColor: color,
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
          fontWeight: 'bold',
          color: `rgb(${Array(3).fill(Math.round(fontColor)).join(',')})`,
          zIndex: 1,
        }}>
          {color}
        </div>
    )}
  </SharedElementMotion>
);
