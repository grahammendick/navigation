import React from 'react';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import TabBar from './TabBar';
import Tweets from './Tweets';
import Follows from './Follows';

export default class Home extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.url = props.stateNavigator.stateContext.url;
  }
  shouldComponentUpdate(props) {
    return this.url === props.stateNavigator.stateContext.url;
  }
  render() {
    const {tweets, follows, stateNavigator} = this.props;
    <ScrollableTabView
      prerenderingSiblingsNumber={1}
      renderTabBar={() => <TabBar stateNavigator={stateNavigator} />}>
      <Tweets tweets={tweets} stateNavigator={stateNavigator} tabLabel="Timeline" />
      <Follows follows={follows} stateNavigator={stateNavigator} tabLabel="Notification" />
    </ScrollableTabView>
  }
};
