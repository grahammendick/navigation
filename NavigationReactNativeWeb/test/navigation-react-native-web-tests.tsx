// tsc --jsx react --target es6 --lib ES2015 --esModuleInterop --noImplicitAny true --strict true navigation-react-native-web-tests.tsx
import React, { useContext } from 'react';
import { View, Text, ScrollView, TouchableHighlight } from 'react-native';
import { StateNavigator } from 'navigation';
import { NavigationContext, NavigationEvent, NavigationHandler } from 'navigation-react';
import { NavigationStack, NavigationBar, CoordinatorLayout, RightBar, BarButton, SharedElement } from 'navigation-react-native';
import types from 'navigation-react-native-web';

type AppNavigation = {
    people: null,
    person: { name: string }
}

const stateNavigator = new StateNavigator<AppNavigation>([
    { key: 'people', route: '' },
    { key: 'person', trackCrumbTrail: true }
], new NavigationStack.HistoryManager(() => ''));

const People = () => {
    var people = ['Bob', 'Brenda'];
    return (
        <CoordinatorLayout>
            <NavigationBar title="People" />
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
            </ScrollView>
        </CoordinatorLayout>
    );
}

var Person = () => {
    const { stateNavigator, data } = useContext<NavigationEvent<AppNavigation, 'person'>>(NavigationContext);
    const { name } = data
    return (
        <>
            <NavigationBar
                title="Person"
                navigationHref={stateNavigator.historyManager.getHref(
                    stateNavigator.getNavigationBackLink(1)
                )}
                onNavigationPress={() => stateNavigator.navigateBack(1)}>
                <RightBar>
                    <BarButton
                        title="Cancel"
                        href={stateNavigator.historyManager.getHref(
                            stateNavigator.getNavigationBackLink(1)
                        )}
                        onPress={() => stateNavigator.navigateBack(1)} />
                </RightBar>
            </NavigationBar>
            <View>
                <SharedElement name={name}>
                    <Text>{name}</Text>
                </SharedElement>
            </View>
        </>
    );
}

const { people, person } = stateNavigator.states;
people.renderScene = () => <People />;
person.renderScene = () => <Person />;

stateNavigator.start();

const AppShared = (props: any) => (
    <NavigationStack.SharedElementTransition {...props}>
        {(_, name) => <View key={name} />}
    </NavigationStack.SharedElementTransition>
)

const App = () => (
    <NavigationHandler stateNavigator={stateNavigator}>
      <NavigationStack sharedElementTransition={props => <AppShared {...props} />} />
    </NavigationHandler>
  );
  