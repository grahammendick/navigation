import IState = require('./IState');
import StateHandler = require('./StateHandler');

class State implements IState {
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
    stateHandler: StateHandler = new StateHandler();
    
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
}
export = State;
