import State = require('config/State');
import Dialog = require('config/Dialog');

interface IRouter {
    getData(route: string): { state: State; data: any };
    getRoute(state: State, data: any): { route: string; data: any };
    supportsDefaults: boolean;
    addRoutes(dialogs: Array<Dialog>);
}
export = IRouter;
