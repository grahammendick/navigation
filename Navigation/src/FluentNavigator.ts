import Crumb from './config/Crumb';
import State from './config/State';
import StateContext from './StateContext';
import StateHandler from './StateHandler';

interface FluentNavigator {
    url: string,
    navigate(stateKey: string, navigationData?: any): FluentNavigator;
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

    return {
        url: stateContext.url,
        navigate: function(stateKey: string, navigationData?: any): FluentNavigator {
            if (!states[stateKey])
                throw new Error(stateKey + ' is not a valid State');
            if (typeof navigationData === 'function'){
                navigationData = navigationData(stateContext.data);
            }
            var url = stateHandler.getLink(states[stateKey], navigationData, stateContext.crumbs, stateContext.nextCrumb);
            var { state, data } = stateHandler.parseLink(url);
            return createFluentNavigator(states, stateHandler, getFluentContext(state, data, url));
        }
    }
}
export { FluentNavigator, createFluentNavigator };
