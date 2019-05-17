import React from 'react';
import {NavigationMotion} from 'navigation-react-mobile';

export default () => (
    <NavigationMotion
        unmountedStyle={{opacity: 1, translate: 100}}
        mountedStyle={{opacity: 1, translate: 0}}
        crumbStyle={{opacity: 0, translate: -100}}>
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
);
