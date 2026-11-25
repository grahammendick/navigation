import { useContext, useEffect, useRef } from 'react';
import { NavigationContext } from 'navigation-react';

var useNavigated = (handler: () => void) => {
    var navigationEvent = useContext(NavigationContext);
    var navigatedContext = useRef(null);
    useEffect(() => {
        var {stateContext} = navigationEvent.stateNavigator;
        if (!navigationEvent['refetching'] && stateContext !== navigatedContext.current) {
            navigatedContext.current = stateContext;
            handler();
        }
    }, [navigationEvent]);
};

export default useNavigated;
