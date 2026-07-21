'use server-entry';
import './client';
import { SceneView } from 'navigation-react';
import NavigationProvider from './NavigationProvider';
import People from './People';
import List from './List';
import Person from './Person';
import Details from './Details';

const App = async ({url}: any) => {
  return (
    <html>
      <head>
        <title>Navigation React</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0"></meta>
      </head>
      <body>
        <NavigationProvider url={url}>
          <SceneView active="people" client>
            <People>
              <SceneView active="people">
                <List />
              </SceneView>
            </People>
          </SceneView>
          <SceneView active="person" client>
            <Person>
              <SceneView active="person" refetch={['id']}>
                <Details />
              </SceneView>
            </Person>
          </SceneView>
        </NavigationProvider>
      </body>
    </html>
  );
}

export default App;
