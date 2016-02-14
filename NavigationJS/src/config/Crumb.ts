import State = require('./State');

class Crumb {
    data: any;
    state: State;
    last: boolean;
    title: string;
    navigationLink: string;
    crumblessLink: string;

    constructor(data: any, state: State, link: string, crumblessLink: string, last: boolean) {
        this.data = data ? data : {};
        this.state = state;
        this.last = last;
        this.title = state.title;
        this.navigationLink = link;
        this.crumblessLink = crumblessLink;
    }
}
export = Crumb;
