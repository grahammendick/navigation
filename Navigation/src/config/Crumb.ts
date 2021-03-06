﻿import State from './State';

class Crumb {
    data: any;
    state: State;
    hash: string;
    last: boolean;
    title: string;
    url: string;
    crumblessUrl: string;

    constructor(data: any, state: State, url: string, crumblessUrl: string, last: boolean, hash: string) {
        this.data = data ? data : {};
        this.state = state;
        this.hash = hash;
        this.last = last;
        this.title = state.title;
        this.url = url;
        this.crumblessUrl = crumblessUrl;
    }
}
export default Crumb;
