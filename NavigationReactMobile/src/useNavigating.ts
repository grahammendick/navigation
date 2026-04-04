import { useContext, useEffect, useRef } from 'react';
import { NavigationContext } from 'navigation-react';

var useNavigating = (handler: (data, url, history, currentContext) => void) => {
    var navigationEvent = useContext(NavigationContext);
    var offBeforeNavigate = useRef(null);
    useEffect(() => {
        var {stateNavigator} = navigationEvent;
        var beforeNavigateHandler = (state, data, url, history, currentContext) => {
            var crumb = url.split('crumb=').length - 1;
            var {crumbs: sceneCrumbs, state: sceneState} = stateNavigator.stateContext;
            if (sceneCrumbs.length === crumb && sceneState === state)
                handler(data, url, history, currentContext);
            return true;
        }
        var navigateHandler = (_oldState, state, data, _asyncData, stateContext) => {
            var crumb = stateContext.url.split('crumb=').length - 1;
            var {crumbs: sceneCrumbs, state: sceneState} = stateNavigator.stateContext;
            if (crumb < sceneCrumbs.length || (sceneCrumbs.length === crumb && sceneState !== state)) {
                stateNavigator.offBeforeNavigate(beforeNavigateHandler)
                stateNavigator.offNavigate(navigateHandler);
            }
        }
        stateNavigator.onBeforeNavigate(beforeNavigateHandler);
        stateNavigator.onNavigate(navigateHandler);
        offBeforeNavigate.current?.();
        offBeforeNavigate.current = () => {
            stateNavigator.offBeforeNavigate(beforeNavigateHandler)
        };
    }, [navigationEvent, handler]);
};

export default useNavigating;
