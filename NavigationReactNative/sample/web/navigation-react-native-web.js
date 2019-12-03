import React from 'react';
import {View} from 'react-native';
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
    return null;
  }
}

const NavigationBar = props => (
  <NavigationContext.Consumer>
      {(navigationEvent) => <NavigationBarWeb stateNavigator={navigationEvent.stateNavigator} {...props} />}
  </NavigationContext.Consumer>
)

const RightBar = () => null;
const BarButton = () => null;

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
