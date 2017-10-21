import React from 'react';
import ReactDOM from 'react-dom';
import createStateNavigator from './createStateNavigator';
import Zoom from './Zoom';

const stateNavigator = createStateNavigator();

ReactDOM.render(
  <Zoom stateNavigator={stateNavigator} />,
  document.getElementById('content')
)

var {state, data} = stateNavigator.parseLink(stateNavigator.historyManager.getCurrentUrl());
var link = stateNavigator.fluent()
    .navigate('grid')
    .navigate(state.key, data).url;
stateNavigator.start(link);
