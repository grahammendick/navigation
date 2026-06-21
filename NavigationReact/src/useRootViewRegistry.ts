import { useContext } from 'react';
import RefetchContext from './RefetchContext.js';

const useRootViewRegistry = () => {
    const {registerSceneView} = useContext(RefetchContext);
    return registerSceneView;
}
export default useRootViewRegistry;
