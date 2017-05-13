import React from 'react';
import ReactDOM from 'react-dom';
import createStateNavigator from './createStateNavigator';
import Medley from './Medley';

const stateNavigator = createStateNavigator();

ReactDOM.render(
  <Medley stateNavigator={stateNavigator} />,
  document.getElementById('content')
)
