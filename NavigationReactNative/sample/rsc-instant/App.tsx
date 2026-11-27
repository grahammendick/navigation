import { Text } from 'react-native';
import { SceneView } from 'navigation-react';
import { NavigationStack, Scene } from 'navigation-react-native';
import Shell from './Shell';
import People from './People';
import List from './List';
import Person from './Person';
import Name from './Name';
import Details from './Details';

export default function App() {
  return (
    <Shell>
      <NavigationStack>
        <Scene stateKey="people">
          <People>
            <SceneView active="people" client={false} fallback={<Text>loading...</Text>}>
              <List />
            </SceneView>
          </People>
        </Scene>
        <Scene stateKey="person">
          <Person>
            <SceneView active="person" name="header" client={false} fallback={null}>
              <Name />
            </SceneView>
            <SceneView active="person" client={false} fallback={<Text>loading...</Text>}>
              <Details />
            </SceneView>
          </Person>
        </Scene>
      </NavigationStack>
    </Shell>
  );
}
