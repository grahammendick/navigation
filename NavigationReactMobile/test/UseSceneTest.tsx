import assert from 'assert';
import mocha from 'mocha';
import { StateNavigator } from 'navigation';
import { NavigationHandler } from 'navigation-react';
import { NavigationMotion, useSceneNavigating } from 'navigation-react-mobile';
import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { Simulate } from 'react-dom/test-utils';
import { JSDOM } from 'jsdom';

declare var global: any;
var { window } = new JSDOM('<!doctype html><html><body></body></html>', { pretendToBeVisual: true });
window.addEventListener = () => {};
global.window = window;
global.document = window.document;

describe('UseScene', function () {
    describe('A', function () {
        it('should call navigating hook', function(){
            var stateNavigator = new StateNavigator([
                { key: 'sceneA', route: 'r' }
            ]);
            stateNavigator.navigate('sceneA');
            var {sceneA} = stateNavigator.states;
            var navigatingA = false;
            var SceneA = () => {
                useSceneNavigating(() => {
                    navigatingA = true;
                })
                return <span>Hello</span>;
            }
            sceneA.renderScene = () => <SceneA />;
            var container = document.createElement('div');
            ReactDOM.render(
                <NavigationHandler stateNavigator={stateNavigator}>
                    <NavigationMotion duration={0}>
                        {(_style, scene, key) => (
                            <div key={key}>
                                {scene}
                            </div>
                        )}
                    </NavigationMotion>
                </NavigationHandler>,
                container
            );
            try {
                assert.equal(navigatingA, true);
            } finally {
                ReactDOM.unmountComponentAtNode(container);
            }
        })
    });
});
