import Dialog = require('./config/Dialog');
import State = require('./config/State');

interface IRouter {
    getData(route: string): { state: State; data: any };
    getRoute(state: State, data: any): { route: string; data: any };
    supportsDefaults: boolean;
    addRoutes(dialogs: Array<Dialog>): void;
}
export = IRouter;
