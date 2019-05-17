import * as React from 'react';
import SharedElementContext from './SharedElementContext';

export default Component => props => (
    <SharedElementContext.Consumer>
        {(sharedElementRegistry) => <Component sharedElementRegistry={sharedElementRegistry} {...props} />}
    </SharedElementContext.Consumer>
);
  