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
          <NavigationStack
            unmountStyle={[{transform: 'translateX(100%)'}, {transform: 'translateX(0)'}]}
            crumbStyle={[{transform: 'translateX(5%) scale(0.9)', opacity: 0},{transform: 'translateX(0) scale(1)', opacity: 1}]}
            style={{
              position: 'fixed',
              left: '0',
              right: '0',
              top: '0',
              bottom: '0',
              overflow: 'auto',
              backgroundColor: '#fff',
              margin: '8px',
            }}>
            <Scene stateKey="people"><People /></Scene>
            <Scene stateKey="person"><Person /></Scene>
          </NavigationStack>
        </RootProvider>
      </body>
    </html>
  );
}

export default App;
