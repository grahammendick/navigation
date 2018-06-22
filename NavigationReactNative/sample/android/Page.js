import React from 'react';
import {StyleSheet, Text, View, TouchableHighlight} from 'react-native';
import {NavigationContext} from 'navigation-react';

var Page = () => (
    <NavigationContext.Consumer>
        {({stateNavigator}) => (
            <View style={styles.container}>
                <Text style={styles.text}>
                    {`Scene ${stateNavigator.stateContext.crumbs.length}`}
                </Text>
                <TouchableHighlight
                    style={styles.button}
                    onPress={() => stateNavigator.navigate('scene')}>
                    <Text>Next</Text>
                </TouchableHighlight>
            </View>
        )}
    </NavigationContext.Consumer>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    button: {
        alignItems: 'center',
        backgroundColor: '#DDDDDD',
        padding: 10
    },
    text: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
});

export default Page;