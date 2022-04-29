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
});

