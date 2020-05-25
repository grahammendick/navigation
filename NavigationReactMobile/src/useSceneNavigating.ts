import { useContext, useEffect } from 'react';
import { NavigationContext } from 'navigation-react';

var useSceneNavigating = (handler: () => void) => {
    var navigationEvent = useContext(NavigationContext);
    useEffect(() => {
        var {stateNavigator} = navigationEvent;
        var {crumbs} = stateNavigator.stateContext;
        var beforeNavigateHandler = (_state, _data, url) => {
            var crumb = url.split('crumb=').length - 1;
            if (crumbs.length === crumb)
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
