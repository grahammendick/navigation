// tsc --jsx react --target es6 --lib ES2015 --noImplicitAny true navigation-react-native-tests.tsx
import * as React from 'react';
import { View, Text, ScrollView, TouchableHighlight } from 'react-native';
import { StateNavigator } from 'navigation';
import { NavigationContext, NavigationHandler } from 'navigation-react';
import { NavigationStack, NavigationBar, CoordinatorLayout, RightBar, BarButton, SearchBar, SharedElement, TabBar, TabBarItem } from 'navigation-react-native';

const stateNavigator: StateNavigator = new StateNavigator([
    { key: 'people' },
    { key: 'person', trackCrumbTrail: true }
]);

var List = ({people, children}: any) => (
    <NavigationContext.Consumer>
        {({stateNavigator}) => (
            <ScrollView>
                {people.map((name: any) => (
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
        )}
    </NavigationContext.Consumer>
);

class People extends React.Component<any, any> {
    constructor(props: any) {
        super(props);
        this.state = {text: ''};
    }
    render() {
        var people = ['Bob', 'Brenda'];
        var {text} = this.state;
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
                        onChangeText={text => this.setState({text})}>
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
}

var Person = ({ name }: any) => (
    <NavigationContext.Consumer>
        {({stateNavigator}) => (
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
        )}
    </NavigationContext.Consumer>
);

var { people, person } = stateNavigator.states;
people.renderScene = () => <People />;
person.renderScene = ({ name }: any) => <Person name={name}/>;

var App = () => (
    <TabBar>
        <TabBarItem title="Home">
            <NavigationHandler stateNavigator={stateNavigator}>
                <NavigationStack
                    title={({title}, {name}) => name || title}
                    unmountStyle={(from) => from ? 'slide_in' : 'slide_out'}
                    sharedElements={({name}) => name && [name]} />
                </NavigationHandler>
        </TabBarItem>
    </TabBar>
);
