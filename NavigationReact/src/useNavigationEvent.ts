import React, { useContext } from 'react';
import NavigationContext from './NavigationContext';

const useNavigationEvent = () => useContext(NavigationContext);

export default useNavigationEvent;
