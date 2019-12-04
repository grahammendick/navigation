import React from 'react';
import {Text, TouchableHighlight, View} from 'react-native';
import {NavigationContext} from 'navigation-react';
import {SharedElement as SharedElementWeb} from 'navigation-react-mobile';

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
        marginLeft: 15,
        marginRight: 5,
        marginBottom: 5,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end'
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
      {(navigationEvent) => <NavigationBarWeb stateNavigator={navigationEvent.stateNavigator} {...props} />}
  </NavigationContext.Consumer>
)

const RightBar = ({children}) => children;

const BarButton = ({title, ...props}) => (
  <TouchableHighlight underlayColor="#fff" {...props}>
    <Text>{title}</Text>
  </TouchableHighlight>

);

class SharedElement extends React.Component{
  setNativeProps() {
  }
  render() {
    const {style, transition, children, ...props} = this.props;
    return (
      <View style={style}>
        <SharedElementWeb {...props}>
          <div style={{display: 'flex', flex: 1}}>{children}</div>
        </SharedElementWeb>
      </View>
    );
  }
}

export { NavigationBar, RightBar, BarButton, SharedElement };
