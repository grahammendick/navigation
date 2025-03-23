'use server-entry';
import './client';
import { SceneView } from 'navigation-react';
import RootProvider from './RootProvider';
import People from './People';
import Person from './Person';

const App = async ({url}: any) => {
  return (
    <html>
      <head>
        <title>Navigation React</title>
      </head>
      <body>
        <RootProvider url={url}>
          <SceneView active="people">
            <People />
          </SceneView>
          <SceneView active="person" dataKeyDeps={['id']}>
            <Person />
          </SceneView>
        </RootProvider>
      </body>
    </html>
  );
}

export default App;
