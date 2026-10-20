import * as React from 'react';
import { SceneView } from 'navigation-react';
import NavigationProvider from './NavigationProvider.js';
import People from './People.js';
import Person from './Person.js';
import Header from './Header.js';

const App = async ({url}) => {
  return (
    <html>
      <head>
        <meta charSet="utf-8" />
        <title>Navigation React</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0"></meta>
      </head>
      <body>
        <NavigationProvider url={url}>
          <SceneView active={['people', 'person']} name="header">
            <Header />
          </SceneView>
          <SceneView active="people">
            <People />
          </SceneView>
          <SceneView active="person">
            <Person />
          </SceneView>
        </NavigationProvider>
      </body>
    </html>
  );
}

export default App;
