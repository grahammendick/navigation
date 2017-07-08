import React from 'react';
import SharedElementMotion from '../SharedElementMotion';

export default ({sharedElements}) => (
  <SharedElementMotion
    sharedElements={sharedElements}
    style={styles.motion}
    onAnimating={(name, ref) => {ref.style.opacity = 0}}
    onAnimated={(name, ref) => {ref.style.opacity = 1}}>
    {({x, y, w, h, fontSize, fontColor}, name, {color}) => (
      !name.startsWith('text') ? <div key={name}
        style={{
          position: 'absolute',
          left: x,
          top: y,
          width: w,
          height: h,
          backgroundColor: color,
        }}>
      </div> : <div key={name}     
        style={{
          position: 'absolute',
          left: x,
          top: y,
          width: w,
          height: h,
          fontSize,
          textAlign: 'center',
          fontWeight: 'bold',
          color: fontColor,
          zIndex: 1,
        }}>
          {color}
        </div>
    )}
  </SharedElementMotion>
);

const styles = {
  motion: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: 'transparent',
  },
};

