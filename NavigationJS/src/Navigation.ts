import StateContext = require('./StateContext');
import StateController = require('./StateController');
import Dialog = require('./config/Dialog');
import State = require('./config/State');
import Transition = require('./config/Transition');
import StateInfoConfig = require('./config/StateInfoConfig');
import HistoryNavigator = require('./history/HistoryNavigator');
import HashHistoryManager = require('./history/HashHistoryManager');
import HTML5HistoryManager = require('./history/HTML5HistoryManager');
import CrumbTrailPersister = require('./CrumbTrailPersister');
import StorageCrumbTrailPersister = require('./StorageCrumbTrailPersister');
import Crumb = require('./Crumb');
import StateHandler = require('./StateHandler');
import StateRouter = require('./StateRouter');
import NavigationSettings = require('./NavigationSettings');
import Route = require('./routing/Route');
import Router = require('./routing/Router');
import settings = require('./settings');

class Navigation {
    static Dialog = Dialog;
    static State = State;
    static Transition = Transition;
    static StateInfoConfig = StateInfoConfig;
    static HashHistoryManager = HashHistoryManager;
    static HTML5HistoryManager = HTML5HistoryManager;
    static CrumbTrailPersister = CrumbTrailPersister;
    static StorageCrumbTrailPersister = StorageCrumbTrailPersister;
    static Crumb = Crumb;
    static NavigationSettings = NavigationSettings;
    static StateContext = StateContext;
    static StateController = StateController;
    static StateHandler = StateHandler;
    static StateRouter = StateRouter;
    static Route = Route;
    static Router = Router;
    static settings = settings;
    static start = (url?: string) => {
        settings.historyManager.init();
        StateController.navigateLink(url ? url : settings.historyManager.getCurrentUrl());
    };
} 
HistoryNavigator.navigateHistory = () => {
    if (StateContext.url === settings.historyManager.getCurrentUrl())
        return;
    StateController.navigateLink(settings.historyManager.getCurrentUrl());
}
export = Navigation;
