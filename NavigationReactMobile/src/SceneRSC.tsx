'use client'
import { useContext } from 'react';
import { useNavigationEvent, BundlerContext } from 'navigation-react';

const rscCache: Map<any, Record<string, any>> = new Map();

const SceneRSC = ({stateKey, children}) => {
    const navigationEvent = useNavigationEvent();
    const {stateNavigator: {stateContext, historyManager}} = navigationEvent;
    const {nextCrumb: {crumblessUrl: url}, oldUrl} = stateContext;
    const fetchRSC = useContext(BundlerContext);
    if (!rscCache.get(navigationEvent)) rscCache.set(navigationEvent, {});
    const cachedSceneViews = rscCache.get(navigationEvent);
    let fetchedSceneView = cachedSceneViews[stateKey];
    if (!fetchedSceneView && oldUrl) {
        cachedSceneViews[stateKey] = fetchRSC(historyManager.getHref(url), {
            method: 'post',
            headers: {'Content-Type': 'application/json'},
            body: {url, stateKey}
        });
        fetchedSceneView = cachedSceneViews[stateKey];
    }
    return fetchedSceneView || children;
}

export default SceneRSC;
