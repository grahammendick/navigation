import React from 'react';
import {StyleSheet} from 'react-native';
import {SharedElement} from 'navigation-react-native';
import ZoomShared from './ZoomShared';

export default class Detail extends React.Component {
  constructor(props, context) {
    super(props, context);
    const {url} = props.stateNavigator.stateContext;
    this.url = url;
  }
  shouldComponentUpdate(props) {
    return this.url === props.stateNavigator.stateContext.url;
  }
  render() {
    const {place, stateNavigator} = this.props;
    return (
        null
    );
  }
};

const styles = StyleSheet.create({
});
