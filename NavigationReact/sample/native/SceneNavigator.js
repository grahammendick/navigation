import React, { Component } from 'react';

class SceneNavigator extends Component{
  constructor(props) {
    super(props);
    this.handleNavigate = this.handleNavigate.bind(this);
  }

  handleNavigate() {
    this.forceUpdate();
  }

  componentDidMount() {
    this.props.stateNavigator.onNavigate(this.handleNavigate);
  }
  
  componentWillUnmount() {
    this.props.stateNavigator.offNavigate(this.handleNavigate);
  }

  render() {
    return this.props.stateNavigator.stateContext.state
      .getScene(this.props.stateNavigator.stateContext.data);
  }
}

export default SceneNavigator;
