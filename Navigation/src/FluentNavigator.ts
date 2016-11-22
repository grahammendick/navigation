import Crumb from './config/Crumb';
import State from './config/State';
import StateContext from './StateContext';
import StateHandler from './StateHandler';

class FluentNavigator {
    private state: State = null;
    private data: any = {};
    url: string = null;
    private crumbs: Crumb[] = [];
    private nextCrumb: Crumb = null;
    private states: { [index: string]: State } = {};
    private stateHandler: StateHandler;

    constructor(states, stateHandler, stateContext?: StateContext) {
        this.states = states;
        this.stateHandler = stateHandler;
        if (stateContext) {
            this.state = stateContext.state;
            this.data = stateContext.data;
            this.url = stateContext.url;
            this.crumbs = stateContext.crumbs;
            this.nextCrumb = stateContext.nextCrumb;
        }
    }

    private setFluentContext(state: State, data: any, url: string) {
        this.state = state;
        this.url = url;
        this.crumbs = data[state.crumbTrailKey];
        delete data[state.crumbTrailKey];
        this.data = data;
        this.nextCrumb = new Crumb(data, state, url, this.stateHandler.getLink(state, data), false);
    }

    public navigate(stateKey: string, navigationData?: any): this {
        if (!this.states[stateKey])
            throw new Error(stateKey + ' is not a valid State');
        var url = this.stateHandler.getLink(this.states[stateKey], navigationData, this.crumbs, this.nextCrumb);
        var { state, data } = this.stateHandler.parseLink(url);
        this.setFluentContext(state, data, url);
        return this;
    }
}
export default FluentNavigator;
