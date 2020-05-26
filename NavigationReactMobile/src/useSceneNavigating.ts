import { useContext, useEffect } from 'react';
import { NavigationContext } from 'navigation-react';

var useSceneNavigating = (handler: (data, url, history, currentContext) => void) => {
    var navigationEvent = useContext(NavigationContext);
    useEffect(() => {
        var {stateNavigator} = navigationEvent;
        var beforeNavigateHandler = (state, data, url, history, currentContext) => {
            var crumb = url.split('crumb=').length - 1;
            var {crumbs, state: currentState} = stateNavigator.stateContext;
            if (crumbs.length === crumb && currentState === state)
                handler(data, url, history, currentContext);
            return true;
        }
        stateNavigator.onBeforeNavigate(beforeNavigateHandler);
        return () => {
            stateNavigator.offBeforeNavigate(beforeNavigateHandler)
        };
    }, [navigationEvent, handler]);
};

export default useSceneNavigating;
