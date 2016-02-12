import IRouter = require('./config/IRouter');
import IHistoryManager = require('./history/IHistoryManager');
import CrumbTrailPersister = require('./CrumbTrailPersister');

interface INavigationSettings {
    router?: IRouter;
    historyManager?: IHistoryManager;
    crumbTrailPersister?: CrumbTrailPersister;
    previousStateIdKey?: string;
    returnDataKey?: string;
    crumbTrailKey?: string;
    combineCrumbTrail?: boolean;
    trackAllPreviousData?: boolean;
    combineArray?: boolean;
}
export = INavigationSettings;