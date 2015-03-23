import IHistoryManager = require('./IHistoryManager');
import navigateHistory = require('./navigateHistory');
import State = require('../config/State');

class HashHistoryManager implements IHistoryManager {
    disabled: boolean = (typeof window === 'undefined') || !('onhashchange' in window);

    init() {
        if (!this.disabled) {
            if (window.addEventListener) {
                window.removeEventListener('hashchange', navigateHistory);
                window.addEventListener('hashchange', navigateHistory);
            } else {
                window.detachEvent('onhashchange', navigateHistory);
                window.attachEvent('onhashchange', navigateHistory);
            }
        }
    }

    addHistory(state: State, url: string) {
        if (state.title && (typeof document !== 'undefined'))
            document.title = state.title;
        if (!this.disabled && location.hash.substring(1) !== url)
            location.hash = url;
    }

    getCurrentUrl(): string {
        return location.hash.substring(1);
    }

    getHref(url: string): string {
        if (!url)
            throw new Error('The Url is invalid');
        return '#' + url;
    }

    getUrl(anchor: HTMLAnchorElement) {
        return anchor.hash.substring(1);
    }
}
export = HashHistoryManager;
