import { Component, ReactNode, cloneElement, createElement } from 'react';
import { StateContext, StateNavigator } from 'navigation';
import withStateNavigator from './withStateNavigator.js';

type ErrorBoundaryProps = {stateNavigator: StateNavigator, errorFallback: ReactNode, children: any}
type ErrorBoundaryState = {error: Error, stateContext: StateContext};

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
      super(props);
      this.state = {error: null, stateContext: null};
    }
    static getDerivedStateFromProps({stateNavigator: {stateContext}}: ErrorBoundaryProps, {error, stateContext: errorContext}: ErrorBoundaryState) {
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
            return typeof errorFallback !== 'function' ? cloneElement(errorFallback as any, {error}) : createElement(errorFallback, {error});
        }
        return children;
    }
}
export default withStateNavigator(ErrorBoundary);
