import React from 'react';
import {Image, Text, View, TouchableHighlight} from 'react-native';
import {NavigationContext} from 'navigation-react';

class NavigationBarWeb extends React.Component {
  constructor(props) {
    super(props);
    this.setTitle = this.setTitle.bind(this);
  }
  componentDidMount() {
    this.props.stateNavigator.onNavigate(this.setTitle);
    document.title = this.props.title;
  }
  componentWillUnmount() {
    this.props.stateNavigator.offNavigate(this.setTitle);    
  }
  setTitle(_oldState, _state, _data, _asyncData, stateContext) {
    const {crumbs} = this.props.stateNavigator.stateContext;
    if (stateContext.crumbs.length === crumbs.length)
      document.title = this.props.title;
  }
  render() {
    const {navigationImage, navigationHref, onNavigationPress, title} = this.props;
    return (
      <View style={{
        paddingLeft: 15,
        paddingRight: 5,
        paddingBottom: 5,
        paddingTop: 5,
        backgroundColor: '#fff',
        flexDirection: 'row',
      }}>
        <TouchableHighlight
          accessibilityRole="link"
          href={navigationHref}
          underlayColor="white"
          onPress={onNavigationPress}>
          <Image source={navigationImage} style={{width: 24, height: 24}} />
        </TouchableHighlight>
        <Text
          accessibilityRole="heading"
          aria-level="1"
          style={{fontSize: 20}}>
          {title}
        </Text>
      </View>
    );
  }
}

const NavigationBar = props => (
  <NavigationContext.Consumer>
      {({stateNavigator}) => (
        <NavigationBarWeb stateNavigator={stateNavigator} {...props} />
      )}
  </NavigationContext.Consumer>
)

export { NavigationBar };
