import React from 'react';
import ReactDOM from 'react-dom';
import { NavigationHandler } from 'navigation-react';
import getStateNavigator from './getStateNavigator';
import App from './App';

var stateNavigator = getStateNavigator();
registerControllers(stateNavigator);

stateNavigator.start();

ReactDOM.hydrate(
    <NavigationHandler stateNavigator={stateNavigator}>
        <App />
    </NavigationHandler>,
    document.getElementById('content')
);

function registerControllers(stateNavigator) {
    stateNavigator.states.people.navigating = 
    stateNavigator.states.person.navigating = function(data, url, navigate) {
        fetchData(url, navigate);
    }
}

function fetchData(url, navigate) {
    if (serverProps) {
        navigate(serverProps);
        serverProps = null;
        return;
    }
    var req = new XMLHttpRequest();
    req.onreadystatechange = function() {
        if (req.readyState === 4){
            navigate(JSON.parse(req.responseText));
        }
    };
    req.open('get', url);
    req.setRequestHeader('Content-Type', 'application/json');
    req.send(null);
}
