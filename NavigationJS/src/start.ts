import historyManager = require('./history/historyManager');
import StateController = require('./StateController');

function start(url?: string) {
    historyManager.init();
    StateController.navigateLink(url ? url : historyManager.getCurrentUrl());
}
export = start;

 