import { useContext, useEffect, useRef } from 'react';
import { NavigationContext } from 'navigation-react';

var useNavigated = (handler: () => void) => {
    var navigationEvent = useContext(NavigationContext);
    var prevNavigationEvent = useRef(null);
    useEffect(() => {
        if (!prevNavigationEvent.current || navigationEvent !== prevNavigationEvent.current) handler();
        prevNavigationEvent.current = navigationEvent;
    }, [navigationEvent]);
};

export default useNavigated;
