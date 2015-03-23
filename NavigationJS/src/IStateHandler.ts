import Crumb = require('Crumb');
import State = require('config/State');

interface IStateHandler {
    getNavigationLink(state: State, data: any): string;
    navigateLink(oldState: State, state: State, url: string);
    getNavigationData(state: State, url: string): any;
    truncateCrumbTrail(state: State, crumbs: Array<Crumb>): Array<Crumb>;
}
export = IStateHandler;
