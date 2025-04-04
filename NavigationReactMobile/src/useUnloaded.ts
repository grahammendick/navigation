'use client'
import { useContext, useEffect } from 'react';
import { NavigationContext } from 'navigation-react';

var useUnloaded = (handler: (state, data, stateContext) => void) => {
    var navigationEvent = useContext(NavigationContext);
    useEffect(() => {
        var cancelled = false;
        var {stateNavigator} = navigationEvent;
        var navigateHandler = (_oldState, state, data, _asyncData, stateContext) => {
            var crumb = stateContext.url.split('crumb=').length - 1;
            var {crumbs: sceneCrumbs, state: sceneState} = stateNavigator.stateContext;
            if (!(sceneCrumbs.length === crumb && sceneState === state)
                && stateNavigator.stateContext.url === stateContext.oldUrl && !cancelled)
                handler(state, data, stateContext);
        }
        stateNavigator.onNavigate(navigateHandler);
        return () => {
            cancelled = true;
            stateNavigator.offNavigate(navigateHandler)
        };
    }, [navigationEvent, handler]);
};

export default useUnloaded;
