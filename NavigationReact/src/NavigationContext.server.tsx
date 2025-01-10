import { cache } from 'react';

const getCache = cache(() => ({navigationEvent: null}));

const Provider = ({value, children}) => {
    getCache().navigationEvent = value;
    return children;
}

const NavigationContext = {
    Provider,
    getCache,
}

export default NavigationContext;
