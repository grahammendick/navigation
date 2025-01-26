import { cache } from 'react';
import { StateNavigator } from 'navigation';

export const getCache = cache(() => ({navigationEvent: null}));

const NavigationHandler = ({ stateNavigator, children }: { stateNavigator: StateNavigator, children: any }) => {
    const { oldState, state, data, asyncData } = stateNavigator.stateContext;
    const rSCStateNavigator = new RSCStateNavigator(stateNavigator);
    getCache().navigationEvent = { oldState, state, data, asyncData, stateNavigator: rSCStateNavigator };
    return children;
};
export default NavigationHandler;

class RSCStateNavigator extends StateNavigator
{
    constructor(stateNavigator: StateNavigator) {
        super(stateNavigator, stateNavigator.historyManager);
        this.stateContext = stateNavigator.stateContext;
        // throw errors from on/offNavigate etc. and configure
        // because not supported on the server
    }

    navigateLink(url: string, historyAction: 'add' | 'replace' | 'none' = 'replace') {
        throw Error(`__rscNavigationLink;${url};${historyAction}`);
    }
}