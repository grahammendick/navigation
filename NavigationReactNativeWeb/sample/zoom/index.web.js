import {AppRegistry} from 'react-native';
import App from './App';

AppRegistry.registerComponent('zoom', () => App);

AppRegistry.runApplication('zoom', {
  initialProps: {},
  rootTag: document.getElementById('content')
});
