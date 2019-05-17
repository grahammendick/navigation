import React from 'react';
import ReactDOM from 'react-dom';
import { NavigationHandler } from 'navigation-react';
import { Scene } from 'navigation-react-mobile';
import getStateNavigator from './getStateNavigator';
import Isomorphic from './Isomorphic';

var stateNavigator = getStateNavigator();

stateNavigator.start();

ReactDOM.hydrate(
    <NavigationHandler stateNavigator={stateNavigator}>
        <Isomorphic singleRoot={true} />
    </NavigationHandler>,
    document.getElementById('content')
);
