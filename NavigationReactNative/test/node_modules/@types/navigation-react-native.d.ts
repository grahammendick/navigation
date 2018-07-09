import { Component, ReactNode } from 'react';
import { StateNavigator, State } from 'navigation';

/**
 * Adds handlers for JavaScript and Native Navigate events
 * @param stateNavigator State Navigator(s) that correspond to Native stack(s)
 */
export function addNavigateHandlers(stateNavigator: StateNavigator | StateNavigator[]);

/**
 * Defines the Scene Props contract
 */
export interface SceneProps {
    crumb?: number;
    renderScene?: (state: State, data: any) => ReactNode;
}

/**
 * Renders the scene for the crumb
 */
export class Scene extends Component<SceneProps> { }
