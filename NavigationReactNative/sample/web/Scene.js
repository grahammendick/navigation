import React from 'react';

const nextDirection = {
  North: 'East',
  East: 'South',
  South: 'West',
  West: 'North',
};

export default ({direction, color, stateNavigator}) => {
  const {url, crumbs} = stateNavigator.stateContext;
  return (
    <div style={{
        ...styles.scene,
        backgroundColor: color
      }}>
      <div
        style={styles.text}
        onClick={() => {
          if (url === stateNavigator.stateContext.url)
            stateNavigator.navigate(`scene${nextDirection[direction]}`);          
        }}>
        {direction} {crumbs.length}
      </div>
      <div
        style={styles.text}
        onClick={() => {
          if (url === stateNavigator.stateContext.url)
            stateNavigator.navigateBack(1);
        }}>
        Back
      </div>
    </div>
  )
};

const styles = {
  scene: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '300px',
    height: '460px',
  },
  text: {
    fontSize: 40,
    color: '#fff',
    fontWeight: 'bold',
  },
};
