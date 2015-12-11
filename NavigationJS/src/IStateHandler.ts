import Crumb = require('./Crumb');
import State = require('./config/State');

interface IStateHandler {
    getNavigationLink(state: State, data: any, arrayData?: any): string;
    navigateLink(oldState: State, state: State, url: string): void;
    getNavigationData(state: State, url: string): any;
    truncateCrumbTrail(state: State, crumbs: Crumb[]): Crumb[];
}
export = IStateHandler;
