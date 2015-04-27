import IHistoryManager = require('./IHistoryManager');
import navigateHistory = require('./navigateHistory');
import settings = require('../settings');
import State = require('../config/State');

class HTML5HistoryManager implements IHistoryManager {
    disabled: boolean = (typeof window === 'undefined') || !(window.history && window.history.pushState);

    init() {
        if (!this.disabled)
            window.addEventListener('popstate', navigateHistory);
    }

    addHistory(state: State, url: string) {
        if (state.title && (typeof document !== 'undefined'))
            document.title = state.title;
        url = settings.applicationPath + url;
        if (!this.disabled && location.pathname + location.search !== url)
            window.history.pushState(null, null, url);
    }

    getCurrentUrl(): string {
        return location.pathname.substring(settings.applicationPath.length) + location.search;
    }

    getHref(url: string): string {
        if (!url)
            throw new Error('The Url is invalid');
        return settings.applicationPath + url;
    }

    getUrl(anchor: HTMLAnchorElement) {
        return anchor.pathname.substring(settings.applicationPath.length) + anchor.search;
    }
}
export = HTML5HistoryManager;
