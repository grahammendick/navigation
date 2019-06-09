import { StateNavigator, State } from 'navigation';
import { NavigationContext, NavigationHandler } from 'navigation-react';
import { NavigationStack, RightBarIOS, BarButtonIOS, SharedElementAndroid, TabBarIOS, TabBarItemIOS } from 'navigation-react-native';
import * as React from 'react';
import { Platform, View, Text, TouchableHighlight } from 'react-native';

const stateNavigator: StateNavigator = new StateNavigator([
    { key: 'people', title: 'People' },
    { key: 'person', title: 'Person', trackCrumbTrail: true }
]);

var People = () => (
    <NavigationContext.Consumer>
        {({stateNavigator}) => (
            <View>
                {['Bob', 'Brenda'].map(name => (
                    <TouchableHighlight
                        onPress={() => {
                            stateNavigator.navigate('person', {name});
                    }}>
                        <SharedElementAndroid name={name}>
                            <Text>{name}</Text>
                        </SharedElementAndroid>
                    </TouchableHighlight>
                ))}
            </View>
        )}
    </NavigationContext.Consumer>
);

var Person = ({ name }) => (
    <NavigationContext.Consumer>
        {({stateNavigator}) => (
            <View>
                <RightBarIOS>
                    <BarButtonIOS systemItem="cancel" onPress={() => {
                        stateNavigator.navigateBack(1)
                    }} />
                </RightBarIOS>
                <SharedElementAndroid name={name} transition="bounce">
                    <Text>{name}</Text>
                </SharedElementAndroid>
            </View>
        )}
    </NavigationContext.Consumer>
);

var { people, person } = stateNavigator.states;
people.renderScene = () => <People />;
person.renderScene = ({ name }) => <Person name={name}/>;

person.getTitle = ({name}) => name;
var getSceneTitle = ({getTitle, title}: State, data) => (
    getTitle ? getTitle(data) : title
)
  
var App = () => (
    Platform.OS == 'ios' ? (
        <TabBarIOS>
            <TabBarItemIOS title="Home">
                <NavigationHandler stateNavigator={stateNavigator}>
                    <NavigationStack title={getSceneTitle} />
                </NavigationHandler>
            </TabBarItemIOS>
        </TabBarIOS>
    ) : (
        <NavigationHandler stateNavigator={stateNavigator}>
            <NavigationStack
                unmountStyle={(from) => from ? 'slide_in' : 'slide_out'}
                sharedElements={({name}) => name && [name]} />
        </NavigationHandler>
    )
);
