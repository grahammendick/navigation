import { useContext } from 'react';
import { NavigationContext } from 'navigation-react';

export default () => {
    const {state, asyncData} = useContext(NavigationContext);
    return state.renderScene(asyncData)
};
