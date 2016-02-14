import IRouter = require('./config/IRouter');
import StateRouter = require('./StateRouter');
import IHistoryManager = require('./history/IHistoryManager');
import INavigationSettings = require('./INavigationSettings');
import HashHistoryManager = require('./history/HashHistoryManager');
import CrumbTrailPersister = require('./CrumbTrailPersister');

class NavigationSettings implements INavigationSettings {
    router: IRouter = new StateRouter();
    historyManager: IHistoryManager = new HashHistoryManager();
    crumbTrailPersister: CrumbTrailPersister = new CrumbTrailPersister();
    combineArray: boolean = false;
}
export = NavigationSettings;
