import Dialog = require('./config/Dialog');
import State = require('./config/State');

interface IRouter {
    getData(route: string, arrayData?: any): { state: State; data: any };
    getRoute(state: State, data: any, arrayData?: { [index: string]: string[] }): { route: string; data: any };
    supportsDefaults: boolean;
    addRoutes(dialogs: Dialog[]): void;
}
export = IRouter;
