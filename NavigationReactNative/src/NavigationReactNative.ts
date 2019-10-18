import { Platform } from 'react-native';
import NavigationStack from './NavigationStack';
import Scene from './Scene';
import NavigationBar from './NavigationBar';
import LeftBar from './LeftBar';
import RightBar from './RightBar';
import BarButton from './BarButton';
import SearchBarIOS from './SearchBarIOS';
import TabBar from './TabBar';
import TabBarItem from './TabBarItem';
import SharedElementAndroid from './SharedElementAndroid';
import TitleBarIOS from './TitleBarIOS';
import BackHandlerContext from './BackHandlerContext';

var TabBarIOS = Platform.OS === 'ios' ? TabBar : () => null;
var TabBarItemIOS = Platform.OS === 'ios' ? TabBarItem : () => null;

export { NavigationStack, Scene, NavigationBar, LeftBar, RightBar, BarButton, TitleBarIOS, SearchBarIOS, TabBar, TabBarItem, TabBarIOS, TabBarItemIOS, SharedElementAndroid, BackHandlerContext };
