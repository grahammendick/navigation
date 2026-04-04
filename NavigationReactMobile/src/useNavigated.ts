import { useContext, useEffect, useRef } from 'react';
import { NavigationContext } from 'navigation-react';

var useNavigated = (handler: () => void) => {
    var navigationEvent = useContext(NavigationContext);
    var preNavigationEvent = useRef(null);
    useEffect(() => {
        if (!preNavigationEvent.current || navigationEvent !== preNavigationEvent.current) handler();
        preNavigationEvent.current = navigationEvent;
    }, [navigationEvent]);
};

export default useNavigated;
