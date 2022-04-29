import * as assert from 'assert';
import * as mocha from 'mocha';
import { StateNavigator } from 'navigation';
import { SceneView, NavigationHandler } from 'navigation-react';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { act } from 'react-dom/test-utils';
import { JSDOM } from 'jsdom';

declare var global: any;
global.IS_REACT_ACT_ENVIRONMENT = true;
var { window } = new JSDOM('<!doctype html><html><body></body></html>');
window.addEventListener = () => {};
global.window = window;
global.document = window.document;

describe('SceneViewTest', function () {
    describe('Scene View Active', function () {
        it('should render', function(){
            var stateNavigator = new StateNavigator([
                { key: 's', route: 'r' }
            ]);
            stateNavigator.navigate('s');
            var container = document.createElement('div');
            var root = createRoot(container)
            act(() => {
                root.render(
                    <NavigationHandler stateNavigator={stateNavigator}>
                        <SceneView stateKey="s">
                            <div>scene</div>
                        </SceneView>
                    </NavigationHandler>
                );
            });
            assert.equal(container.innerHTML, '<div>scene</div>');
        })
    });

    describe('Scene View Inactive', function () {
        it('should not render', function(){
            var stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1' },
            ]);
            stateNavigator.navigate('s0');
            var container = document.createElement('div');
            var root = createRoot(container)
            act(() => {
                root.render(
                    <NavigationHandler stateNavigator={stateNavigator}>
                        <SceneView stateKey="s1">
                            <div>scene</div>
                        </SceneView>
                    </NavigationHandler>
                );
            });
            assert.equal(container.innerHTML, '');
        })
    });

    describe('Scene View Active and Inactive', function () {
        it('should render and not render', function(){
            var stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1' },
            ]);
            stateNavigator.navigate('s0');
            var container = document.createElement('div');
            var root = createRoot(container)
            act(() => {
                root.render(
                    <NavigationHandler stateNavigator={stateNavigator}>
                        <SceneView stateKey="s0">
                            <div>scene 0</div>
                        </SceneView>
                        <SceneView stateKey="s1">
                            <div>scene 1</div>
                        </SceneView>
                    </NavigationHandler>
                );
            });
            assert.equal(container.innerHTML, '<div>scene 0</div>');
        })
    });
});

