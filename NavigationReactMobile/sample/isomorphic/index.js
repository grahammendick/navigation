import React from 'react';
import ReactDOM from 'react-dom';
import { NavigationHandler } from 'navigation-react';
import { NavigationMotion } from 'navigation-react-mobile';
import getStateNavigator from './getStateNavigator';

var stateNavigator = getStateNavigator();
stateNavigator.start();

ReactDOM.hydrate(
    <NavigationHandler stateNavigator={stateNavigator}>
        <NavigationMotion
            unmountedStyle={{opacity: 1, translate: 100}}
            mountedStyle={{opacity: 1, translate: 0}}
            crumbStyle={{opacity: 0, translate: 0}}>
            {({opacity, translate}, scene, key, active) => (
                <div key={key}
                    className="scene"
                    style={{
                        opacity,
                        transform: `translate(${translate}%)`,
                    }}>
                    {scene}
                </div>
            )}
        </NavigationMotion>
    </NavigationHandler>,
    document.getElementById('content')
);
