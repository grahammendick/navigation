import React from 'react';
import ReactDOM from 'react-dom';
import createStateNavigator from './createStateNavigator';

const stateNavigator = createStateNavigator();

ReactDOM.render(
  null,
  document.getElementById('content')
)

stateNavigator.start();
