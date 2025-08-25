import historyCache from './historyCache.js';
import useNavigationEvent from './useNavigationEvent.js';

const useExpire = () => {
    const navigationEvent = useNavigationEvent();
    const {stateNavigator} = navigationEvent;
    const {nextCrumb, history} = stateNavigator.stateContext;
    return {
        expired: history && !navigationEvent['ignoreCache'] && historyCache[nextCrumb.crumblessUrl]?.expired,
        expire: (stateKey: string, navigationData?: any) => {
            if (!stateNavigator.states[stateKey])
                throw new Error(stateKey + ' is not a valid State');
            for (var url in historyCache) {
                const { state, data } = historyCache[url];
                if (state.key === stateKey) {
                    var expire = true;
                    for (var key in navigationData) {
                        var val = navigationData[key];
                        expire = expire && (val == null || areEqual(val, data[key]));
                    }
                    historyCache[url].expired ||= expire;
                }
            }
        }
    };
}

const areEqual = (val: any, currentVal: any): boolean => {
    if (currentVal == null)
        return val == null || val === '';
    var valType = Object.prototype.toString.call(val);
    if (valType !== Object.prototype.toString.call(currentVal))
        return false;
    if (valType === '[object Array]') {
        var active = val.length === currentVal.length;
        for(var i = 0; active && i < val.length; i++) {
            active = areEqual(val[i], currentVal[i]);
        }
        return active;
    } else {
        return isNaN(val) ? val === currentVal : +val === +currentVal;
    }
}

export default useExpire;
