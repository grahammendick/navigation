 import {AppRegistry} from 'react-native';
 import App from './App';
 
 AppRegistry.registerComponent('twitter', () => App);
 
 AppRegistry.runApplication('twitter', {
   initialProps: {},
   rootTag: document.getElementById('content')
 });
 