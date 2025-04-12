import React from 'react';
import SharedElementRegistry from './SharedElementRegistry.js';

export default React.createContext(new SharedElementRegistry());
