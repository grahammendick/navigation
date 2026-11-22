'use client';
import { NavigationStack, Scene, TabBar, TabBarItem } from 'navigation-react-native';
import Shell from './Shell';
import People from './People';
import Person from './Person';
import Home from './Home';

const Tabs = () => (
  <TabBar primary={true}>
    {['One', 'Two'].map(title => (
      <TabBarItem key={title} title={title}>
        <Shell url="/">
          <NavigationStack>
            <Scene stateKey="home">
              <Home />
            </Scene>
            <Scene stateKey="people" client={false}>
              <People />
            </Scene>
            <Scene stateKey="person" client={false}>
              <Person />
            </Scene>
          </NavigationStack>
        </Shell>
      </TabBarItem>
    ))}
  </TabBar>
);

export default Tabs;
