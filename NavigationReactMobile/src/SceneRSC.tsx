'use client'
import { use, useContext } from 'react';
import { useNavigationEvent, BundlerContext } from 'navigation-react';

const rscCache: Map<any, Record<string, any>> = new Map();

const SceneRSC = ({stateKey, children}) => {
    const navigationEvent = useNavigationEvent();
    const {stateNavigator: {stateContext, historyManager}} = navigationEvent;
    const {nextCrumb: {crumblessUrl: url}, oldUrl} = stateContext;
    const fetchRSC = useContext(BundlerContext);
    if (!rscCache.get(navigationEvent)) rscCache.set(navigationEvent, {});
    const cachedScenes = rscCache.get(navigationEvent);
    let fetchedScene = cachedScenes[stateKey];
    if (!fetchedScene && oldUrl) {
        cachedScenes[stateKey] = fetchRSC(historyManager.getHref(url), {
            method: 'post',
            headers: {'Content-Type': 'application/json'},
            body: {url, sceneViewKey: stateKey}
        });
        fetchedScene = cachedScenes[stateKey];
    }
    return fetchedScene ? use(fetchedScene) : children;
}

export default SceneRSC;
