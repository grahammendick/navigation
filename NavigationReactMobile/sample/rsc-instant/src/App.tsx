'use server-entry';
import './client';
import { SceneView } from 'navigation-react';
import { NavigationStack, Scene } from 'navigation-react-mobile';
import NavigationProvider from './NavigationProvider';
import People from './People';
import List from './List';
import Person from './Person';
import Details from './Details';

const App = async ({url}: any) => {
  return (
    <html>
      <head>
        <title>Navigation React Mobile</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0"></meta>
      </head>
      <body>
        <NavigationProvider url={url}>
          <NavigationStack
            unmountStyle={[{transform: 'translateX(100%)'}, {transform: 'translateX(0)'}]}
            crumbStyle={[{transform: 'translateX(5%) scale(0.9)', opacity: 0},{transform: 'translateX(0) scale(1)', opacity: 1}]}
            style={{position: 'fixed', left: '0', right: '0', top: '0', bottom: '0', overflow: 'auto', backgroundColor: '#fff', padding: '8px'}}>
              <Scene stateKey="people" client>
                <People>
                  <SceneView active="people">
                    <List />
                  </SceneView>
                </People>
              </Scene>
              <Scene stateKey="person" client>
                <Person>
                  <SceneView active="person" refetch={['id']}>
                    <Details />
                  </SceneView>
                </Person>
              </Scene>
          </NavigationStack>
        </NavigationProvider>
      </body>
    </html>
  );
}

export default App;
