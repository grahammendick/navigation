import { Platform } from 'react-native';
import NavigationStack from './NavigationStack';
import Scene from './Scene';
import NavigationBarIOS from './NavigationBarIOS';
import LeftBarIOS from './LeftBarIOS';
import RightBarIOS from './RightBarIOS';
import BarButtonIOS from './BarButtonIOS';
import SearchBarIOS from './SearchBarIOS';
import TabBar from './TabBar';
import TabBarItem from './TabBarItem';
import SharedElementAndroid from './SharedElementAndroid';
import TitleBarIOS from './TitleBarIOS';

var TabBarIOS = Platform.OS === 'ios' ? TabBar : () => null;
var TabBarItemIOS = Platform.OS === 'ios' ? TabBarItem : () => null;

export { NavigationStack, Scene, NavigationBarIOS, LeftBarIOS, RightBarIOS, BarButtonIOS, TitleBarIOS, SearchBarIOS, TabBar, TabBarItem, TabBarIOS, TabBarItemIOS, SharedElementAndroid };
