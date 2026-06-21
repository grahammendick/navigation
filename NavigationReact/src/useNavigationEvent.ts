import { useContext } from 'react';
import NavigationContext from './NavigationContext.js';

const useNavigationEvent = () => useContext(NavigationContext);
export default useNavigationEvent;
