import { useContext, useEffect } from 'react';
import { NavigationContext } from 'navigation-react';

var useNavigated = (handler: () => void) => {
    var navigationEvent = useContext(NavigationContext);
    useEffect(() => {
        var {stateContext} = navigationEvent.stateNavigator;
        if (!stateContext['peek'])
            handler();
    }, [navigationEvent]);
};

export default useNavigated;
