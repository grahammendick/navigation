import React, { useContext, Component, useEffect, ReactNode } from 'react';
import { StateContext, StateNavigator } from 'navigation';
import NavigationContext from './NavigationContext.js';
import withStateNavigator from './withStateNavigator.js';

const NavigationEffect = ({url, historyAction}: {url: string, historyAction: string}) => {
    const {stateNavigator} = useContext(NavigationContext);
    useEffect(() => {
        if (url) stateNavigator.navigateLink(url, historyAction as 'add' | 'replace' | 'none');
    }, [url, historyAction])
    return null;
}

type RSCErrorBoundaryProps = {stateNavigator: StateNavigator, errorFallback: ReactNode, children: any}
type RSCErrorBoundaryState = {error: Error, stateContext: StateContext};

class RSCErrorBoundary extends Component<RSCErrorBoundaryProps, RSCErrorBoundaryState> {
    constructor(props: RSCErrorBoundaryProps) {
      super(props);
      this.state = {error: null, stateContext: null};
    }
    static getDerivedStateFromProps({stateNavigator: {stateContext}}: RSCErrorBoundaryProps, {error, stateContext: errorContext}: RSCErrorBoundaryState) {
        if (errorContext && errorContext !== stateContext) return {error: null, stateContext: null};
        return {stateContext: error ? stateContext : null};
    }
    static getDerivedStateFromError(error: any) {
        return {error};
    }
    render() {        
        const {stateNavigator, errorFallback, children} = this.props;
        const {error, stateContext: errorContext} = this.state;
        if (error?.message && errorContext === stateNavigator.stateContext) {
            const {message} = this.state.error;
            if (typeof message === 'string' && message.match(/^(navigate|navigateBack|refresh);/)) {
                const sep1 = message.indexOf(';');
                const sep2 = message.lastIndexOf(';');
                const navigate = message.substring(0, sep1);
                const historyAction = message.substring(sep2 + 1); 
                let url = '';
                if (navigate === 'navigate') {
                    const link = message.substring(sep1 + 1, sep2);
                    const {state, data} = stateNavigator.parseLink(link);
                    url = stateNavigator.getNavigationLink(state.key, data);
                }
                if (navigate === 'navigateBack') {
                    const distance = +message.substring(sep1 + 1, sep2);
                    url = stateNavigator.getNavigationBackLink(distance);
                }
                if (navigate === 'refresh') {
                    const link = message.substring(sep1 + 1, sep2);
                    const {data} = stateNavigator.parseLink(link);
                    url = stateNavigator.getRefreshLink(data);
                }
                return <NavigationEffect url={url} historyAction={historyAction} />
            }
        }
        if (error && !errorFallback) throw error;
        return !error ? children : errorFallback;
    }
}
export default withStateNavigator(RSCErrorBoundary);
