import React from 'react';
import { requireNativeComponent, StyleSheet, View } from 'react-native';
import { StateNavigator, State } from 'navigation';
import { NavigationContext } from 'navigation-react';
import Scene from './Scene';
type NavigationStackProps = {stateNavigator: StateNavigator, title: (state: State, data: any) => string};

class NavigationStack extends React.Component<NavigationStackProps> {
    private ref: React.RefObject<View>;
    constructor(props) {
        super(props);
        this.ref = React.createRef<View>();
        this.onDidNavigateBack = this.onDidNavigateBack.bind(this);
    }
    onDidNavigateBack({nativeEvent}) {
        var {stateNavigator} = this.props;
        var {eventCount: mostRecentEventCount, crumb} = nativeEvent;
        this.ref.current.setNativeProps({mostRecentEventCount});
        var distance = stateNavigator.stateContext.crumbs.length - crumb;
        if (stateNavigator.canNavigateBack(distance))
            stateNavigator.navigateBack(distance);
    }
    getScenes(){
        var {stateNavigator} = this.props;
        var {crumbs, nextCrumb} = stateNavigator.stateContext;
        return crumbs.concat(nextCrumb).map(({state, data, url}, index, crumbsAndNext) => {
            var preCrumbs = crumbsAndNext.slice(0, index);
            var {state: nextState, data: nextData} = crumbsAndNext[index + 1] || {state: undefined, data: undefined};
            return {key: index, state, data, url, crumbs: preCrumbs, nextState, nextData, mount: url === nextCrumb.url};
        });
    }
    render() {
        return (
            <NVNavigationStack
                ref={this.ref}
                style={styles.stack}
                onDidNavigateBack={this.onDidNavigateBack}>
                {this.getScenes().map(({key}) => (
                    <Scene key={key} crumb={key} title={this.props.title} />
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
