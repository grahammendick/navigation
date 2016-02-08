interface IHistoryManager {
    disabled: boolean;
    init(navigateHistory: () => void, applicationPath: string);
    addHistory(url: string, replace: boolean): void;
    getCurrentUrl(): string;
    getHref(url: string): string;
    getUrl(anchor: HTMLAnchorElement): string;
    stop();
}
export = IHistoryManager;
