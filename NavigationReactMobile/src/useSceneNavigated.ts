import { useContext, useEffect } from 'react';
import { NavigationContext } from 'navigation-react';

var useSceneNavigated = (handler: () => void) => {
    var navigationEvent = useContext(NavigationContext);
    useEffect(() => {
        handler();
    }, [navigationEvent]);
};

export default useSceneNavigated;
