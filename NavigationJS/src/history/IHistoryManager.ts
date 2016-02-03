import StateContext = require('../StateContext');

interface IHistoryManager {
    disabled: boolean;
    init(navigateHistory: () => void);
    addHistory(stateContext: StateContext, url: string, replace: boolean, applicationPath: string): void;
    getCurrentUrl(applicationPath: string): string;
    getHref(url: string, applicationPath: string): string;
    getUrl(anchor: HTMLAnchorElement, applicationPath: string): string;
}
export = IHistoryManager;
