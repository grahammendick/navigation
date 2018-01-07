import { StateNavigator } from 'navigation';
import { NavigationBackLink, NavigationLink, RefreshLink } from 'navigation-react';
import * as React from 'react';

const stateNavigator = new StateNavigator([
    { key: 'people', route: 'people/{page}' },
    { key: 'person', route: 'person/{id}', trackCrumbTrail: true }
]);

// Refresh Link
let RefreshLinkTest = () => <RefreshLink>People</RefreshLink>;

RefreshLinkTest = () => {
    return (
        <RefreshLink
            navigationData={{ page: 2 }}
            includeCurrentData={true}
            currentDataKeys="sort"
            activeCssClass="active"
            disableActive={true}
            acrossCrumbs={false}
            historyAction="replace"
            navigating= {(e: React.MouseEvent<HTMLAnchorElement>, link: string) => true}
            stateNavigator={stateNavigator}
            target="_blank"
            aria-label="Go to the second page of people">
            People
        </RefreshLink>
    );
};

// Navigation Link
let NavigationLinkTest = () => <NavigationLink stateKey="person">Person</NavigationLink>;

NavigationLinkTest = () => {
    return (
        <NavigationLink
            stateKey="person"
            navigationData={{ id: 12 }}
            includeCurrentData={false}
            currentDataKeys=""
            activeCssClass=""
            disableActive={false}
            acrossCrumbs={false}
            historyAction="add"
            navigating= {(e: React.MouseEvent<HTMLAnchorElement>, link: string) => true}
            stateNavigator={stateNavigator}
            target="_blank"
            aria-label="View the person's details">
            Person
        </NavigationLink>
    );
};

// Navigation Back Link
let NavigationBackLinkTest = () => <NavigationBackLink distance={1}>People</NavigationBackLink>;

NavigationBackLinkTest = () => {
    return (
        <NavigationBackLink
            distance={1}
            acrossCrumbs={false}
            historyAction="none"
            navigating= {(e: React.MouseEvent<HTMLAnchorElement>, link: string) => true}
            stateNavigator={stateNavigator}
            target="_blank"
            aria-label="Go back to the list of people">
            People
        </NavigationBackLink>
    );
};
