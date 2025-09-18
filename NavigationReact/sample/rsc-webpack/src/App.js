import * as React from 'react';
import { SceneView } from 'navigation-react';
import NavigationProvider from './NavigationProvider.js';
import HmrProvider from './HmrProvider.js';
import People from './People.js';
import Person from './Person.js';

const App = async ({url}) => {
  return (
    <html>
      <head>
        <title>Navigation React</title>
      </head>
      <body>
        <NavigationProvider url={url}>
          <HmrProvider>
            <SceneView active="people" refetch={[]}>
              <People />
            </SceneView>
            <SceneView active="person" refetch={['id']}>
              <Person />
            </SceneView>
          </HmrProvider>
        </NavigationProvider>
      </body>
    </html>
  );
}

export default App;
