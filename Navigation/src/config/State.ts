import Crumb from './Crumb';
import StateInfo from './StateInfo';

class State implements StateInfo {
    key: string;
    defaults: any = {};
    defaultTypes: any = {};
    formattedDefaults: any = {};
    formattedArrayDefaults: { [index: string]: string[] } = {};
    title: string;
    route: string | string[];
    trackCrumbTrail: boolean = false;
    crumbTrailKey: string;
    trackTypes: boolean = true;
    [extras: string]: any;
    
    unloading(state: State, data: any, url: string, unload: () => void, history: boolean) { 
        unload()
    };
    
    navigating(data: any, url: string, navigate: (asyncData?: any) => void, history: boolean) {
        navigate();
    };
    
    dispose() { 
    };
    
    navigated(data: any, asyncData: any) {
    };
    
    urlEncode(state: State, key: string, val: string, queryString: boolean, index?: number): string {
        return encodeURIComponent(val);
    }
    
    urlDecode(state: State, key: string, val: string, queryString: boolean): string {
        return decodeURIComponent(val);
    }

    validate(data: any): boolean {
        return true;
    }

    truncateCrumbTrail(state: State, data: any, crumbs: Crumb[]): Crumb[] {
        return crumbs;
    }
}
export default State;
