import React from 'react';
import {Text, View} from 'react-native';
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
    return (
      <View style={{
        paddingLeft: 15,
        paddingRight: 5,
        paddingBottom: 5,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        backgroundColor: '#fff'
      }}>
        <Text
          accessibilityRole="heading"
          aria-level="1"
          style={{fontSize: 20}}>
          {this.props.title}
        </Text>
        {this.props.children}
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
