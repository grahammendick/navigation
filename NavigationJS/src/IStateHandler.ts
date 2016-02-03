import Crumb = require('./Crumb');
import NavigationSettings = require('./NavigationSettings');
import State = require('./config/State');

interface IStateHandler {
    getNavigationLink(settings: NavigationSettings, state: State, data: any, arrayData?: { [index: string]: string[] }): string;
    navigateLink(oldState: State, state: State, url: string): void;
    getNavigationData(settings: NavigationSettings, state: State, url: string, separableData?: any): any;
    urlEncode?(state: State, key: string, val: string, queryString: boolean): string;
    urlDecode?(state: State, key: string, val: string, queryString: boolean): string;
    truncateCrumbTrail(state: State, crumbs: Crumb[]): Crumb[];
}
export = IStateHandler;
