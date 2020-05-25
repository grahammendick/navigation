import { useContext, useEffect, useRef } from 'react';
import { NavigationContext } from 'navigation-react';

var useSceneNavigated = (handler: () => void) => {
    var navigationEventRef = useRef(null);
    var navigationEvent = useContext(NavigationContext);
    useEffect(() => {
        if (navigationEvent !== navigationEventRef.current)
            handler();
        navigationEventRef.current = navigationEvent;
    }, [navigationEvent, handler]);
};

export default useSceneNavigated;
