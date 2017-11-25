import React from 'react';
import ReactDOM from 'react-dom';
import createStateNavigator from './createStateNavigator';
import Twitter from './Twitter';

const stateNavigator = createStateNavigator();

ReactDOM.render(
  <Twitter stateNavigator={stateNavigator} />,
  document.getElementById('content')
)

stateNavigator.start();
