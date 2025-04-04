'use server-entry';
import './client';
import { NavigationStack, Scene } from 'navigation-react-mobile';
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
          <NavigationStack>
            <Scene stateKey="people"><People /></Scene>
            <Scene stateKey="person"><Person /></Scene>
          </NavigationStack>
        </RootProvider>
      </body>
    </html>
  );
}

export default App;
