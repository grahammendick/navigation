import React from 'react';
import {StyleSheet, View, ListView, TouchableWithoutFeedback} from 'react-native';
import {SharedElement} from 'navigation-react-native';
import ZoomShared from './ZoomShared';

export default class List extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.url = props.stateNavigator.stateContext;
    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2,
    });
    this.state = {
      dataSource: ds.cloneWithRows(props.places),
      selectedId: 0,
    };
  }
  shouldComponentUpdate(props) {
    return this.url === props.stateNavigator.stateContext.url;
  }
  _renderRow = (rowData, sectionId, rowId) => {
    return (
      <TouchableWithoutFeedback
        key={sectionId + rowId}
        onPress={this._onListItemPress.bind(this, rowData, sectionId, rowId)}>
        <View style={[styles.listItem, rowStyle]}>
          <View style={styles.listImage}>
            <Image
              source={{ uri: rowData.image }}
              style={{ flex: 1 }}
            />
          </View>
          <View style={styles.priceLabel}>
            <Text style={styles.priceLabelText}>
              ${rowData.price}
            </Text>
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  };
  _onListItemPress = (rowData, sectionId, rowId) => {
    const {stateNavigator} = this.props;
    if (this.url === stateNavigator.stateContext.url) {
      stateNavigator.navigate('detail', {index: rowId});
    }
  };
  render() {
    const {places, stateNavigator} = this.props;
    return (
      <View style={styles.container}>
        <ListView
          contentContainerStyle={styles.contentContainer}
          dataSource={this.state.dataSource}
          renderRow={this._renderRow}
        />
      </View>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingTop: 40,
  },
  listItem: {
    paddingBottom: 15,
    alignSelf: 'center',
  },
  listItemBorder: {
    width: Dimensions.get('window').width - 30,
    height: 1,
    backgroundColor: 'rgba(0, 0, 0, .25)',
    alignSelf: 'center',
    marginBottom: 15,
  },
  listImage: {
    width: Dimensions.get('window').width - 30,
    height: 201,
  },
  priceLabel: {
    position: 'absolute',
    left: 0,
    bottom: 10,
    backgroundColor: 'rgba(0, 0, 0, .75)',
    paddingVertical: 7.5,
    paddingHorizontal: 10,
  },
  priceLabelText: {
    fontSize: 19,
    textAlign: 'right',
    color: 'white',
  },
});
