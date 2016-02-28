import Crumb = require('./Crumb');
import StateInfo = require('./StateInfo');

class State implements StateInfo {
    key: string;
    defaults: any = {};
    defaultTypes: any = {};
    formattedDefaults: any = {};
    formattedArrayDefaults: { [index: string]: string[] } = {};
    title: string;
    route: string | string[];
    trackCrumbTrail: boolean = false;
    crumbTrailKey: string = 'crumb';
    trackTypes: boolean = true;
    
    unloading(state: State, data: any, url: string, unload: () => void, history: boolean) { 
        unload()
    };
    
    navigating(data: any, url: string, navigate: (asyncData?: any) => void, history: boolean) {
        navigate();
    };
    
    dispose() { 
    };
    
    navigated(data: any, asyncData?: any) {
    };
    
    urlEncode(state: State, key: string, val: string, queryString: boolean): string {
        return encodeURIComponent(val);
    }
    
    urlDecode(state: State, key: string, val: string, queryString: boolean): string {
        return decodeURIComponent(val);
    }

    truncateCrumbTrail(state: State, crumbs: Crumb[]): Crumb[] {
        var newCrumbs: Crumb[] = [];
        for (var i = 0; i < crumbs.length; i++) {
            if (crumbs[i].state === state)
                break;
            newCrumbs.push(crumbs[i]);
        }
        return newCrumbs;
    }
}
export = State;
