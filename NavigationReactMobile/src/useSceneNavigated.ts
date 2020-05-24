import { useContext, useEffect, useRef } from 'react';
import { NavigationContext } from 'navigation-react';

var useSceneNavigated = (handler: () => void) => {
    var prevNavigationEvent = useRef(null);
    var navigationEvent = useContext(NavigationContext);
    useEffect(() => {
        if (navigationEvent !== prevNavigationEvent.current)
            handler();
        prevNavigationEvent.current = navigationEvent;
    }, [navigationEvent, handler]);
};

export default useSceneNavigated;
