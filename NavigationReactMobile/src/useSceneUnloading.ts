import { useContext, useEffect } from 'react';
import { NavigationContext } from 'navigation-react';

var useSceneUnloading = (handler: () => boolean) => {
    var navigationEvent = useContext(NavigationContext);
    useEffect(() => {
        var {stateNavigator} = navigationEvent;
        var beforeNavigateHandler = (state, _data, url, _history, currentContext) => {
            var crumb = url.split('crumb=').length - 1;
            var {crumbs, state: sceneState} = stateNavigator.stateContext;
            if (stateNavigator.stateContext === currentContext
                && !(crumbs.length === crumb && sceneState === state))
                return handler();
            return true;
        }
        stateNavigator.onBeforeNavigate(beforeNavigateHandler);
        return () => {
            stateNavigator.offBeforeNavigate(beforeNavigateHandler)
        };
    }, [navigationEvent, handler]);
};

export default useSceneUnloading;
