'use server-entry';
import './client';
import { Scene } from 'navigation-react-mobile';
import RootProvider from './RootProvider';
import People from './People';
import Person from './Person';

const App = async ({url}: any) => {
  return (
    <html>
      <head>
        <title>Navigation React Mobile</title>
      </head>
      <body>
        <RootProvider url={url}>
          <Scene stateKey="people">
            <People />
          </Scene>
          <Scene stateKey="person" dataKeyDeps={['id']}>
            <Person />
          </Scene>
        </RootProvider>
      </body>
    </html>
  );
}

export default App;
