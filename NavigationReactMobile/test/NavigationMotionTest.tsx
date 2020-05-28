import assert from 'assert';
import 'mocha';
import { StateNavigator } from 'navigation';
import { NavigationHandler } from 'navigation-react';
import { NavigationMotion } from 'navigation-react-mobile';
import React from 'react';
import ReactDOM from 'react-dom';
import { act } from 'react-dom/test-utils';
import { JSDOM } from 'jsdom';

declare var global: any;
var { window } = new JSDOM('<!doctype html><html><body></body></html>');
window.addEventListener = () => {};
global.window = window;
global.document = window.document;
window.requestAnimationFrame = () => {};
window.cancelAnimationFrame = () => {};

describe('NavigationMotion', function () {
    describe('A', function () {
        it('should render stack', function(){
            var stateNavigator = new StateNavigator([
                { key: 'sceneA' }
            ]);
            stateNavigator.navigate('sceneA');
            var {sceneA} = stateNavigator.states;
            var SceneA = () => <div id="sceneA" />;
            sceneA.renderScene = () => <SceneA />;
            var container = document.createElement('div');
            act(() => {
                ReactDOM.render(
                    <NavigationHandler stateNavigator={stateNavigator}>
                        <NavigationMotion>
                            {(_style, scene, key) =>  <div key={key}>{scene}</div>}
                        </NavigationMotion>
                    </NavigationHandler>,
                    container
                );
            });
            try {
                assert.equal(container.childNodes.length, 1);
                assert.notEqual(container.querySelector("#sceneA"), null);
            } finally {
                ReactDOM.unmountComponentAtNode(container);
            }
        })
    });
});
