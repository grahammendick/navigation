/// <reference path="../src/navigation-react.d.ts" />
/// <reference path="../src/navigation.d.ts" />
/// <reference path="../src/react.d.ts" />

import { StateNavigator } from 'navigation';
import { NavigationBackLink, NavigationLink, RefreshLink } from 'navigation-react';
import * as React from 'react';

namespace NavigationReactTests {
	var stateNavigator = new StateNavigator([
		{ key: 'people', route: 'people/{page}' },
		{ key: 'person', route: 'person/{id}', trackCrumbTrail: true }
	]);

	// Navigation Link
	var NavigationLinkTest = function() {
		return (
			<NavigationLink
				stateKey="people"
				navigationData={{ page: 1 }}
				includeCurrentData={true}
				currentDataKeys="sort"
				activeCssClass="active"
				disableActive={true}
				lazy={false}
				historyAction="replace"
				navigating= {(e: MouseEvent, domId: string, link: string) => true} 
				stateNavigator={stateNavigator}
				target="_blank"
				aria-label="Go to the first page of people">
				Go to page 1
			</NavigationLink>
		);
	}

	// Refresh Link
	var RefreshLinkTest = function() {
		return (
			<RefreshLink
				navigationData={{ page: 2 }}
				includeCurrentData={true}
				currentDataKeys="sort"
				activeCssClass="active"
				disableActive={true}
				lazy={false}
				historyAction="replace"
				navigating= {(e: MouseEvent, domId: string, link: string) => true} 
				stateNavigator={stateNavigator}
				target="_blank"
				aria-label="Go to the second page of people">
				Go to page 2
			</RefreshLink>
		);
	}

	// Navigation Back Link
	var NavigationBackLinkTest = function() {
		return (
			<NavigationBackLink
				distance={1}
				lazy={false}
				historyAction="replace"
				navigating= {(e: MouseEvent, domId: string, link: string) => true} 
				stateNavigator={stateNavigator}
				target="_blank"
				aria-label="Go back to the list of people">
				People
			</NavigationBackLink>
		);
	}
}
