'use server-entry';
import './client';
import { SceneView } from 'navigation-react';
import NavigationProvider from './NavigationProvider';
import People from './People';
import List from './List';
import Person from './Person';
import Details from './Details';
import Header from './Header';
import Name from './Name';

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
          <SceneView active={['people', 'person']} client>
            <Header>
              <SceneView active="person" name="header" refetch={['id']} fallback={<h1>Person</h1>}>
                <Name />
              </SceneView>
            </Header>
          </SceneView>
          <SceneView active="people" client>
            <People>
              <SceneView active="people" fallback={<h2>loading...</h2>}>
                <List />
              </SceneView>
            </People>
          </SceneView>
          <SceneView active="person" client>
            <Person>
              <SceneView active="person" refetch={['id']} fallback={<h2>loading...</h2>}>
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
