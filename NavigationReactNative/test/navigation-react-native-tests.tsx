import * as React from 'react';
import { View, Text, TouchableHighlight } from 'react-native';
import { StateNavigator } from 'navigation';
import { NavigationContext, NavigationHandler } from 'navigation-react';
import { NavigationStack, NavigationBarIOS, RightBarIOS, BarButtonIOS, SearchBarIOS, SharedElementAndroid, TabBar, TabBarItem } from 'navigation-react-native';

const stateNavigator: StateNavigator = new StateNavigator([
    { key: 'people' },
    { key: 'person', trackCrumbTrail: true }
]);

var List = ({people, children}: any) => (
    <NavigationContext.Consumer>
        {({stateNavigator}) => (
            <View>
                <NavigationBarIOS title="People" />
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
            <List people={people}>
                <NavigationBarIOS largeTitle={true} title="Person">
                    <SearchBarIOS
                        text={text}
                        autoCapitalize="none"
                        obscureBackground={false}
                        onChangeText={text => this.setState({text})}>
                        <List people={matchedPeople} />
                    </SearchBarIOS>
                </NavigationBarIOS>
            </List>
        );
    }    
}

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
