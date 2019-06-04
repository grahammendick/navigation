import React from 'react';
import { requireNativeComponent, StyleSheet, View } from 'react-native';
import { StateNavigator, Crumb, State } from 'navigation';
import { NavigationContext } from 'navigation-react';
import Scene from './Scene';
type NavigationStackProps = {stateNavigator: StateNavigator, title: (state: State, data: any) => string, crumbStyle: any, unmountStyle: any};
type SceneContext = { key: number, state: State, data: any, url: string, crumbs: Crumb[], nextState: State, nextData: any, mount: boolean };

class NavigationStack extends React.Component<NavigationStackProps> {
    private ref: React.RefObject<View>;
    constructor(props) {
        super(props);
        this.ref = React.createRef<View>();
        this.onDidNavigateBack = this.onDidNavigateBack.bind(this);
    }
    static defaultProps = {
        unmountStyle: () => null,
        crumbStyle: () => null
    }
    onDidNavigateBack({nativeEvent}) {
        var {stateNavigator} = this.props;
        var {eventCount: mostRecentEventCount, crumb} = nativeEvent;
        this.ref.current.setNativeProps({mostRecentEventCount});
        var distance = stateNavigator.stateContext.crumbs.length - crumb;
        if (stateNavigator.canNavigateBack(distance))
            stateNavigator.navigateBack(distance);
    }
    getScenes(): SceneContext[]{
        var {stateNavigator} = this.props;
        var {crumbs, nextCrumb} = stateNavigator.stateContext;
        return crumbs.concat(nextCrumb).map(({state, data, url}, index, crumbsAndNext) => {
            var preCrumbs = crumbsAndNext.slice(0, index);
            var {state: nextState, data: nextData} = crumbsAndNext[index + 1] || {state: undefined, data: undefined};
            return {key: index, state, data, url, crumbs: preCrumbs, nextState, nextData, mount: url === nextCrumb.url};
        });
    }
    getAnimation(crumb: number): {enterAnim: string, exitAnim: string} {
        var {stateNavigator, unmountStyle, crumbStyle} = this.props;
        var {state, data, oldState, oldData, oldUrl, crumbs, nextCrumb} = stateNavigator.stateContext;
        if (!oldState || crumb != crumbs.length)
            return null;
        var {crumbs: oldCrumbs} = stateNavigator.parseLink(oldUrl);
        if (oldCrumbs.length < crumbs.length) {
            var {state: nextState, data: nextData} = crumbs.concat(nextCrumb)[oldCrumbs.length + 1];
            var enterAnim = unmountStyle(true, state, data, crumbs);
            var exitAnim = crumbStyle(false, oldState, oldData, oldCrumbs, nextState, nextData);
        }
        if (crumbs.length < oldCrumbs.length) {
            var nextCrumb = new Crumb(oldData, oldState, null, null, false);
            var {state: nextState, data: nextData} = oldCrumbs.concat(nextCrumb)[crumbs.length + 1];
            var enterAnim = crumbStyle(true, state, data, crumbs, nextState, nextData);
            var exitAnim = unmountStyle(false, oldState, oldData, oldCrumbs);
        }
        return {enterAnim, exitAnim};
    }
    render() {
        return (
            <NVNavigationStack
                ref={this.ref}
                style={styles.stack}
                onDidNavigateBack={this.onDidNavigateBack}>
                {this.getScenes().map(({key}) => (
                    <Scene
                        key={key}
                        crumb={key}
                        {...this.getAnimation(key)}
                        title={this.props.title} />
                ))}
            </NVNavigationStack>
        );
    }
};

var  NVNavigationStack = requireNativeComponent<any>('NVNavigationStack', null);

const styles = StyleSheet.create({
    stack: {
        flex: 1,
    },
});

export default props => (
    <NavigationContext.Consumer>
        {(navigationEvent) => <NavigationStack stateNavigator={navigationEvent.stateNavigator} {...props} />}
    </NavigationContext.Consumer>
)
