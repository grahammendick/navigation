import React from 'react';

export default ({ stateNavigator }) => (
  stateNavigator.stateContext.state.getScene(stateNavigator.stateContext.data)
);
