import { useContext, useEffect } from 'react';
import { NavigationContext } from 'navigation-react';

var useSceneNavigating = (handler: () => void) => {
    var navigationEvent = useContext(NavigationContext);
    useEffect(() => {
        var {stateNavigator} = navigationEvent;
        var {crumbs} = stateNavigator.stateContext;
        var beforeNavigateHandler = (state, _data, url, _history, {url: oldUrl, state: oldState}) => {
            var crumb = url.split('crumb=').length - 1;
            var oldCrumb = oldUrl.split('crumb=').length - 1;
            var replace = crumb === oldCrumb && state !== oldState;
            if (crumbs.length === crumb && !replace)
                handler();
            return true;
        }
        stateNavigator.onBeforeNavigate(beforeNavigateHandler);
        return () => {
            stateNavigator.offBeforeNavigate(beforeNavigateHandler)
        };
    }, [navigationEvent, handler]);
};

export default useSceneNavigating;
