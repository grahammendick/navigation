import { Platform } from 'react-native';
import NavigationStack from './NavigationStack';
import Scene from './Scene';
import NavigationBar from './NavigationBar';
import LeftBar from './LeftBar';
import RightBar from './RightBar';
import BarButton from './BarButton';
import SearchBar from './SearchBar';
import TabBar from './TabBar';
import TabBarItem from './TabBarItem';
import SharedElement from './SharedElement';
import TitleBar from './TitleBar';
import BackHandlerContext from './BackHandlerContext';

var NavigationBarIOS = Platform.OS === 'ios' ? NavigationBar : () => null;
var TitleBarIOS = Platform.OS === 'ios' ? TitleBar : () => null;
var RightBarIOS = Platform.OS === 'ios' ? RightBar : () => null;
var LeftBarIOS = Platform.OS === 'ios' ? LeftBar : () => null;
var BarButtonIOS = Platform.OS === 'ios' ? BarButton : () => null;
var SearchBarIOS = Platform.OS === 'ios' ? SearchBar : () => null;
var TabBarIOS = Platform.OS === 'ios' ? TabBar : () => null;
var TabBarItemIOS = Platform.OS === 'ios' ? TabBarItem : () => null;
var SharedElementAndroid = Platform.OS === 'android' ? SharedElement : () => null;

export { NavigationStack, Scene, NavigationBar, LeftBar, RightBar, BarButton, TitleBar, NavigationBarIOS, LeftBarIOS, RightBarIOS, BarButtonIOS, TitleBarIOS, SearchBar, SearchBarIOS, TabBar, TabBarItem, TabBarIOS, TabBarItemIOS, SharedElement, SharedElementAndroid, BackHandlerContext };
