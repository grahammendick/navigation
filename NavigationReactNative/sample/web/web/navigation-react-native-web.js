import React from 'react';
import {View} from 'react-native';
import {SharedElement} from 'navigation-react-mobile';

class SharedElementAndroid extends React.Component{
  setNativeProps() {
  }
  render() {
    const {style,children,...props} = this.props;
    return (
      <View style={style}>
        <SharedElement {...props}>
          <div style={{display: 'flex', flex: 1}}>{children}</div>
        </SharedElement>
      </View>
    );
  }
}

export { SharedElementAndroid };
