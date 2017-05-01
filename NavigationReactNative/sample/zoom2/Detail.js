import React from 'react';
import {StyleSheet, View, ScrollView, Image, Text, TouchableOpacity, Animated, Platform} from 'react-native';
import {NavigationBackAndroid, SharedElement} from 'navigation-react-native';
import ZoomShared from './ZoomShared';

export default class Detail extends React.Component {
  constructor(props, context) {
    super(props, context);
    const {url} = props.stateNavigator.stateContext;
    this.url = url;
    this.state = {
      contentAnimation: new Animated.Value(0),
      navbarAnimation: new Animated.Value(0),
    };
  }
  shouldComponentUpdate(props) {
    return this.url === props.stateNavigator.stateContext.url;
  }
  componentDidMount() {
    this._animate(false);
  }
  _animate(inverse) {
    Animated.timing(this.state.contentAnimation, {
      toValue: inverse ? 0 : 1,
      duration: 500,
      useNativeDriver: true,
    }).start(); 
    setTimeout(() => {
      Animated.timing(this.state.navbarAnimation, {
        toValue: inverse ? 0 : 1,
        duration: inverse ? 50 : 300,
        useNativeDriver: true,
      }).start();      
    }, inverse ? 0 : 500);   
  }
  _goBack = () => {
    const {stateNavigator} = this.props;
    if (this.url === stateNavigator.stateContext.url) {
      stateNavigator.navigateBack(1);
      this._animate(true);
    }
  };  
  render() {
    const {place, rowId, stateNavigator} = this.props;
    const contentTranslateY = this.state.contentAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: [200, 0],
    });
      return (
      <View style={{ flex: 1 }}>
        <ZoomShared stateNavigator={stateNavigator} />
        <NavigationBackAndroid stateNavigator={stateNavigator} />
        <ScrollView style={{ flex: 1 }}>
          <View style={styles.imageContainer}>
            <SharedElement
              name={`image${rowId}`}
              data={{image: place.image}}
              stateNavigator={stateNavigator}>
              <View style={styles.image}>
                <Image
                  source={place.image}
                  style={{ flex: 1 }}
                />
              </View>
            </SharedElement>
            <SharedElement
              name={`label${rowId}`}
              data={{text: place.price}}
              stateNavigator={stateNavigator}>
              <View style={styles.priceLabel}>
                <Text style={styles.priceLabelText}>
                  ${place.price}
                </Text>
              </View>
            </SharedElement>
            <Animated.View
              style={[styles.navbar, { opacity: this.state.navbarAnimation }]}>
              <TouchableOpacity
                onPress={this._goBack}
                hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}>
                <Image
                  style={styles.backButton}
                  source={{
                    uri: 'https://www.android.com/static/img/map/back-arrow.png',
                  }}
                />
              </TouchableOpacity>
              <Text style={styles.title} numberOfLines={1}>{place.title}</Text>
              <View style={styles.placeholder} />
            </Animated.View>
            <Animated.View
              style={{ transform: [{ translateY: contentTranslateY }] }}>
              <Text style={styles.descriptionText}>{place.description}</Text>
            </Animated.View>
          </View>
        </ScrollView>
      </View>
    );
  }
};

const styles = StyleSheet.create({
  imageContainer: {},
  image: {
    flexDirection: 'row',
    height: 220,
  },
  priceLabel: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(0, 0, 0, .75)',
    marginVertical: 16,
    marginLeft: 10,
    paddingVertical: 7.5,
    paddingHorizontal: 10,
  },
  priceLabelText: {
    fontSize: 19,
    color: 'white',
  },
  navbar: {
    position: 'absolute',
    top: Platform.select({
      android: 0,
      ios: 20,
    }),
    left: 0,
    right: 0,
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  backButton: {
    tintColor: 'white',
    width: 20,
    height: 20,
    marginLeft: 16,
  },
  title: {
    color: 'white',
    fontSize: 16,
    flex: 1,
    paddingHorizontal: 10,
    fontWeight: 'bold',
  },
  placeholder: {
    width: 20,
    height: 20,
    marginRight: 16,
  },
  descriptionText: {
    paddingHorizontal: 10,
    marginBottom: 200,
    fontWeight: 'bold',
  },
});
