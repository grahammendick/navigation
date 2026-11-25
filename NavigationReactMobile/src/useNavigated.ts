import { useContext, useEffect, useRef } from 'react';
import { NavigationContext, TransitionContext } from 'navigation-react';

var useNavigated = (handler: () => void) => {
    var navigationEvent = useContext(NavigationContext);
    var {navigationEvent: committedEvent, nextNavigationEvent} = useContext(TransitionContext);
    var pending = committedEvent !== nextNavigationEvent;
    var navigatedContext = useRef(null);
    useEffect(() => {
        if (pending) return;
        var {stateContext} = navigationEvent.stateNavigator;
        if (!navigationEvent['refetching'] && stateContext !== navigatedContext.current) {
            navigatedContext.current = stateContext;
            handler();
        }
    }, [navigationEvent, pending]);
};

export default useNavigated;
