import assert from 'assert';
import 'mocha';
import { StateNavigator } from 'navigation';
import { NavigationContext, NavigationHandler } from 'navigation-react';
import { NavigationMotion, NavigationStack, Scene } from 'navigation-react-mobile';
import React, {useContext, useState} from 'react';
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
            act(() => update(true));
            await act(async () => stateNavigator.navigate('sceneB'));
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

    describe('A to A -> B to A -> B -> C to A -> B to A', function () {
        var stateNavigator, root, container, updateA, updateB;
        var SceneA = () => {
            var [updated, setUpdated] = useState('0')
            updateA = setUpdated;
            return <div id="sceneA" data-updated={updated} />;
        };
        var SceneB = () => {
            var [updated, setUpdated] = useState('0')
            updateB = setUpdated;
            return <div id="sceneB" data-updated={updated} />;
        };
        var SceneC = () => <div id="sceneC" />;
        beforeEach(() => {
            updateA = null;
            updateB = null;
            stateNavigator = new StateNavigator([
                { key: 'sceneA' },
                { key: 'sceneB', trackCrumbTrail: true },
                { key: 'sceneC', trackCrumbTrail: true },
            ]);
            stateNavigator.navigate('sceneA');
            container = document.createElement('div');
            root = createRoot(container)
        });
        describe('Static', () => {
            it('should remember state', async function(){
                var {sceneA, sceneB, sceneC} = stateNavigator.states;
                sceneA.renderScene = () => <SceneA />;
                sceneB.renderScene = () => <SceneB />;
                sceneC.renderScene = () => <SceneC />;
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
                                <Scene stateKey="sceneC"><SceneC /></Scene>
                            </NavigationMotion>
                        </NavigationHandler>
                    );
                });
                await test();
            });
        });
        describe('Static Stack', () => {
            it('should remember state', async function(){
                var {sceneA, sceneB, sceneC} = stateNavigator.states;
                sceneA.renderScene = () => <SceneA />;
                sceneB.renderScene = () => <SceneB />;
                sceneC.renderScene = () => <SceneC />;
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
                                <Scene stateKey="sceneC"><SceneC /></Scene>
                            </NavigationStack>
                        </NavigationHandler>
                    );
                });
                await test();
            });
        });
        const test = async () => {
            act(() => updateA('1'));
            await act(async () => stateNavigator.navigate('sceneB'));
            act(() => updateB('2'));
            await act(async () => stateNavigator.navigate('sceneC'));
            await act(async () => stateNavigator.navigateBack(1));
            try {
                var scene = container.querySelector('#sceneB');
                assert.strictEqual(scene.dataset.updated, '2');
                await act(async () => stateNavigator.navigateBack(1));
                var scene = container.querySelector('#sceneA');
                assert.strictEqual(scene.dataset.updated, '1');
            } finally {
                act(() => root.unmount());
            }
        };
    });

    describe('A to A -> B to A -> B -> C to A', function () {
        var stateNavigator, root, container, update;
        var SceneA = () => {
            var [updated, setUpdated] = useState(false)
            update = setUpdated;
            return <div id="sceneA" data-updated={updated} />;
        };
        var SceneB = () => <div id="sceneB" />;
        var SceneC = () => <div id="sceneC" />;
        beforeEach(() => {
            update = null;
            stateNavigator = new StateNavigator([
                { key: 'sceneA' },
                { key: 'sceneB', trackCrumbTrail: true },
                { key: 'sceneC', trackCrumbTrail: true },
            ]);
            stateNavigator.navigate('sceneA');
            container = document.createElement('div');
            root = createRoot(container)
        });
        describe('Static', () => {
            it('should remember state', async function(){
                var {sceneA, sceneB, sceneC} = stateNavigator.states;
                sceneA.renderScene = () => <SceneA />;
                sceneB.renderScene = () => <SceneB />;
                sceneC.renderScene = () => <SceneC />;
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
                                <Scene stateKey="sceneC"><SceneC /></Scene>
                            </NavigationMotion>
                        </NavigationHandler>
                    );
                });
                await test();
            });
        });
        describe('Static Stack', () => {
            it('should remember state', async function(){
                var {sceneA, sceneB, sceneC} = stateNavigator.states;
                sceneA.renderScene = () => <SceneA />;
                sceneB.renderScene = () => <SceneB />;
                sceneC.renderScene = () => <SceneC />;
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
                                <Scene stateKey="sceneC"><SceneC /></Scene>
                            </NavigationStack>
                        </NavigationHandler>
                    );
                });
                await test();
            });
        });
        const test = async () => {
            act(() => update(true));
            await act(async () => stateNavigator.navigate('sceneB'));
            await act(async () => stateNavigator.navigate('sceneC'));
            await act(async () => stateNavigator.navigateBack(2));
            try {
                var scene = container.querySelector('#sceneA');
                assert.strictEqual(scene.dataset.updated, 'true');
            } finally {
                act(() => root.unmount());
            }
        };
    });

    describe('A to A* to A -> B to A*', function () {
        var stateNavigator, root, container, update;
        var SceneA = () => {
            var [updated, setUpdated] = useState(false);
            var {data: {x}} = useContext(NavigationContext);
            update = setUpdated;
            return <div id="sceneA" data-updated={updated + (x ?? '')} />;
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
            act(() => update(true));
            await act(async () => stateNavigator.navigate('sceneA', {x: '1'}));
            await act(async () => stateNavigator.navigate('sceneB'));
            await act(async () => stateNavigator.navigateBack(1));
            try {
                var scene = container.querySelector('#sceneA');
                assert.strictEqual(scene.dataset.updated, 'true1');
            } finally {
                act(() => root.unmount());
            }
        };
    });
});
