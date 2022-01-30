import React, {useState, useContext, useMemo} from 'react';
import {StyleSheet, Modal, Text, View, TouchableHighlight} from 'react-native';
import {StateNavigator} from 'navigation';
import {NavigationContext, NavigationHandler} from 'navigation-react';
import {NavigationStack, NavigationBar, ModalBackHandler, BarButton, RightBar} from 'navigation-react-native';

const nextDirection = {
  north: 'east',
  east: 'south',
  south: 'west',
  west: 'north',
};

const ModalContext = React.createContext(null);

export default ({direction, color}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const closeModal = useContext(ModalContext);
  const {stateNavigator: {stateContext: {crumbs}}, stateNavigator} = useContext(NavigationContext);
  const modalNavigator = useMemo(() => {
    const navigator = new StateNavigator(stateNavigator);
    navigator.navigate('north');
    return navigator;
  }, [modalVisible]);
  return (
      <>
        <NavigationBar
          title={direction[0].toUpperCase() + direction.slice(1)}
          barTintColor="white">
            <RightBar>
              <BarButton
                show="always"
                title={!closeModal ? "Open" : "Close"}
                onPress={() => {
                  if (!closeModal)
                    setModalVisible(true)
                  else
                    closeModal();
                }} />
            </RightBar>
        </NavigationBar>
        <View style={[
          styles.scene,
          {backgroundColor: color}
        ]}>
          <TouchableHighlight
            underlayColor={color}
            onPress={() => {
              stateNavigator.navigate(nextDirection[direction]);
          }}>
            <Text style={styles.text}>{direction} {crumbs.length}</Text>
          </TouchableHighlight>
          {stateNavigator.canNavigateBack(1) && <TouchableHighlight
            underlayColor={color}
            onPress={() => {
              stateNavigator.navigateBack(1);
          }}>
            <Text style={styles.text}>back</Text>
          </TouchableHighlight>}
          <ModalBackHandler>
            {handleBack => (
              <Modal
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                  if (!handleBack())
                    setModalVisible(false);
                }}>
                <ModalContext.Provider value={() => setModalVisible(false)}>
                  <NavigationHandler stateNavigator={modalNavigator}>
                    <NavigationStack
                      underlayColor="rgba(0,0,0,0)"
                      crumbStyle={(from, state) => state.getCrumbStyle(from)}
                      unmountStyle={(from, state) => state.getUnmountStyle(from)} />
                  </NavigationHandler>
                </ModalContext.Provider>
              </Modal>
            )}
          </ModalBackHandler>
        </View>
      </>
  );
}

const styles = StyleSheet.create({
  scene: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 40,
    color: '#fff',
    fontWeight: 'bold',
  },
});
