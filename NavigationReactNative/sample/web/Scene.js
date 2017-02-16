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
    <div style={{backgroundColor: color}}>
      <div
        onClick={() => {
          if (url === stateNavigator.stateContext.url)
            stateNavigator.navigate(`scene${nextDirection[direction]}`);          
        }}>
        {direction} {crumbs.length}
      </div>
      <div
        onClick={() => {
          if (url === stateNavigator.stateContext.url)
            stateNavigator.navigateBack(1);
        }}>
        Back
      </div>
    </div>
  )
};
