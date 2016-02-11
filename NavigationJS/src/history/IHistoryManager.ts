interface IHistoryManager {
    disabled: boolean;
    init(navigateHistory: () => void, applicationPath: string): void;
    addHistory(url: string, replace: boolean): void;
    getCurrentUrl(): string;
    getHref(url: string): string;
    getUrl(anchor: HTMLAnchorElement): string;
    stop(): void;
}
export = IHistoryManager;
