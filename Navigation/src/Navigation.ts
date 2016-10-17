import StateContext from './StateContext';
import StateNavigator from './StateNavigator';
import State from './config/State';
import HashHistoryManager from './history/HashHistoryManager';
import HTML5HistoryManager from './history/HTML5HistoryManager';
import Crumb from './config/Crumb';

class Navigation {
    static State = State;
    static HashHistoryManager = HashHistoryManager;
    static HTML5HistoryManager = HTML5HistoryManager;
    static Crumb = Crumb;
    static StateContext = StateContext;
    static StateNavigator = StateNavigator;
} 
export default Navigation;
