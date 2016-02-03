import IHistoryManager = require('./IHistoryManager');
import StateContext = require('../StateContext');

class HashHistoryManager implements IHistoryManager {
    disabled: boolean = (typeof window === 'undefined') || !('onhashchange' in window);
    replaceQueryIdentifier: boolean = false;

    init(navigateHistory) {
        if (!this.disabled) {
            if (window.addEventListener)
                window.addEventListener('hashchange', navigateHistory);
            else
                window['attachEvent']('onhashchange', navigateHistory);
        }
    }

    addHistory(stateContext: StateContext, url: string, replace: boolean) {
        url = url != null ? url : stateContext.url;
        url = '#' + this.encode(url);
        if (!this.disabled && location.hash !== url) {
            if (!replace)            
                location.hash = url;
            else
                location.replace(url);
        }
    }

    getCurrentUrl(): string {
        return this.decode(location.hash.substring(1));
    }

    getHref(url: string): string {
        if (!url)
            throw new Error('The Url is invalid');
        return '#' + this.encode(url);
    }

    getUrl(anchor: HTMLAnchorElement) {
        return this.decode(anchor.hash.substring(1));
    }

    private encode(url: string): string {
        if (!this.replaceQueryIdentifier)
            return url;
        return url.replace('?', '#');
    }

    private decode(hash: string): string {
        if (!this.replaceQueryIdentifier)
            return hash;
        return hash.replace('#', '?');
    }
}
export = HashHistoryManager;
