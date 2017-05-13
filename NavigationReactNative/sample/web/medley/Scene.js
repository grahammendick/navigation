import React from 'react';

const nextDirection = {
  North: 'East',
  East: 'South',
  South: 'West',
  West: 'North',
};

export default class Scene extends React.Component {
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
    const {direction, color, stateNavigator} = this.props;
    return (
      <div style={{
          ...styles.scene,
          backgroundColor: color
        }}>
        <div
          style={styles.text}
          onClick={() => {
            if (this.url === stateNavigator.stateContext.url)
              stateNavigator.navigate(`scene${nextDirection[direction]}`);          
          }}>
          {direction} {this.crumbs.length}
        </div>
        {stateNavigator.canNavigateBack(1) && <div
          style={styles.text}
          onClick={() => {
            if (this.url === stateNavigator.stateContext.url)
              stateNavigator.navigateBack(1);
          }}>
          Back
        </div>}
      </div>
    )
  };
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
