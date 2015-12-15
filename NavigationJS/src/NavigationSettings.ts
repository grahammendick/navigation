import IRouter = require('./IRouter');
import StateRouter = require('./StateRouter');
import IHistoryManager = require('./history/IHistoryManager');
import HashHistoryManager = require('./history/HashHistoryManager');
import CrumbTrailPersister = require('./CrumbTrailPersister');

class NavigationSettings {
    router: IRouter = new StateRouter();
    historyManager: IHistoryManager = new HashHistoryManager();
    crumbTrailPersister: CrumbTrailPersister = new CrumbTrailPersister();
    stateIdKey: string = 'c0';
    previousStateIdKey: string = 'c1';
    returnDataKey: string = 'c2';
    crumbTrailKey: string = 'c3';
    applicationPath: string = '';
    combineCrumbTrail: boolean = false;
    trackAllPreviousData: boolean = true;
    combineArray: boolean = false;
}
export = NavigationSettings;
