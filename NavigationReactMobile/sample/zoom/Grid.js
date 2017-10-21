import React from 'react';
import {SharedElement} from 'navigation-react-mobile';

const colors = [
  'maroon', 'red', 'crimson', 'orange', 'brown', 'sienna', 'olive',
  'purple', 'fuchsia', 'indigo', 'green', 'navy', 'blue', 'teal', 'black'
];

export default ({stateNavigator}) => {
  const {url} = stateNavigator.stateContext;
  return (
    <div style={styles.grid}>
      <div style={styles.colors}>
        {colors.map(color => (
          <SharedElement
            key={color}
            name={color}
            data={{color}}
            stateNavigator={stateNavigator}>
            <div
              style={{
                backgroundColor: color,
                ...styles.color
              }}
              onClick={() => {
                if (url === stateNavigator.stateContext.url)
                  stateNavigator.navigate('detail', {color});
              }}>
              <div>
                <SharedElement
                  data={{color, fontSize: 20, fontColor: '#fff'}}
                  name={`text${color}`}
                  stateNavigator={stateNavigator}>
                  <div style={styles.text}>{color}</div>
                </SharedElement>
              </div>
            </div>
          </SharedElement>
        ))}
      </div>
    </div>
  );
};

const styles = {
  grid: {
    width: '370px',
    height: '460px',
    overflow: 'auto',
  },
  colors: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 50,
  },
  color: {
    display: 'flex',
    width: 100,
    height: 150,
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: '#fff',
    fontSize: 20,
    textAlign: 'center',
    fontWeight: 'bold',
  }
};