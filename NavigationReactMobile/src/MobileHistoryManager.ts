import { HTML5HistoryManager, StateContext } from 'navigation';

class MobileHistoryManager extends HTML5HistoryManager {
    private navigateHistory: (e: PopStateEvent) => void = null;
    private backCrumb: number = null;
    private hash = false;
    private buildCurrentUrl: (url: string) => string;
    private rewriteUrl: (url: string) => string | undefined;

    constructor(buildCurrentUrl: (url: string) => string, applicationPath?: string) {
        super(applicationPath || '');
        this.buildCurrentUrl = buildCurrentUrl;
        this.hash = applicationPath === undefined;
    }

    init(navigateHistory: (url?: string) => void, rewriteUrl: (url: string) => string | undefined) {
        if (!this.rewriteUrl) this.rewriteUrl = rewriteUrl;
        if (!this.disabled && !this.navigateHistory) {
            this.navigateHistory = e => {
                var link = e.state?.navigationLink;
                if (link && this.backCrumb !== null) {
                    var distance = this.backCrumb - link.split('crumb=').length + 1;
                    if (distance < 0)
                        window.history.go(distance);
                    else
                        this.backCrumb = null;
                } else {
                    this.backCrumb = null;
                    navigateHistory(link);
                }
            };
            window.addEventListener('popstate', this.navigateHistory);
        }
    }

    addHistory(url: string, replace: boolean, stateContext?: StateContext) {
        this.backCrumb = null;
        var title = typeof document !== 'undefined' && document.title;
        var distance = 0;
        if (!!stateContext && !stateContext.history) {
            var {oldUrl, crumbs} = stateContext;
            var start = !oldUrl ? 0 : oldUrl.split('crumb=').length;
            distance = crumbs.length - start + 1;
            for(var i = start; i < crumbs.length; i++) {
                let {url, state} = crumbs[i];
                super.addHistory(url, i === 0);
                if (typeof document !== 'undefined' && state.title)
                    document.title = state.title;
            }
            if (!this.disabled && distance < 0) {
                this.backCrumb = crumbs.length;
                window.history.go(distance);
            }
        }
        if (this.backCrumb === null)
            super.addHistory(url, replace);
        if (title)
            document.title = title;
    }

    getHref(url: string): string {
        url = this.rewriteUrl?.(url) || url;
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
    
    stop() {
        if (this.navigateHistory)
            window.removeEventListener('popstate', this.navigateHistory);
        this.navigateHistory = null;
    }
}

export default MobileHistoryManager;
