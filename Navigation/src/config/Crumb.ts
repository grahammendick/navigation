import State from './State';

class Crumb {
    data: any;
    state: State;
    last: boolean;
    title: string;
    url: string;
    crumblessUrl: string;

    constructor(data: any, state: State, url: string, crumblessUrl: string, last: boolean) {
        this.data = data ? data : {};
        this.state = state;
        this.last = last;
        this.title = state.title;
        this.url = url;
        this.crumblessUrl = crumblessUrl;
    }
}
export default Crumb;
