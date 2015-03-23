import HashHistoryManager = require('HashHistoryManager');
import IHistoryManager = require('IHistoryManager');

var historyManager: IHistoryManager = new HashHistoryManager(); 
export = historyManager;
