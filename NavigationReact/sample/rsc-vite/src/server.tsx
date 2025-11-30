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
      <App url={url} />
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
    const {url, sceneViewKey} = await request.json();
    const SceneView = sceneViews[sceneViewKey].default;
    const serverNavigator = new StateNavigator(stateNavigator);
    serverNavigator.navigateLink(url);
    const {NavigationHandler} = await import('navigation-react');
    const rscStream = renderToReadableStream((
      <NavigationHandler stateNavigator={serverNavigator}>
        <SceneView />
      </NavigationHandler>
    ));
    return new Response(rscStream, {headers: {'Content-type': 'text/x-component'}});
}

if (import.meta.hot) {
  import.meta.hot.accept();
}
