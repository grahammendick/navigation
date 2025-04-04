'use client'
import { useContext, useEffect } from 'react';
import { NavigationContext } from 'navigation-react';

var useNavigating = (handler: (data, url, history, currentContext) => void) => {
    var navigationEvent = useContext(NavigationContext);
    useEffect(() => {
        var {stateNavigator} = navigationEvent;
        var beforeNavigateHandler = (state, data, url, history, currentContext) => {
            var crumb = url.split('crumb=').length - 1;
            var {crumbs: sceneCrumbs, state: sceneState} = stateNavigator.stateContext;
            if (sceneCrumbs.length === crumb && sceneState === state)
                handler(data, url, history, currentContext);
            return true;
        }
        stateNavigator.onBeforeNavigate(beforeNavigateHandler);
        return () => {
            stateNavigator.offBeforeNavigate(beforeNavigateHandler)
        };
    }, [navigationEvent, handler]);
};

export default useNavigating;
