import IRouter = require('./config/IRouter');
import IHistoryManager = require('./history/IHistoryManager');
import CrumbTrailPersister = require('./CrumbTrailPersister');

interface INavigationSettings {
    router?: IRouter;
    historyManager?: IHistoryManager;
    crumbTrailPersister?: CrumbTrailPersister;
    trackAllPreviousData?: boolean;
    combineArray?: boolean;
}
export = INavigationSettings;