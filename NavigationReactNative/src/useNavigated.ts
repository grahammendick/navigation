import { useContext, useEffect } from 'react';
import { NavigationContext } from 'navigation-react';

var useNavigated = (handler: () => void) => {
    var navigationEvent = useContext(NavigationContext);
    useEffect(() => {
        if (!navigationEvent['refetching'])
            handler();
    }, [navigationEvent]);
};

export default useNavigated;
