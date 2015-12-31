import Crumb = require('./Crumb');
import State = require('./config/State');

interface IStateHandler {
    getNavigationLink(state: State, data: any, queryStringData?: { [index: string]: string[] }): string;
    navigateLink(oldState: State, state: State, url: string): void;
    getNavigationData(state: State, url: string, queryStringData?: any): any;
    truncateCrumbTrail(state: State, crumbs: Crumb[]): Crumb[];
    urlEncode?(state: State, key: string, val: string, queryString: boolean): string;
    urlDecode?(state: State, key: string, val: string, queryString: boolean): string;
}
export = IStateHandler;
