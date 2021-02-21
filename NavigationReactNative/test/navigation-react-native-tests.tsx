// tsc --jsx react --target es6 --lib ES2015 --esModuleInterop --noImplicitAny true navigation-react-native-tests.tsx
import React, { useContext, useState } from 'react';
import { View, Text, ScrollView, TouchableHighlight } from 'react-native';
import { StateNavigator } from 'navigation';
import { NavigationContext, NavigationEvent, NavigationHandler } from 'navigation-react';
import { NavigationStack, NavigationBar, CoordinatorLayout, RightBar, BarButton, SearchBar, SharedElement } from 'navigation-react-native';

type AppNavigation = {
    people: null,
    person: { name: string }
}

const stateNavigator = new StateNavigator<AppNavigation>([
    { key: 'people' },
    { key: 'person', trackCrumbTrail: true }
]);

const List = ({people, children}: {people: string[], children?: any}) => {
    const { stateNavigator } = useContext<NavigationEvent<AppNavigation, 'people'>>(NavigationContext);
    return (
        <ScrollView>
            {people.map((name) => (
                <TouchableHighlight
                    onPress={() => {
                        stateNavigator.navigate('person', {name});
                }}>
                    <SharedElement name={name}>
                        <Text>{name}</Text>
                    </SharedElement>
                </TouchableHighlight>
            ))}
            {children}
        </ScrollView>
    );
}

const People = () => {
    var [ text, setText ] = useState('');
    var people = ['Bob', 'Brenda'];
    const matchedPeople = people.filter(person => (
        person.indexOf(text.toLowerCase()) !== -1
    ));
    return (
        <CoordinatorLayout>
            <NavigationBar largeTitle={true} title="People">
                <SearchBar
                    text={text}
                    autoCapitalize="none"
                    obscureBackground={false}
                    onChangeText={setText}>
                    <List people={matchedPeople} />
                </SearchBar>
                <RightBar>
                    <BarButton title="Search" search={true} />
                </RightBar>
            </NavigationBar>
            <List people={people} />
        </CoordinatorLayout>
    );
}    


var Person = () => {
    const { stateNavigator, data } = useContext<NavigationEvent<AppNavigation, 'person'>>(NavigationContext);
    const { name } = data
    return (
        <>
            <NavigationBar largeTitle={true} title="Person">
                <RightBar>
                    <BarButton title="Cancel" systemItem="cancel" onPress={() => {
                        stateNavigator.navigateBack(1)
                    }} />
                </RightBar>
            </NavigationBar>
            <View>
                <SharedElement name={name} transition="bounce">
                    <Text>{name}</Text>
                </SharedElement>
            </View>
        </>
    );
}

const { people, person } = stateNavigator.states;
people.renderScene = () => <People />;
person.renderScene = () => <Person />;

stateNavigator.navigate('people');

const App = () => (
    <NavigationHandler stateNavigator={stateNavigator}>
      <NavigationStack />
    </NavigationHandler>
  );
  