import IHistoryManager = require('./IHistoryManager');
import HistoryNavigator = require('./HistoryNavigator');
import State = require('../config/State');

class HashHistoryManager implements IHistoryManager {
    disabled: boolean = (typeof window === 'undefined') || !('onhashchange' in window);

    init() {
        if (!this.disabled) {
            if (window.addEventListener)
                window.addEventListener('hashchange', HistoryNavigator.navigateHistory);
            else
                window.attachEvent('onhashchange', HistoryNavigator.navigateHistory);
        }
    }

    addHistory(state: State, url: string) {
        if (state.title && (typeof document !== 'undefined'))
            document.title = state.title;
        url = this.encode(url);
        if (!this.disabled && location.hash.substring(1) !== url)
            location.hash = url;
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
        return url.replace('?', '#');
    }

    private decode(hash: string): string {
        return hash.replace('#', '?');
    }
}
export = HashHistoryManager;
