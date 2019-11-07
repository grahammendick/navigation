import * as React from 'react';
import { View, Text, TouchableHighlight } from 'react-native';
import { StateNavigator } from 'navigation';
import { NavigationContext, NavigationHandler } from 'navigation-react';
import { NavigationStack, NavigationBar, RightBar, BarButton, SearchBar, SharedElementAndroid, TabBar, TabBarItem } from 'navigation-react-native';

const stateNavigator: StateNavigator = new StateNavigator([
    { key: 'people' },
    { key: 'person', trackCrumbTrail: true }
]);

var List = ({people, children}: any) => (
    <NavigationContext.Consumer>
        {({stateNavigator}) => (
            <>
                <NavigationBar title="People" />
                <View>
                    {people.map(name => (
                        <TouchableHighlight
                            onPress={() => {
                                stateNavigator.navigate('person', {name});
                        }}>
                            <SharedElementAndroid name={name}>
                                <Text>{name}</Text>
                            </SharedElementAndroid>
                        </TouchableHighlight>
                    ))}
                    {children}
                </View>
            </>
        )}
    </NavigationContext.Consumer>
);

class People extends React.Component<any, any> {
    constructor(props) {
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
            <>
                <NavigationBar largeTitle={true} title="Person">
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
            </>
        );
    }    
}

var Person = ({ name }) => (
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
                    <SharedElementAndroid name={name} transition="bounce">
                        <Text>{name}</Text>
                    </SharedElementAndroid>
                </View>
            </>
        )}
    </NavigationContext.Consumer>
);

var { people, person } = stateNavigator.states;
people.renderScene = () => <People />;
person.renderScene = ({ name }) => <Person name={name}/>;

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
