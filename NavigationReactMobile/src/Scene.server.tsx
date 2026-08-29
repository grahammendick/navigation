import React from 'react';
import { SceneView } from 'navigation-react';

const Scene = ({stateKey, children, ...props}) => (
    <SceneView active={stateKey} name={stateKey} {...{...props, stateKey, __scene: true, __checkCrumb: true}}>
        {children}
    </SceneView>
);

export default Scene;
