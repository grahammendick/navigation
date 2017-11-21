interface HistoryManager {
    disabled: boolean;
    init(navigateHistory: (url?: string) => void): void;
    addHistory(url: string, replace: boolean): void;
    getCurrentUrl(): string;
    getHref(url: string): string;
    getUrl(hrefElement: HTMLAnchorElement | Location): string;
    stop(): void;
}
export default HistoryManager;
