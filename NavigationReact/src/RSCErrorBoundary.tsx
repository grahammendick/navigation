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
    constructor(props) {
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
        const {stateNavigator: {stateContext}, errorFallback, children} = this.props;
        const {error, stateContext: errorContext} = this.state;
        if (error && errorContext === stateContext) {
            const {message} = this.state.error;
            if (typeof message === 'string') {
                const parts = message.split(';');
                const [name, url, historyAction] = parts;
                if (name === 'navigateLink') {
                    return <NavigationEffect url={url} historyAction={historyAction} />
                }
            }
        }
        if (error && !errorFallback) throw error;
        return !error ? children : errorFallback;
    }
}
export default withStateNavigator(RSCErrorBoundary);
