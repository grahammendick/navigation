import StateContext = require('./StateContext');
import StateController = require('./StateController');
import Dialog = require('./config/Dialog');
import State = require('./config/State');
import Transition = require('./config/Transition');
import HistoryAction = require('./history/HistoryAction');
import HashHistoryManager = require('./history/HashHistoryManager');
import HTML5HistoryManager = require('./history/HTML5HistoryManager');
import CrumbTrailPersister = require('./CrumbTrailPersister');
import StorageCrumbTrailPersister = require('./StorageCrumbTrailPersister');
import Crumb = require('./config/Crumb');
import StateHandler = require('./config/StateHandler');
import StateRouter = require('./StateRouter');
import NavigationSettings = require('./NavigationSettings');
import Route = require('./routing/Route');
import Router = require('./routing/Router');

class Navigation {
    static Dialog = Dialog;
    static State = State;
    static Transition = Transition;
    static HistoryAction = HistoryAction;
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
} 
export = Navigation;
