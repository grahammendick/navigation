import SharedElementRegistry from './SharedElementRegistry';
import * as React from 'react';

export default React.createContext(new SharedElementRegistry());
