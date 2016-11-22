import Crumb from './config/Crumb';
import State from './config/State';
import StateContext from './StateContext';
import StateHandler from './StateHandler';

interface FluentNavigator {
    url: string,
    navigate(stateKey: string, navigationData?: any): FluentNavigator;
    refresh(navigationData?: any): FluentNavigator;
    navigateBack(distance: number): FluentNavigator;
}

function createFluentNavigator(states: { [index: string]: State }, stateHandler: StateHandler, stateContext = new StateContext()): FluentNavigator {
    function getFluentContext(state: State, data: any, url: string): StateContext {
        var fluentContext = new StateContext();
        fluentContext.state = state;
        fluentContext.url = url;
        fluentContext.crumbs = data[state.crumbTrailKey];
        delete data[state.crumbTrailKey];
        fluentContext.data = data;
        fluentContext.nextCrumb = new Crumb(data, state, url, stateHandler.getLink(state, data), false);
        return fluentContext;
    }

    function navigateLink(url): FluentNavigator {
        var { state, data } = stateHandler.parseLink(url);
        return createFluentNavigator(states, stateHandler, getFluentContext(state, data, url));
    }

    return {
        url: stateContext.url,
        navigate: function(stateKey: string, navigationData?: any): FluentNavigator {
            if (!states[stateKey])
                throw new Error(stateKey + ' is not a valid State');
            if (typeof navigationData === 'function')
                navigationData = navigationData(stateContext.data);
            var url = stateHandler.getLink(states[stateKey], navigationData, stateContext.crumbs, stateContext.nextCrumb);
            return navigateLink(url);
        },
        refresh: function(navigationData?: any): FluentNavigator {
            if (typeof navigationData === 'function')
                navigationData = navigationData(stateContext.data);
            var url = stateHandler.getLink(stateContext.state, navigationData, stateContext.crumbs, stateContext.nextCrumb);
            if (url == null)
                throw new Error('Invalid route data, a mandatory route parameter has not been supplied a value');
            return navigateLink(url);
        },
        navigateBack: function(distance: number): FluentNavigator {
            if (!(distance <= stateContext.crumbs.length && distance > 0))
                throw new Error('The distance parameter must be greater than zero and less than or equal to the number of Crumbs (' + stateContext.crumbs.length + ')');
            var url = stateContext.crumbs[stateContext.crumbs.length - distance].url;
            return navigateLink(url);
        }
    }
}
export { FluentNavigator, createFluentNavigator };
