import { NavigationStack, Scene } from 'navigation-react-native';
import Shell from './Shell';
import People from './People';
import Person from './Person';

export default function App() {
  return (
    <Shell url="/">
      <NavigationStack>
        <Scene stateKey="people" client={false}>
          <People />
        </Scene>
        <Scene stateKey="person" client={false}>
          <Person />
        </Scene>
      </NavigationStack>
    </Shell>
  );
}
