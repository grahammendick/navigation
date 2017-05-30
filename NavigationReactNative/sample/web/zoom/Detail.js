import React from 'react';
import SharedElement from '../SharedElement';

export default ({color, stateNavigator}) => {
  const {url} = stateNavigator.stateContext;
  return (
    <div style={styles.detail}>
      <div
        onClick={() => {
          if (url === stateNavigator.stateContext.url)
            stateNavigator.navigateBack(1);
        }}>
        X
      </div>
      <SharedElement
        name={color}
        data={{color, hide: true}}
        stateNavigator={stateNavigator}>
        <div
          style={{
            backgroundColor: color,
            ...styles.color
          }} />
      </SharedElement>
      <SharedElement
        name={`text${color}`}
        data={{color, fontSize: 80, fontColor: '#000', hide: true}}
        stateNavigator={stateNavigator}>
        <div style={styles.text}>{color}</div>
      </SharedElement>
    </div>
  );
};

const styles = {
  detail: {
    width: '370px',
    height: '460px',
    display: 'flex',
    flexDirection: 'column',
  },
  back: {
    height: 50,
    fontSize: 20,
    color: '#000',
    fontWeight: 'bold',
    paddingTop: 20,
    paddingLeft: 20,
  },
  color: {
    flex: .6,
    marginLeft: 15,
    marginRight: 15,
  },
  text:{
    flex: .4,
    fontSize: 80,
    color: '#000',
    textAlign:'center',
    fontWeight: 'bold',
  },
};