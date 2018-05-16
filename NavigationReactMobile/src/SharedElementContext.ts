import * as React from 'react';
import SharedElementRegistry from './SharedElementRegistry';

export default React.createContext(new SharedElementRegistry());
