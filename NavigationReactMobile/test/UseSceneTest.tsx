import * as assert from 'assert';
import * as mocha from 'mocha';
import { StateNavigator } from 'navigation';
import { NavigationHandler } from 'navigation-react';
import { NavigationMotion } from 'navigation-react-mobile';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
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
            sceneA.renderScene = () => <span>Hello</span>;
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
                var span = container.querySelector<HTMLSpanElement>('span');
                assert.equal(span.textContent, 'Hello');
            } finally {
                ReactDOM.unmountComponentAtNode(container);
            }
        })
    });
});
