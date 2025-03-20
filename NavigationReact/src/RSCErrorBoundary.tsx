import React, { Component, ReactNode } from 'react';
import { StateContext, StateNavigator } from 'navigation';
import withStateNavigator from './withStateNavigator.js';

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
        const {errorFallback, children} = this.props;
        const {error} = this.state;
        if (error) {
            if (!errorFallback) throw error;
            return errorFallback;
        }
        return children;
    }
}
export default withStateNavigator(RSCErrorBoundary);
