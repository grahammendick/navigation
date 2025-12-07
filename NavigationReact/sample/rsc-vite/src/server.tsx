import { renderToReadableStream } from '@vitejs/plugin-rsc/rsc';
import { StateNavigator } from 'navigation';
import stateNavigator from './stateNavigator.ts';

export default async function handler(request: Request): Promise<Response> {
  return request.method === 'GET' ? get(request) : post(request);
}

const get = async (request: Request) => {
  const serverNavigator = new StateNavigator(stateNavigator);
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
    people: await import('./People.tsx'),
    list: await import('./List.tsx'),
    person: await import('./Person.tsx'),
    friends: await import('./Friends.tsx')
  };
  const {url, sceneViewKey, historyAction, rootViews} = await request.json();
  const serverNavigator = new StateNavigator(stateNavigator);
  serverNavigator.navigateLink(url, historyAction);
  const {state, oldState} = serverNavigator.stateContext;
  const activeViews = oldState ? Object.keys(rootViews).reduce((activeRoots, rootKey) => {
    const active = rootViews[rootKey];
    const show =  active != null && (
        typeof active === 'string' ? state.key === active : active.indexOf(state.key) !== -1
    );
    if (show) activeRoots.push(rootKey);
    return activeRoots;
  }, [] as string[]) : [sceneViewKey];
  const {NavigationHandler} = await import('navigation-react');
  const stream = renderToReadableStream({
    url: oldState ? serverNavigator.stateContext.url : undefined,
    historyAction: oldState ? serverNavigator.stateContext.historyAction : undefined,
    sceneViews: activeViews.reduce((SceneViews, activeKey) => {
      const SceneView = sceneViews[activeKey].default;
      SceneViews[activeKey] = (
        <NavigationHandler stateNavigator={serverNavigator}>
          <SceneView />
        </NavigationHandler>
      );
      return SceneViews;
    }, {})
  });
  return new Response(stream, {headers: {'Content-type': 'text/x-component'}});
}

if (import.meta.hot) {
  import.meta.hot.accept();
}
