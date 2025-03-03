import { useContext, Component, useEffect, ReactNode } from 'react';
import { StateNavigator } from 'navigation';
import withStateNavigator from './withStateNavigator.js';
import NavigationContext from './NavigationContext.js';

const NavigationEffect = ({url, historyAction}: {url: string, historyAction: string}) => {
    const {stateNavigator} = useContext(NavigationContext);
    useEffect(() => {
        if (url) stateNavigator.navigateLink(url, historyAction as 'add' | 'replace' | 'none');
    }, [url, historyAction])
    return null;
}

class RSCErrorBoundary extends Component<{stateNavigator: StateNavigator, errorFallback: ReactNode, children: any}, {error: Error}> {
    constructor(props) {
      super(props);
      this.state = {error: null};
    }
    static getDerivedStateFromError(error) {
        return {error};
    }
    render() {        
        const {errorFallback, children} = this.props;
        const {error} = this.state;
        if (error) {
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
