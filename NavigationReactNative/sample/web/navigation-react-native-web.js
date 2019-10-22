import React from 'react';
import {View} from 'react-native';
import {NavigationContext} from 'navigation-react';
import {SharedElement} from 'navigation-react-mobile';

class NavigationBar extends React.Component {
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
    return null;
  }
}

const NavigationBarIOS = props => (
  <NavigationContext.Consumer>
      {(navigationEvent) => <NavigationBar stateNavigator={navigationEvent.stateNavigator} {...props} />}
  </NavigationContext.Consumer>
)

const RightBarIOS = () => null;
const BarButtonIOS = () => null;

class SharedElementAndroid extends React.Component{
  setNativeProps() {
  }
  render() {
    const {style, transition, children, ...props} = this.props;
    return (
      <View style={style}>
        <SharedElement {...props}>
          <div style={{display: 'flex', flex: 1}}>{children}</div>
        </SharedElement>
      </View>
    );
  }
}

export { NavigationBarIOS, RightBarIOS, BarButtonIOS, SharedElementAndroid };
