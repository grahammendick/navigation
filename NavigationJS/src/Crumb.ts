import CrumbTrailManager = require('./CrumbTrailManager');
import NavigationData = require('./NavigationData');
import State = require('./config/State');

class Crumb {
    data: any;
    state: State;
    last: boolean;
    title: string;
    navigationLink; string;

    constructor(data: any, state: State, link: string, last: boolean) {
        this.data = data ? data : {};
        this.state = state;
        this.last = last;
        this.title = state.title;
        this.navigationLink = link;
        NavigationData.setDefaults(this.data, this.state.defaults);
    }
}
export = Crumb;
