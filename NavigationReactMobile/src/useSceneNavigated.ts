import { useContext, useEffect, useMemo, useRef } from 'react';
import { NavigationContext } from 'navigation-react';

var useSceneNavigated  = (handler: () => void) => {
    var prevContext = useRef(null);
    var navigationEvent = useContext(NavigationContext);
    useMemo(() => {
        if (navigationEvent !== prevContext.current)
            handler();
    }, [navigationEvent, handler]);
    useEffect(() => {
        prevContext.current = navigationEvent;
    }, [navigationEvent]);
};

export default useSceneNavigated;