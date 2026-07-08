'use server-entry';
import './client';
import { SceneView } from 'navigation-react';
import NavigationProvider from './NavigationProvider';
import People from './People';
import Person from './Person';
import List from './List';

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
              <SceneView active="people" name="list">
                <List />
              </SceneView>
            </People>
          </SceneView>
          <SceneView active="person" refetch={['id']}>
            <Person />
          </SceneView>
        </NavigationProvider>
      </body>
    </html>
  );
}

export default App;
