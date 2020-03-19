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
    const {navigationImage, navigationHref, onNavigationPress, title, barTintColor, tintColor} = this.props;
    return (
      <View style={{
        paddingLeft: 15,
        paddingRight: 5,
        paddingBottom: 5,
        paddingTop: 5,
        flexDirection: 'row',
      }}>
       {navigationImage && <TouchableHighlight
          accessibilityRole="link"
          href={navigationHref}
          underlayColor={barTintColor}
          onPress={onNavigationPress}
          style={{marginRight: 20}}>
          <Image source={navigationImage} style={{width: 24, height: 24, tintColor}} />
        </TouchableHighlight>}
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

const CollapsingBar = () => null;

const CoordinatorLayout = ({children}) => children;

const TabBarWeb = ({children, selectedIndex, selectedTintColor, stateNavigator}) => (
  <>
    {React.Children.toArray(children)
      .map((child, index) => (
        <View key={index} style={{display: index === selectedIndex ? 'flex' : 'none', flex: 1}}>
          {React.cloneElement(child, {...child.props})}
        </View>
      ))}
    <View style={{flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center'}}>
      {React.Children.toArray(children)
        .map((child, index) => (
          <TouchableHighlight
            key={index}
            accessibilityRole="link"
            href={stateNavigator.historyManager.getHref(child.props.link)}
            underlayColor="#fff"
            onPress={() => {
              if (selectedIndex !== index)
                stateNavigator.navigateLink(child.props.link);
            }}
            style={{flex: 1, justifyContent: 'center', alignItems: 'center', height: 72}}>
            <>
              <Image source={child.props.image} style={{width: 24, height: 24, tintColor: index === selectedIndex ? selectedTintColor : '#808080'}} />
              <Text style={{color: index === selectedIndex ? selectedTintColor : '#808080'}}>{child.props.title}</Text>
            </>
          </TouchableHighlight>
        ))}
    </View>
  </>
);

const TabBarItem = ({children}) => children;

const TabBar = props => (
  <NavigationContext.Consumer>
      {({stateNavigator}) => (
        <TabBarWeb stateNavigator={stateNavigator} {...props} />
      )}
  </NavigationContext.Consumer>
)


export { NavigationBar, CollapsingBar, CoordinatorLayout, TabBar, TabBarItem };
