import React from 'react';
import { StateNavigator } from 'navigation';
import { NavigationContext } from 'navigation-react';
import Scene from './Scene';

class NavigationStack extends React.Component<{stateNavigator: StateNavigator}> {
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
        return this.getScenes().map(({key}) => <Scene key={key} crumb={key} />);
    }
};

export default props => (
    <NavigationContext.Consumer>
        {(navigationEvent) => <NavigationStack stateNavigator={navigationEvent.stateNavigator} {...props} />}
    </NavigationContext.Consumer>
)
