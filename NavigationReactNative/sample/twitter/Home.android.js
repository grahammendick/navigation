import React from 'react';
import {StyleSheet, BackHandler, Text, TouchableHighlight, ToolbarAndroid, View, ScrollView} from 'react-native';
import ViewPager from '@react-native-community/viewpager';
import Tweets from './Tweets';
import Notifications from './Notifications';

export default class Home extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {page: 0};
    this.handleBack = this.handleBack.bind(this);
  }
  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBack);
  }
  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBack);
  }
  handleBack() {
    if (this.state.page === 1) {
      this.setPage(0);
      return true;
    }
    return false;
  }
  setPage(page) {
    this.setState({page});
    this.viewPager.setPage(page);
  }
  render() {
    var {tweets, follows} = this.props;
    return (
      <View style={{flex: 1}}>
        <ToolbarAndroid title="Home" style={styles.toolbar} />
        <View style={styles.tabs}>
          <TouchableHighlight
            underlayColor="white"
            style={styles.tab}
            onPress={() => this.setPage(0)}>
            <Text style={styles.text}>Home</Text>
          </TouchableHighlight>
          <TouchableHighlight
            underlayColor="white"
            style={styles.tab}
            onPress={() => this.setPage(1)}>
            <Text style={styles.text}>Notifications</Text>
          </TouchableHighlight>
        </View>
        <ViewPager
          ref={el => this.viewPager = el}
          onPageSelected={({nativeEvent}) => {
            this.setState({page: nativeEvent.position})
          }}
          style={{flex: 1}}>
          <View key={1}>
            <ScrollView style={styles.view}>
              <Tweets tweets={tweets} />
            </ScrollView>
          </View>
          <View key={2}>
            <ScrollView style={styles.view}>
              <Notifications follows={follows} />
            </ScrollView>
          </View>
        </ViewPager>
      </View>
    );
  }
};

const styles = StyleSheet.create({
  toolbar: {
    height: 50,
  },
  tabs: {
    height: 60,
    flexDirection: 'row',
  },
  tab: {
    flex: 1,
    alignItems: 'center'
  },
  text: {
    fontSize: 18,
  },
  view: {
    paddingLeft: 20,
    paddingRight: 20,
  },
});
