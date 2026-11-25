'use client';
import { View } from 'react-native';
import { NavigationStack, Scene, TabBar, TabBarItem } from 'navigation-react-native';
import Shell from './Shell';
import People from './People';
import Person from './Person';

const Tabs = () => (
  <TabBar primary={true}>
    {['One', 'Two'].map((title, i) => (
      <TabBarItem key={title} title={title}>
        <View collapsable={false} style={{flex: 1}}>
          <Shell url={`/person/${i + 1}/false`}>
            <NavigationStack>
              <Scene stateKey="people" client={false}>
                <People />
              </Scene>
              <Scene stateKey="person" client={false}>
                <Person />
              </Scene>
            </NavigationStack>
          </Shell>
        </View>
      </TabBarItem>
    ))}
  </TabBar>
);

export default Tabs;
