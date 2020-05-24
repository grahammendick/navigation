import { useContext, useMemo, useRef } from 'react';
import { NavigationContext } from 'navigation-react';

var useSceneNavigating  = (handler: () => void) => {
    var prevContext = useRef(null);
    var navigationEvent = useContext(NavigationContext);
    useMemo(() => {
        if (navigationEvent !== prevContext.current)
            handler();
        prevContext.current = navigationEvent;
    }, [navigationEvent, handler]);
};

export default useSceneNavigating;