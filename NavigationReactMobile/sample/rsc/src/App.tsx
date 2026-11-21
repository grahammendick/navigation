'use server-entry';
import './client';
import { NavigationStack, Scene } from 'navigation-react-mobile';
import Shell from './Shell';
import People from './People';
import Person from './Person';

const App = async ({url}: any) => {
  return (
    <html>
      <head>
        <meta charSet="utf-8" />
        <title>Navigation React Mobile</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0"></meta>
      </head>
      <body>
        <Shell url={url}>
          <NavigationStack
            unmountStyle={[{transform: 'translateX(100%)'}, {transform: 'translateX(0)'}]}
            crumbStyle={[{transform: 'translateX(5%) scale(0.9)', opacity: 0},{transform: 'translateX(0) scale(1)', opacity: 1}]}
            style={{position: 'fixed', left: '0', right: '0', top: '0', bottom: '0', overflow: 'auto', backgroundColor: '#fff', padding: '8px'}}>
              <Scene stateKey="people">
                <People />
              </Scene>
              <Scene stateKey="person">
                <Person />
              </Scene>
          </NavigationStack>
        </Shell>
      </body>
    </html>
  );
}

export default App;
