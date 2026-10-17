'use server-entry';
import './client';
import { SceneView } from 'navigation-react';
import NavigationProvider from './NavigationProvider';
import People from './People';
import Person from './Person';
import Header from './Header';

const App = async ({url}: any) => {
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
