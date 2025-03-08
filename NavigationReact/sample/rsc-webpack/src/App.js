import * as React from 'react';
import { SceneView } from "navigation-react";
import RootProvider from "./RootProvider.js";
import Person from './Person.js';
import People from './People.js';

const App = async ({url}) => {
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
