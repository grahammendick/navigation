import assert from 'assert';
import 'mocha';
import { StateNavigator } from 'navigation';
import { NavigationHandler } from 'navigation-react';
import { NavigationMotion, NavigationStack, Scene } from 'navigation-react-mobile';
import React, {useState} from 'react';
import { createRoot } from 'react-dom/client';
import { act } from 'react-dom/test-utils';
import { JSDOM } from 'jsdom';

declare var global: any;
global.IS_REACT_ACT_ENVIRONMENT = true;
var { window } = new JSDOM('<!doctype html><html><body></body></html>');
window.addEventListener = () => {};
global.window = window;
global.document = window.document;
var now = window.performance.now()
window.performance.now = () => now+=500;
window.requestAnimationFrame = callback => {
    callback(window.performance.now())
};
window.cancelAnimationFrame = () => {};
React.useLayoutEffect = React.useEffect;

describe('NavigationMotionKey', function () {
    describe('A to A -> B to A', function () {
        var stateNavigator, root, container, update;
        var SceneA = () => {
            var [updated, setUpdated] = useState(false)
            update = setUpdated;
            return <div id="sceneA" data-updated={updated} />;
        };
        var SceneB = () => <div id="sceneB" />;
        beforeEach(() => {
            update = null;
            stateNavigator = new StateNavigator([
                { key: 'sceneA' },
                { key: 'sceneB', trackCrumbTrail: true },
            ]);
            stateNavigator.navigate('sceneA');
            container = document.createElement('div');
            root = createRoot(container)
        });
        describe('Static', () => {
            it('should remember state', async function(){
                var {sceneA, sceneB} = stateNavigator.states;
                sceneA.renderScene = () => <SceneA />;
                sceneB.renderScene = () => <SceneB />;
                act(() => {
                    root.render(
                        <NavigationHandler stateNavigator={stateNavigator}>
                            <NavigationMotion>
                                {(_style, scene, key) =>  (
                                    <div className="scene" id={key} key={key}>{scene}</div>
                                )}
                            </NavigationMotion>
                        </NavigationHandler>
                    );
                });
                await test();
            });
        });
        describe('Dynamic', () => {
            it('should remember state', async function(){
                act(() => {
                    root.render(
                        <NavigationHandler stateNavigator={stateNavigator}>
                            <NavigationMotion
                                renderMotion={(_style, scene, key) =>  (
                                    <div className="scene" id={key} key={key}>{scene}</div>
                                )}>
                                <Scene stateKey="sceneA"><SceneA /></Scene>
                                <Scene stateKey="sceneB"><SceneB /></Scene>
                            </NavigationMotion>
                        </NavigationHandler>
                    );
                });
                await test();
            });
        });
        describe('Static Stack', () => {
            it('should remember state', async function(){
                var {sceneA, sceneB} = stateNavigator.states;
                sceneA.renderScene = () => <SceneA />;
                sceneB.renderScene = () => <SceneB />;
                act(() => {
                    root.render(
                        <NavigationHandler stateNavigator={stateNavigator}>
                            <NavigationStack className="scene" />
                        </NavigationHandler>
                    );
                });
                await test();
            });
        });
        describe('Dynamic Stack', () => {
            it('should remember state', async function(){
                act(() => {
                    root.render(
                        <NavigationHandler stateNavigator={stateNavigator}>
                            <NavigationStack className="scene">
                                <Scene stateKey="sceneA"><SceneA /></Scene>
                                <Scene stateKey="sceneB"><SceneB /></Scene>
                            </NavigationStack>
                        </NavigationHandler>
                    );
                });
                await test();
            });
        });
        const test = async () => {
            act(() => {
                update(true);
            });
            await act(async () => stateNavigator.navigate('sceneB'));
            await act(async () => stateNavigator.navigateBack(1));
            try {
                var scene = container.querySelector('#sceneA');
                assert.strictEqual(scene.dataset.updated, 'true');
            } finally {
                act(() => root.unmount());
            }
        };
    });
});
