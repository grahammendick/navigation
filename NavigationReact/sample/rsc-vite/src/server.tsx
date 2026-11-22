import { renderToReadableStream, createTemporaryReferenceSet, decodeReply, loadServerAction } from '@vitejs/plugin-rsc/rsc';
import createStateNavigator from './stateNavigator.ts';

export default async function handler(request: Request): Promise<Response> {
  return request.method === 'GET' ? get(request) : post(request);
}

const get = async (request: Request) => {
  const serverNavigator = createStateNavigator();
  const {pathname, search} = new URL(request.url);
  const url = `${pathname}${search}`;
  const App = (await import('./App.tsx')).default;
  try {
    serverNavigator.navigateLink(url);
  } catch(e) {
    return new Response('Not Found', { status: 404 });
  }
  const {NavigationHandler} = await import('navigation-react');
  const rscStream = renderToReadableStream((
    <NavigationHandler stateNavigator={serverNavigator}>
      <App url={serverNavigator.stateContext.url} />
    </NavigationHandler>
  ));
  const ssrEntryModule = await import.meta.viteRsc.loadModule<typeof import('./server.ssr.tsx')>('ssr', 'index');
  const htmlStream = await ssrEntryModule.renderHTML(rscStream);
  return new Response(htmlStream, {headers: {'Content-type': 'text/html'}});
}

const post = async (request: Request) => {
  const sceneViews: any = {
    header: await import('./Header.tsx'),
    people: await import('./People.tsx'),
    list: await import('./List.tsx'),
    person: await import('./Person.tsx'),
    friends: await import('./Friends.tsx')
  };
  const {url, oldUrl, sceneViewKeys, rootViews, action, actionId, args, prefetch} = await decodeBody(request);
  const serverNavigator = createStateNavigator();
  if (oldUrl) serverNavigator.navigateLink(oldUrl);
  if (url) serverNavigator.navigateLink(url);
  const stateContext = serverNavigator.stateContext;
  let data = null; let invalidate = [] as (string | false | null)[] | true;
  if (request.headers.get('content-type') !== 'application/json') {
    const serverAction = action || await loadServerAction(actionId);
    const scene = {
      stateNavigator: serverNavigator,
      invalidate: (scope?: boolean | string) => {
        if (invalidate === true) return;
        if (scope === true) invalidate = true;
        else invalidate.push(scope === undefined ? null : scope);
      }
    };
    data = await serverAction.apply(null, url ? [...args, scene] : args);
  }
  if (!url)
    return new Response(renderToReadableStream({data}), {headers: {'Content-type': 'text/x-component'}});
  const {state} = serverNavigator.stateContext;
  const navigated = serverNavigator.stateContext !== stateContext;
  const {NavigationHandler, SceneView, createPrefetchStream} = await import('navigation-react');
  if (prefetch && navigated)
    return new Response(renderToReadableStream({flattenedSceneViews: null}), {headers: {'Content-type': 'text/x-component'}});
  const flattenedSceneViews = prefetch ? createPrefetchStream() : null;
  const sceneInvalidated = invalidate === true || invalidate.indexOf(null) !== -1 || invalidate.indexOf(stateContext.state.key) !== -1;
  const viewInvalidated = invalidate !== true && invalidate.indexOf(false) !== -1;
  const activeViews = (navigated || sceneInvalidated || prefetch) ? Object.keys(rootViews).reduce((activeRoots, rootKey) => {
    const active = rootViews[rootKey];
    const show =  active != null && (
        typeof active === 'string' ? state.key === active : active.indexOf(state.key) !== -1
    );
    if (show) activeRoots.push(rootKey);
    return activeRoots;
  }, [] as string[]) : ((!action || viewInvalidated) ? sceneViewKeys : []);
  const stream = renderToReadableStream({
    data,
    invalidate,
    url: navigated ? serverNavigator.stateContext.url : null,
    historyAction: navigated ? serverNavigator.stateContext.historyAction : null,
    sceneViews: activeViews.reduce((SceneViews: any, activeKey: string) => {
      const Content = sceneViews[activeKey].default;
      SceneViews[activeKey] = (
        <NavigationHandler stateNavigator={serverNavigator} flattenedSceneViews={flattenedSceneViews}>
          <SceneView fetching active={[state.key]} name={activeKey}><Content /></SceneView>
        </NavigationHandler>
      );
      return SceneViews;
    }, {}),
    flattenedSceneViews
  });
  return new Response(stream, {headers: {'Content-type': 'text/x-component'}});
}

const decodeBody = async (req: Request) => {
  if (req.headers.get('content-type') !== 'application/json') {
    const temporaryReferences = createTemporaryReferenceSet();
    const body = !req.headers.get('content-type')?.startsWith('multipart/form-data') ? await req.text() : await req.formData();
    return decodeReply(body, {temporaryReferences});
  }
  return req.json();
}

if (import.meta.hot) {
  import.meta.hot.accept();
}
