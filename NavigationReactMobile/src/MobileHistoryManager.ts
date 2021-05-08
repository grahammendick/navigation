import { HTML5HistoryManager, StateContext } from 'navigation';

class MobileHistoryManager extends HTML5HistoryManager {
    private hash = false;
    private buildCurrentUrl: (url: string) => string; 

    constructor(buildCurrentUrl: (url: string) => string, applicationPath?: string) {
        super(applicationPath || '');
        this.buildCurrentUrl = buildCurrentUrl;
        this.hash = applicationPath === undefined;
    }

    addHistory(url: string, replace: boolean, stateContext?: StateContext) {
        var title = typeof document !== 'undefined' && document.title;
        if (!!stateContext && !stateContext.history) {
            var {oldUrl, crumbs} = stateContext;
            var start = !oldUrl ? 0 : oldUrl.split('crumb=').length;
            for(var i = start; i < crumbs.length; i++) {
                let {url, state} = crumbs[i];
                super.addHistory(url, i === 0);
                if (typeof document !== 'undefined' && state.title)
                    document.title = state.title;
            }
        }
        super.addHistory(url, replace);
        if (title)
            document.title = title;
    }

    getHref(url: string): string {
        var hashIndex = url.indexOf('#');
        var pathAndQuery = hashIndex < 0 ? url : url.substring(0, hashIndex);
        var queryIndex = pathAndQuery.indexOf('?');
        if (queryIndex >= 0) {
            var path = pathAndQuery.substring(0, queryIndex);
            var query = pathAndQuery.substring(queryIndex + 1);
            var params = query.split('&');
            var crumblessParams = [];
            for (var i = 0; i < params.length; i++) {
                if (params[i].substring(0, 6) !== 'crumb=') {
                    crumblessParams.push(params[i])
                }
            }
            var crumblessQuery = crumblessParams.join('&');
            var hash = hashIndex >= 0 ? url.substring(hashIndex) : '';
            url = `${path}${crumblessQuery && '?'}${crumblessQuery}${hash}`;
        }
        return !this.hash ? super.getHref(url) : '#' + url;
    }

    getUrl(hrefElement: HTMLAnchorElement | Location) {
        return !this.hash ? super.getUrl(hrefElement) : hrefElement.hash.substring(1);
    }

    getCurrentUrl(): string {
        var url = this.getUrl(location);
        if (this.buildCurrentUrl)
            url = this.buildCurrentUrl(url);
        return url;
    }
}

export default MobileHistoryManager;
