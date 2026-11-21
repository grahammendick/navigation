'use server-entry';
import './client';
import { SceneView } from 'navigation-react';
import Shell from './Shell';
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
        <Shell url={url}>
          <SceneView active={['people', 'person']} name="header">
            <Header />
          </SceneView>
          <SceneView active="people">
            <People />
          </SceneView>
          <SceneView active="person">
            <Person />
          </SceneView>
        </Shell>
      </body>
    </html>
  );
}

export default App;
