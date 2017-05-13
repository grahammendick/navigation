import React from 'react';
import SharedElement from '../SharedElement';

const colors = [
  'maroon', 'red', 'crimson', 'orange', 'brown', 'sienna', 'olive',
  'purple', 'fuchsia', 'indigo', 'green', 'navy', 'blue', 'teal', 'black'
];

export default class Grid extends React.Component {
  constructor(props, context) {
    super(props, context);
    const {url, crumbs} = props.stateNavigator.stateContext;
    this.url = url;
    this.crumbs = crumbs;
  }
  shouldComponentUpdate(props) {
    return this.url === props.stateNavigator.stateContext.url;
  }
  render() {
    const {stateNavigator} = this.props;
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
                style={[
                  {backgroundColor: color},
                  styles.color
                ]}
                onClick={() => {
                  if (this.url === stateNavigator.stateContext.url)
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
  }
};

const styles = {
  grid: {
    flex: 1,
    backgroundColor: '#fff',
  },
  colors: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 50,
  },
  color: {
    width: 100,
    height: 150,
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 20,
    justifyContent: 'center',
  },
  text: {
    color: '#fff',
    fontSize: 20,
    textAlign: 'center',
    fontWeight: 'bold',
  }
};