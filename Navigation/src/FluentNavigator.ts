import Crumb from './config/Crumb';
import State from './config/State';
import StateContext from './StateContext';
import StateHandler from './StateHandler';

interface FluentNavigator {
    url: string,
    navigate(stateKey: string, navigationData?: any): FluentNavigator;
    navigateBack(distance: number): FluentNavigator;
    refresh(navigationData?: any): FluentNavigator;
}

function createFluentNavigator(states: { [index: string]: State }, stateHandler: StateHandler, stateContext = new StateContext()): FluentNavigator {
    function getCrumbTrail(state: State, navigationData: any, crumbs: Crumb[], nextCrumb: Crumb): Crumb[] {
        if (!state.trackCrumbTrail)
            return [];
        crumbs = crumbs.slice();
        if (nextCrumb)
            crumbs.push(nextCrumb);
        return state.truncateCrumbTrail(state, navigationData, crumbs);
    }

    function navigateLink(state: State, data: any, crumbs: Crumb[], url: string): FluentNavigator {
        var fluentContext = new StateContext();
        fluentContext.state = state;
        fluentContext.url = url;
        fluentContext.crumbs = crumbs;
        fluentContext.data = data;
        fluentContext.nextCrumb = new Crumb(data, state, url, stateHandler.getLink(state, data), false);
        return createFluentNavigator(states, stateHandler, fluentContext);
    }

    return {
        url: stateContext.url,
        navigate: function(stateKey: string, navigationData?: any): FluentNavigator {
            var state = states[stateKey];
            var {crumbs, nextCrumb} = stateContext;
            if (!state)
                throw new Error(stateKey + ' is not a valid State');
            if (typeof navigationData === 'function')
                navigationData = navigationData(stateContext.data);
            var url = stateHandler.getLink(state, navigationData, crumbs, nextCrumb);
            if (url == null)
                throw new Error('Invalid route data, a mandatory route parameter has not been supplied a value');
            var data = { ...state.defaults, ...navigationData };
            var crumbs = getCrumbTrail(state, data, crumbs, nextCrumb);
            return navigateLink(state, data, crumbs, url);
        },
        navigateBack: function(distance: number): FluentNavigator {
            var {crumbs} = stateContext;
            if (!(distance <= crumbs.length && distance > 0))
                throw new Error('The distance parameter must be greater than zero and less than or equal to the number of Crumbs (' + stateContext.crumbs.length + ')');
            var {state, data, url} = crumbs[crumbs.length - distance];
            var crumbs = crumbs.slice(0, crumbs.length - distance);
            return navigateLink(state, data, crumbs, url);
        },
        refresh: function(navigationData?: any): FluentNavigator {
            var {state, crumbs, nextCrumb} = stateContext;
            if (typeof navigationData === 'function')
                navigationData = navigationData(stateContext.data);
            var url = stateHandler.getLink(state, navigationData, crumbs, nextCrumb);
            if (url == null)
                throw new Error('Invalid route data, a mandatory route parameter has not been supplied a value');
            var data = { ...state.defaults, ...navigationData };
            var crumbs = getCrumbTrail(state, data, crumbs, nextCrumb);
            return navigateLink(state, data, crumbs, url);
        }
    }
}
export { FluentNavigator, createFluentNavigator };
