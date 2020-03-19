import React, {useContext, useEffect} from 'react';
import {Image, Text, View, TouchableHighlight} from 'react-native';
import {NavigationContext} from 'navigation-react';

const NavigationBar = ({navigationImage, navigationHref, onNavigationPress, isActive = () => true, title, barTintColor, tintColor}) => {
  const {stateNavigator} = useContext(NavigationContext);
  useEffect(() => {
    if (isActive(stateNavigator.stateContext.data))
      document.title = title;
    const setTitle = (_oldState, _state, data, _asyncData, stateContext) => {
      const {crumbs} = stateNavigator.stateContext;
      if (stateContext.crumbs.length === crumbs.length && isActive(data))
        document.title = title;  
    };
    stateNavigator.onNavigate(setTitle);
    return () => stateNavigator.offNavigate(setTitle);
  }, []);
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

const CollapsingBar = () => null;

const CoordinatorLayout = ({children}) => children;

const TabBar = ({children, selectedIndex, selectedTintColor}) => {
  const {stateNavigator} = useContext(NavigationContext);
  return (
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
                if (selectedIndex === index)
                  return;
                if (index === 1)
                  stateNavigator.navigateLink(child.props.link);
                else
                  history.back();
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
};

const TabBarItem = ({children}) => children;

export { NavigationBar, CollapsingBar, CoordinatorLayout, TabBar, TabBarItem };
