'use client'
import { useContext, useEffect } from 'react';
import { NavigationContext } from 'navigation-react';

var useUnloading = (handler: (state, data, url, history, crumbs) => boolean) => {
    var navigationEvent = useContext(NavigationContext);
    useEffect(() => {
        var {stateNavigator} = navigationEvent;
        var beforeNavigateHandler = (state, data, url, history, currentContext) => {
            var crumb = url.split('crumb=').length - 1;
            var {crumbs: sceneCrumbs, state: sceneState} = stateNavigator.stateContext;
            if (!(sceneCrumbs.length === crumb && sceneState === state)
                && stateNavigator.stateContext === currentContext) {
                var {crumbs} = stateNavigator.parseLink(url);
                return handler(state, data, url, history, crumbs);
            }
            return true;
        }
        stateNavigator.onBeforeNavigate(beforeNavigateHandler);
        return () => {
            stateNavigator.offBeforeNavigate(beforeNavigateHandler)
        };
    }, [navigationEvent, handler]);
};

export default useUnloading;
