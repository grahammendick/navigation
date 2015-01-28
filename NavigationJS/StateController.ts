module Navigation {
    class CrumbTrailManager {
        static getHref(nextState: string, navigationData: NavigationData, returnData: NavigationData) {
        }
    }

    export class StateController {
        static navigate(action: string, toData?: NavigationData) {
        }
        static getNavigationLink(action: string, toData?: NavigationData) {
            return CrumbTrailManager.getHref(action, toData, null);
        }
        private static navigateLink(state: State, url: string) {
        }
    }
}
