import * as React from 'react';
import SharedElementRegistryProxy from './SharedElementRegistryProxy';

export default React.createContext(new SharedElementRegistryProxy());
