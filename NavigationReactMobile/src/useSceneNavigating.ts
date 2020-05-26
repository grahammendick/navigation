import { useContext, useEffect } from 'react';
import { NavigationContext } from 'navigation-react';

var useSceneNavigating = (handler: (data, url, history, currentContext) => void) => {
    var navigationEvent = useContext(NavigationContext);
    useEffect(() => {
        var {stateNavigator} = navigationEvent;
        var {crumbs} = stateNavigator.stateContext;
        var beforeNavigateHandler = (state, data, url, history, currentContext) => {
            var {url: currentUrl, state: currentState} = currentContext;
            var currentCrumb = currentUrl.split('crumb=').length - 1;
            var crumb = url.split('crumb=').length - 1;
            var replace = crumb === currentCrumb && state !== currentState;
            if (crumbs.length === crumb && !replace)
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
