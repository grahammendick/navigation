import State = require('./State');

interface IRouter {
    getData(route: string): { state: State; data: any, separableData: any };
    getRoute(state: State, data: any, arrayData: { [index: string]: string[] }): { route: string; data: any };
    addRoutes(states: State[]): void;
}
export = IRouter;
