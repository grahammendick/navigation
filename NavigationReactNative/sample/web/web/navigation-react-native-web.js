import React from 'react';
import {View} from 'react-native';
import {SharedElement} from 'navigation-react-mobile';

class SharedElementAndroid extends React.Component{
  setNativeProps() {
  }
  render() {
    const {style,...props} = this.props;
    return (
      <View style={style}>
        <SharedElement {...props} />
      </View>
    );
  }
}

export { SharedElementAndroid };
