import assert from 'assert';
import 'mocha';
import { StateNavigator } from 'navigation';
import { NavigationHandler } from 'navigation-react';
import { NavigationMotion, NavigationStack, Scene } from 'navigation-react-mobile';
import React, {useState} from 'react';
import { createRoot } from 'react-dom/client';
import ReactDOMServer from 'react-dom/server';
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

describe('NavigationMotion', function () {
    describe('Blank state context', function () {
        var stateNavigator, root, container;
        beforeEach(() => {
            stateNavigator = new StateNavigator([
                { key: 'sceneA' }
            ]);
            container = document.createElement('div');
            root = createRoot(container)
        });
        describe('Static', () => {
            it('should render', function(){
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
                test();
            });
        });
        describe('Dynamic', () => {
            it('should render', function(){
                act(() => {
                    root.render(
                        <NavigationHandler stateNavigator={stateNavigator}>
                            <NavigationMotion
                                renderMotion={(_style, scene, key) =>  (
                                    <div className="scene" id={key} key={key}>{scene}</div>
                                )}>
                            </NavigationMotion>
                        </NavigationHandler>
                    );
                });
                test();
            });
        });
        describe('Static Stack', () => {
            it('should render', function(){
                act(() => {
                    root.render(
                        <NavigationHandler stateNavigator={stateNavigator}>
                            <NavigationStack className="scene" />
                        </NavigationHandler>
                    );
                });
                test();
            });
        });
        const test = () => {
            try {
                var scenes = container.querySelectorAll(".scene");
                assert.equal(scenes.length, 0);
            } finally {
                act(() => root.unmount());
            }
        };
    });

    describe('Blank state context then A', function () {
        var stateNavigator, root, container;
        var SceneA = () => <div id="sceneA" />;
        beforeEach(() => {
            stateNavigator = new StateNavigator([
                { key: 'sceneA' }
            ]);
            container = document.createElement('div');
            root = createRoot(container)
        });
        describe('Static', () => {
            it('should render', function(){
                var {sceneA} = stateNavigator.states;
                sceneA.renderScene = () => <SceneA />;
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
                test();
            });
        });
        describe('Dynamic', () => {
            it('should render', function(){
                act(() => {
                    root.render(
                        <NavigationHandler stateNavigator={stateNavigator}>
                            <NavigationMotion
                                renderMotion={(_style, scene, key) =>  (
                                    <div className="scene" id={key} key={key}>{scene}</div>
                                )}>
                                <Scene stateKey="sceneA"><SceneA /></Scene>
                            </NavigationMotion>
                        </NavigationHandler>
                    );
                });
                test();
            });
        });
        describe('Static Stack', () => {
            it('should render', function(){
                var {sceneA} = stateNavigator.states;
                sceneA.renderScene = () => <SceneA />;
                act(() => {
                    root.render(
                        <NavigationHandler stateNavigator={stateNavigator}>
                            <NavigationStack className="scene" />
                        </NavigationHandler>
                    );
                });
                test();
            });
        });
        describe('Dynamic Stack', () => {
            it('should render', function(){
                act(() => {
                    root.render(
                        <NavigationHandler stateNavigator={stateNavigator}>
                            <NavigationStack className="scene">
                                <Scene stateKey="sceneA"><SceneA /></Scene>
                            </NavigationStack>
                        </NavigationHandler>
                    );
                });
                test();
            });
        });
        const test = () => {
            act(() => stateNavigator.navigate('sceneA'));
            try {
                var scenes = container.querySelectorAll(".scene");
                assert.equal(scenes.length, 1);
                assert.notEqual(scenes[0].querySelector("#sceneA"), null);
            } finally {
                act(() => root.unmount());
            }
        };
    });

    describe('A', function () {
        var stateNavigator, root, container;
        var SceneA = () => <div id="sceneA" />;
        beforeEach(() => {
            stateNavigator = new StateNavigator([
                { key: 'sceneA' }
            ]);
            stateNavigator.navigate('sceneA');
            container = document.createElement('div');
            root = createRoot(container)
        });
        describe('Static', () => {
            it('should render A', function(){
                var {sceneA} = stateNavigator.states;
                sceneA.renderScene = () => <SceneA />;
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
                test();
            });
        });
        describe('Dynamic', () => {
            it('should render A', function(){
                act(() => {
                    root.render(
                        <NavigationHandler stateNavigator={stateNavigator}>
                            <NavigationMotion
                                renderMotion={(_style, scene, key) =>  (
                                    <div className="scene" id={key} key={key}>{scene}</div>
                                )}>
                                <Scene stateKey="sceneA"><SceneA /></Scene>
                            </NavigationMotion>
                        </NavigationHandler>
                    );
                });
                test();
            });
        });
        describe('Static Stack', () => {
            it('should render A', function(){
                var {sceneA} = stateNavigator.states;
                sceneA.renderScene = () => <SceneA />;
                act(() => {
                    root.render(
                        <NavigationHandler stateNavigator={stateNavigator}>
                            <NavigationStack className="scene" />
                        </NavigationHandler>
                    );
                });
                test();
            });
        });
        describe('Dynamic Stack', () => {
            it('should render A', function(){
                act(() => {
                    root.render(
                        <NavigationHandler stateNavigator={stateNavigator}>
                            <NavigationStack className="scene">
                                <Scene stateKey="sceneA"><SceneA /></Scene>
                            </NavigationStack>
                        </NavigationHandler>
                    );
                });
                test();
            });
        });
        const test = () => {
            try {
                var scenes = container.querySelectorAll(".scene");
                assert.equal(scenes.length, 1);
                assert.notEqual(scenes[0].querySelector("#sceneA"), null);
            } finally {
                act(() => root.unmount());
            }
        };
    });

    describe('A -> B', function () {
        var stateNavigator, root, container;
        var SceneA = () => <div id="sceneA" />;
        var SceneB = () => <div id="sceneB" />;
        beforeEach(() => {
            stateNavigator = new StateNavigator([
                { key: 'sceneA' },
                { key: 'sceneB', trackCrumbTrail: true },
            ]);
            stateNavigator.navigate('sceneA');
            stateNavigator.navigate('sceneB');
            container = document.createElement('div');
            root = createRoot(container)
        });
        describe('Static', () => {
            it('should render _ -> B', function(){
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
                test();
            });
        });
        describe('Dynamic', () => {
            it('should render _ -> B', function(){
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
                test();
            });
        });
        describe('Static Stack', () => {
            it('should render _ -> B', function(){
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
                test();
            });
        });
        describe('Dynamic Stack', () => {
            it('should render _ -> B', function(){
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
                test();
            });
        });
        const test = () => {
            try {
                var scenes = container.querySelectorAll(".scene");
                assert.equal(scenes.length, 2);
                assert.equal(container.querySelector("#sceneA"), null);
                assert.notEqual(scenes[1].querySelector("#sceneB"), null);
            } finally {
                act(() => root.unmount());
            }
        };
    });

    describe('A to A -> B', function () {
        var stateNavigator, root, container;
        var SceneA = () => <div id="sceneA" />;
        var SceneB = () => <div id="sceneB" />;
        beforeEach(() => {
            stateNavigator = new StateNavigator([
                { key: 'sceneA' },
                { key: 'sceneB', trackCrumbTrail: true },
            ]);
            stateNavigator.navigate('sceneA');
            container = document.createElement('div');
            root = createRoot(container)
        });
        describe('Static', () => {
            it('should render A -> B', async function(){
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
            it('should render A -> B', async function(){
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
            it('should render A -> B', async function(){
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
            it('should render A -> B', async function(){
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
            await act(async () => stateNavigator.navigate('sceneB'));
            try {
                var scenes = container.querySelectorAll(".scene");
                assert.equal(scenes.length, 2);
                assert.notEqual(scenes[0].querySelector("#sceneA"), null);
                assert.notEqual(scenes[1].querySelector("#sceneB"), null);
            } finally {
                act(() => root.unmount());
            }
        };
    });

    describe('A -> B to A', function () {
        var stateNavigator, root, container;
        var SceneA = () => <div id="sceneA" />;
        var SceneB = () => <div id="sceneB" />;
        beforeEach(() => {
            stateNavigator = new StateNavigator([
                { key: 'sceneA' },
                { key: 'sceneB', trackCrumbTrail: true },
            ]);
            stateNavigator.navigate('sceneA');
            stateNavigator.navigate('sceneB');
            container = document.createElement('div');
            root = createRoot(container)
        });
        describe('Static', () => {
            it('should render A', async function(){
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
            it('should render A', async function(){
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
        const test = async () => {
            await act(async () => stateNavigator.navigateBack(1));
            try {
                var scenes = container.querySelectorAll(".scene");
                assert.equal(scenes.length, 1);
                assert.notEqual(scenes[0].querySelector("#sceneA"), null);
                assert.equal(container.querySelector("#sceneB"), null);
            } finally {
                act(() => root.unmount());
            }
        }
    });

    describe('A -> B to A', function () {
        var stateNavigator, root, container;
        var SceneA = () => <div id="sceneA" />;
        var SceneB = () => <div id="sceneB" />;
        beforeEach(() => {
            stateNavigator = new StateNavigator([
                { key: 'sceneA' },
                { key: 'sceneB', trackCrumbTrail: true },
            ]);
            stateNavigator.navigate('sceneA');
            stateNavigator.navigate('sceneB');
            container = document.createElement('div');
            root = createRoot(container)
        });
        describe('Static Stack', () => {
            it('should render A', async function(){
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
            it('should render A', async function(){
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
            await act(async () => stateNavigator.navigateBack(1));
            try {
                var scenes = container.querySelectorAll(".scene");
                assert.equal(scenes.length, 2);
                assert.notEqual(scenes[0].querySelector("#sceneA"), null);
                assert.notEqual(scenes[0].style.display, 'none');
                assert.notEqual(scenes[1].querySelector("#sceneB"), null);
                assert.equal(scenes[1].style.display, 'none');
            } finally {
                act(() => root.unmount());
            }
        }
    });

    describe('A to A -> B to A', function () {
        var stateNavigator, root, container;
        var SceneA = () => <div id="sceneA" />;
        var SceneB = () => <div id="sceneB" />;
        beforeEach(() => {
            stateNavigator = new StateNavigator([
                { key: 'sceneA' },
                { key: 'sceneB', trackCrumbTrail: true },
            ]);
            stateNavigator.navigate('sceneA');
            container = document.createElement('div');
            root = createRoot(container)
        });
        describe('Static', () => {
            it('should render A', async function(){
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
            it('should render A', async function(){
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
        const test = async () => {
            await act(async () => {
                stateNavigator.navigate('sceneB');
            });
            await act(async () => {
                stateNavigator.navigateBack(1);
            });
            try {
                var scenes = container.querySelectorAll(".scene");
                assert.equal(scenes.length, 1);
                assert.notEqual(scenes[0].querySelector("#sceneA"), null);
                assert.equal(container.querySelector("#sceneB"), null);
            } finally {
                act(() => root.unmount());
            }
        };
    });

    describe('A to A -> B to A', function () {
        var stateNavigator, root, container;
        var SceneA = () => <div id="sceneA" />;
        var SceneB = () => <div id="sceneB" />;
        beforeEach(() => {
            stateNavigator = new StateNavigator([
                { key: 'sceneA' },
                { key: 'sceneB', trackCrumbTrail: true },
            ]);
            stateNavigator.navigate('sceneA');
            container = document.createElement('div');
            root = createRoot(container)
        });
        describe('Static Stack', () => {
            it('should render A', async function(){
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
            it('should render A', async function(){
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
            await act(async () => {
                stateNavigator.navigate('sceneB');
            });
            await act(async () => {
                stateNavigator.navigateBack(1);
            });
            try {
                var scenes = container.querySelectorAll(".scene");
                assert.equal(scenes.length, 2);
                assert.notEqual(scenes[0].querySelector("#sceneA"), null);
                assert.notEqual(scenes[0].style.display, 'none');
                assert.notEqual(scenes[1].querySelector("#sceneB"), null);
                assert.equal(scenes[1].style.display, 'none');
            } finally {
                act(() => root.unmount());
            }
        };
    });

    describe('A to A', function () {
        var stateNavigator, root, container;
        var SceneA = () => <div id="sceneA" />;
        beforeEach(() => {
            stateNavigator = new StateNavigator([
                { key: 'sceneA' }
            ]);
            stateNavigator.navigate('sceneA');
            container = document.createElement('div');
            root = createRoot(container)
        });
        describe('Static', () => {
            it('should render A', function(){
                var {sceneA} = stateNavigator.states;
                sceneA.renderScene = () => <SceneA />;
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
                test();
            });
        });
        describe('Dynamic', () => {
            it('should render A', function(){
                act(() => {
                    root.render(
                        <NavigationHandler stateNavigator={stateNavigator}>
                            <NavigationMotion
                                renderMotion={(_style, scene, key) =>  (
                                    <div className="scene" id={key} key={key}>{scene}</div>
                                )}>
                                <Scene stateKey="sceneA"><SceneA /></Scene>
                            </NavigationMotion>
                        </NavigationHandler>
                    );
                });
                test();
            });
        });
        describe('Static Stack', () => {
            it('should render A', function(){
                var {sceneA} = stateNavigator.states;
                sceneA.renderScene = () => <SceneA />;
                act(() => {
                    root.render(
                        <NavigationHandler stateNavigator={stateNavigator}>
                            <NavigationStack className="scene" />
                        </NavigationHandler>
                    );
                });
                test();
            });
        });
        describe('Dynamic Stack', () => {
            it('should render A', function(){
                act(() => {
                    root.render(
                        <NavigationHandler stateNavigator={stateNavigator}>
                            <NavigationStack className="scene">
                                <Scene stateKey="sceneA"><SceneA /></Scene>
                            </NavigationStack>
                        </NavigationHandler>
                    );
                });
                test();
            });
        });
        const test = () => {
            act(() => stateNavigator.navigate('sceneA'));
            try {
                var scenes = container.querySelectorAll(".scene");
                assert.equal(scenes.length, 1);
                assert.notEqual(scenes[0].querySelector("#sceneA"), null);
            } finally {
                act(() => root.unmount());
            }
        };
    });

    describe('A to B', function () {
        var stateNavigator, root, container;
        var SceneA = () => <div id="sceneA" />;
        var SceneB = () => <div id="sceneB" />;
        beforeEach(() => {
            stateNavigator = new StateNavigator([
                { key: 'sceneA' },
                { key: 'sceneB' },
            ]);
            stateNavigator.navigate('sceneA');
            container = document.createElement('div');
            root = createRoot(container)
        });
        describe('Static', () => {
            it('should render B+', function(){
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
                test();
            });
        });
        describe('Dynamic', () => {
            it('should render B+', function(){
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
                test();
            });
        });
        const test = () => {
            act(() => stateNavigator.navigate('sceneB'));
            try {
                var scenes = container.querySelectorAll(".scene");
                assert.equal(scenes.length, 1);
                assert.notEqual(scenes[0].querySelector("#sceneB"), null);
                assert.equal(container.querySelector("#sceneA"), null);
            } finally {
                act(() => root.unmount());
            }
        };
    });

    describe('A to B', function () {
        var stateNavigator, root, container;
        var SceneA = () => <div id="sceneA" />;
        var SceneB = () => <div id="sceneB" />;
        beforeEach(() => {
            stateNavigator = new StateNavigator([
                { key: 'sceneA' },
                { key: 'sceneB' },
            ]);
            stateNavigator.navigate('sceneA');
            container = document.createElement('div');
            root = createRoot(container)
        });
        describe('Static Stack', () => {
            it('should render B+', function(){
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
                test();
            });
        });
        describe('Dynamic Stack', () => {
            it('should render B+', function(){
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
                test();
            });
        });
        const test = () => {
            act(() => stateNavigator.navigate('sceneB'));
            try {
                var scenes = container.querySelectorAll(".scene");
                assert.equal(scenes.length, 2);
                assert.notEqual(scenes[0].querySelector("#sceneA"), null);
                assert.equal(scenes[0].style.display, 'none');
                assert.notEqual(scenes[1].querySelector("#sceneB"), null);
                assert.notEqual(scenes[1].style.display, 'none');
            } finally {
                act(() => root.unmount());
            }
        };
    });

    describe('A to B to C', function () {
        var stateNavigator, root, container;
        var SceneA = () => <div id="sceneA" />;
        var SceneB = () => <div id="sceneB" />;
        var SceneC = () => <div id="sceneC" />;
        beforeEach(() => {
            stateNavigator = new StateNavigator([
                { key: 'sceneA' },
                { key: 'sceneB' },
                { key: 'sceneC' },
            ]);
            stateNavigator.navigate('sceneA');
            container = document.createElement('div');
            root = createRoot(container)
        });
        describe('Static', () => {
            it('should render C++', function(){
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
                test();
            });
        });
        describe('Dynamic', () => {
            it('should render C++', function(){
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
                test();
            });
        });
        const test = () => {
            act(() => stateNavigator.navigate('sceneB'));
            act(() => stateNavigator.navigate('sceneC'));
            try {
                var scenes = container.querySelectorAll(".scene");
                assert.equal(scenes.length, 1);
                assert.notEqual(scenes[0].querySelector("#sceneC"), null);
                assert.equal(container.querySelector("#sceneA"), null);
                assert.equal(container.querySelector("#sceneB"), null);
            } finally {
                act(() => root.unmount());
            }
        };
    });

    describe('A to B to C', function () {
        var stateNavigator, root, container;
        var SceneA = () => <div id="sceneA" />;
        var SceneB = () => <div id="sceneB" />;
        var SceneC = () => <div id="sceneC" />;
        beforeEach(() => {
            stateNavigator = new StateNavigator([
                { key: 'sceneA' },
                { key: 'sceneB' },
                { key: 'sceneC' },
            ]);
            stateNavigator.navigate('sceneA');
            container = document.createElement('div');
            root = createRoot(container)
        });
        describe('Static Stack', () => {
            it('should render C++', function(){
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
                test();
            });
        });
        describe('Dynamic Stack', () => {
            it('should render C++', function(){
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
                test();
            });
        });
        const test = () => {
            act(() => stateNavigator.navigate('sceneB'));
            act(() => stateNavigator.navigate('sceneC'));
            try {
                var scenes = container.querySelectorAll(".scene");
                assert.equal(scenes.length, 3);
                assert.notEqual(scenes[0].querySelector("#sceneA"), null);
                assert.equal(scenes[0].style.display, 'none');
                assert.notEqual(scenes[1].querySelector("#sceneB"), null);
                assert.equal(scenes[1].style.display, 'none');
                assert.notEqual(scenes[2].querySelector("#sceneC"), null);
                assert.notEqual(scenes[2].style.display, 'none');
            } finally {
                act(() => root.unmount());
            }
        };
    });

    describe('A -> B to C -> B', function () {
        var stateNavigator, root, container;
        var SceneA = () => <div id="sceneA" />;
        var SceneB = () => <div id="sceneB" />;
        var SceneC = () => <div id="sceneC" />;
        beforeEach(() => {
            stateNavigator = new StateNavigator([
                { key: 'sceneA' },
                { key: 'sceneB', trackCrumbTrail: true },
                { key: 'sceneC' },
            ]);
            stateNavigator.navigate('sceneA');
            stateNavigator.navigate('sceneB');
            container = document.createElement('div');
            root = createRoot(container)
        });
        describe('Static', () => {
            it('should render _ -> B', async function(){
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
            it('should render _ -> B', async function(){
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
            it('should render _ -> B', async function(){
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
            it('should render _ -> B', async function(){
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
            await act(async () => {
                var url = stateNavigator.fluent()
                    .navigate('sceneC')
                    .navigate('sceneB').url;
                stateNavigator.navigateLink(url);
            });
            try {
                var scenes = container.querySelectorAll(".scene");
                assert.equal(scenes.length, 2);
                assert.notEqual(scenes[1].querySelector("#sceneB"), null);
                assert.equal(container.querySelector("#sceneA"), null);
                assert.equal(container.querySelector("#sceneC"), null);
            } finally {
                act(() => root.unmount());
            }
        }
    });

    describe('A -> B to C -> B to C', function () {
        var stateNavigator, root, container;
        var SceneA = () => <div id="sceneA" />;
        var SceneB = () => <div id="sceneB" />;
        var SceneC = () => <div id="sceneC" />;
        beforeEach(() => {
            stateNavigator = new StateNavigator([
                { key: 'sceneA' },
                { key: 'sceneB', trackCrumbTrail: true },
                { key: 'sceneC' },
            ]);
            stateNavigator.navigate('sceneA');
            stateNavigator.navigate('sceneB');
            container = document.createElement('div');
            root = createRoot(container)
        });
        describe('Static', () => {
            it('should render C', async function(){
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
            it('should render C', async function(){
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
        const test = async () => {
            await act(async () => {
                var url = stateNavigator.fluent()
                    .navigate('sceneC')
                    .navigate('sceneB').url;
                stateNavigator.navigateLink(url);
                stateNavigator.navigateBack(1)
            });
            try {
                var scenes = container.querySelectorAll(".scene");
                assert.equal(scenes.length, 1);
                assert.notEqual(scenes[0].querySelector("#sceneC"), null);
                assert.equal(container.querySelector("#sceneA"), null);
                assert.equal(container.querySelector("#sceneB"), null);
            } finally {
                act(() => root.unmount());
            }
        }
    });

    describe('A -> B to C -> B to C', function () {
        var stateNavigator, root, container;
        var SceneA = () => <div id="sceneA" />;
        var SceneB = () => <div id="sceneB" />;
        var SceneC = () => <div id="sceneC" />;
        beforeEach(() => {
            stateNavigator = new StateNavigator([
                { key: 'sceneA' },
                { key: 'sceneB', trackCrumbTrail: true },
                { key: 'sceneC' },
            ]);
            stateNavigator.navigate('sceneA');
            stateNavigator.navigate('sceneB');
            container = document.createElement('div');
            root = createRoot(container)
        });
        describe('Static Stack', () => {
            it('should render C', async function(){
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
            it('should render C', async function(){
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
            await act(async () => {
                var url = stateNavigator.fluent()
                    .navigate('sceneC')
                    .navigate('sceneB').url;
                stateNavigator.navigateLink(url);
                stateNavigator.navigateBack(1)
            });
            try {
                var scenes = container.querySelectorAll(".scene");
                assert.equal(scenes.length, 2);
                assert.notEqual(scenes[0].querySelector("#sceneC"), null);
                assert.notEqual(scenes[0].style.display, 'none');
                assert.notEqual(scenes[1].querySelector("#sceneB"), null);
                assert.equal(scenes[1].style.display, 'none');
                assert.equal(container.querySelector("#sceneA"), null);
            } finally {
                act(() => root.unmount());
            }
        }
    });

    describe('A to A -> B to C -> B', function () {
        var stateNavigator, root, container;
        var SceneA = () => <div id="sceneA" />;
        var SceneB = () => <div id="sceneB" />;
        var SceneC = () => <div id="sceneC" />;
        beforeEach(() => {
            stateNavigator = new StateNavigator([
                { key: 'sceneA' },
                { key: 'sceneB', trackCrumbTrail: true },
                { key: 'sceneC' },
            ]);
            stateNavigator.navigate('sceneA');
            container = document.createElement('div');
            root = createRoot(container)
        });
        describe('Static', () => {
            it('should render A -> B', async function(){
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
            it('should render A -> B', async function(){
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
            it('should render A -> B', async function(){
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
            it('should render A -> B', async function(){
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
            await act(async () => {
                stateNavigator.navigate('sceneB');
                var url = stateNavigator.fluent()
                    .navigate('sceneC')
                    .navigate('sceneB').url;
                stateNavigator.navigateLink(url);
            });
            try {
                var scenes = container.querySelectorAll(".scene");
                assert.equal(scenes.length, 2);
                assert.notEqual(scenes[0].querySelector("#sceneA"), null);
                assert.notEqual(scenes[1].querySelector("#sceneB"), null);
                assert.equal(container.querySelector("#sceneC"), null);
            } finally {
                act(() => root.unmount());
            }
        };
    });

    describe('A to A -> B to C -> B to C', function () {
        var stateNavigator, root, container;
        var SceneA = () => <div id="sceneA" />;
        var SceneB = () => <div id="sceneB" />;
        var SceneC = () => <div id="sceneC" />;
        beforeEach(() => {
            stateNavigator = new StateNavigator([
                { key: 'sceneA' },
                { key: 'sceneB', trackCrumbTrail: true },
                { key: 'sceneC' },
            ]);
            stateNavigator.navigate('sceneA');
            container = document.createElement('div');
            root = createRoot(container)
        });
        describe('Static', () => {
            it('should render C', async function(){
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
            it('should render C', async function(){
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
        const test = async () => {
            act(() => stateNavigator.navigate('sceneB'));
            act(() => {
                var url = stateNavigator.fluent()
                    .navigate('sceneC')
                    .navigate('sceneB').url;
                stateNavigator.navigateLink(url);
            });
            await act(async () => stateNavigator.navigateBack(1));
            try {
                var scenes = container.querySelectorAll(".scene");
                assert.equal(scenes.length, 1);
                assert.notEqual(scenes[0].querySelector("#sceneC"), null);
                assert.equal(container.querySelector("#sceneA"), null);
                assert.equal(container.querySelector("#sceneB"), null);
            } finally {
                act(() => root.unmount());
            }
        }
    });

    describe('A to A -> B to C -> B to C', function () {
        var stateNavigator, root, container;
        var SceneA = () => <div id="sceneA" />;
        var SceneB = () => <div id="sceneB" />;
        var SceneC = () => <div id="sceneC" />;
        beforeEach(() => {
            stateNavigator = new StateNavigator([
                { key: 'sceneA' },
                { key: 'sceneB', trackCrumbTrail: true },
                { key: 'sceneC' },
            ]);
            stateNavigator.navigate('sceneA');
            container = document.createElement('div');
            root = createRoot(container)
        });
        describe('Static Stack', () => {
            it('should render C', async function(){
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
            it('should render C', async function(){
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
            act(() => stateNavigator.navigate('sceneB'));
            act(() => {
                var url = stateNavigator.fluent()
                    .navigate('sceneC')
                    .navigate('sceneB').url;
                stateNavigator.navigateLink(url);
            });
            await act(async () => stateNavigator.navigateBack(1));
            try {
                var scenes = container.querySelectorAll(".scene");
                assert.equal(scenes.length, 2);
                assert.notEqual(scenes[0].querySelector("#sceneC"), null);
                assert.notEqual(scenes[0].style.display, 'none');
                assert.notEqual(scenes[1].querySelector("#sceneB"), null);
                assert.equal(scenes[1].style.display, 'none');
                assert.equal(container.querySelector("#sceneA"), null);
            } finally {
                act(() => root.unmount());
            }
        }
    });

    describe('A to A -> B to C -> D', function () {
        var stateNavigator, root, container;
        var SceneA = () => <div id="sceneA" />;
        var SceneB = () => <div id="sceneB" />;
        var SceneC = () => <div id="sceneC" />;
        var SceneD = () => <div id="sceneD" />;
        beforeEach(() => {
            stateNavigator = new StateNavigator([
                { key: 'sceneA' },
                { key: 'sceneB', trackCrumbTrail: true },
                { key: 'sceneC' },
                { key: 'sceneD', trackCrumbTrail: true },
            ]);
            stateNavigator.navigate('sceneA');
            container = document.createElement('div');
            root = createRoot(container)
        });
        describe('Static', () => {
            it('should render A -> D+', async function(){
                var {sceneA, sceneB, sceneC, sceneD} = stateNavigator.states;
                sceneA.renderScene = () => <SceneA />;
                sceneB.renderScene = () => <SceneB />;
                sceneC.renderScene = () => <SceneC />;
                sceneD.renderScene = () => <SceneD />;
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
            it('should render A -> D+', async function(){
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
                                <Scene stateKey="sceneD"><SceneD /></Scene>
                            </NavigationMotion>
                        </NavigationHandler>
                    );
                });
                await test();
            });
        });
        const test = async () => {
            act(() => stateNavigator.navigate('sceneB'));
            await act(async () => {
                var url = stateNavigator.fluent()
                    .navigate('sceneC')
                    .navigate('sceneD').url;
                stateNavigator.navigateLink(url);
            });
            try {
                var scenes = container.querySelectorAll(".scene");
                assert.equal(scenes.length, 2);
                assert.notEqual(scenes[0].querySelector("#sceneA"), null);
                assert.notEqual(scenes[1].querySelector("#sceneD"), null);
                assert.equal(container.querySelector("#sceneB"), null);
                assert.equal(container.querySelector("#sceneC"), null);
            } finally {
                act(() => root.unmount());
            }
        }
    });

    describe('A to A -> B to C -> D', function () {
        var stateNavigator, root, container;
        var SceneA = () => <div id="sceneA" />;
        var SceneB = () => <div id="sceneB" />;
        var SceneC = () => <div id="sceneC" />;
        var SceneD = () => <div id="sceneD" />;
        beforeEach(() => {
            stateNavigator = new StateNavigator([
                { key: 'sceneA' },
                { key: 'sceneB', trackCrumbTrail: true },
                { key: 'sceneC' },
                { key: 'sceneD', trackCrumbTrail: true },
            ]);
            stateNavigator.navigate('sceneA');
            container = document.createElement('div');
            root = createRoot(container)
        });
        describe('Static Stack', () => {
            it('should render A -> D+', async function(){
                var {sceneA, sceneB, sceneC, sceneD} = stateNavigator.states;
                sceneA.renderScene = () => <SceneA />;
                sceneB.renderScene = () => <SceneB />;
                sceneC.renderScene = () => <SceneC />;
                sceneD.renderScene = () => <SceneD />;
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
            it('should render A -> D+', async function(){
                act(() => {
                    root.render(
                        <NavigationHandler stateNavigator={stateNavigator}>
                            <NavigationStack className="scene">
                                <Scene stateKey="sceneA"><SceneA /></Scene>
                                <Scene stateKey="sceneB"><SceneB /></Scene>
                                <Scene stateKey="sceneC"><SceneC /></Scene>
                                <Scene stateKey="sceneD"><SceneD /></Scene>
                            </NavigationStack>
                        </NavigationHandler>
                    );
                });
                await test();
            });
        });
        const test = async () => {
            act(() => stateNavigator.navigate('sceneB'));
            await act(async () => {
                var url = stateNavigator.fluent()
                    .navigate('sceneC')
                    .navigate('sceneD').url;
                stateNavigator.navigateLink(url);
            });
            try {
                var scenes = container.querySelectorAll(".scene");
                assert.equal(scenes.length, 3);
                assert.notEqual(scenes[0].querySelector("#sceneA"), null);
                assert.equal(scenes[0].style.display, 'none');
                assert.notEqual(scenes[1].querySelector("#sceneB"), null);
                assert.equal(scenes[1].style.display, 'none');
                assert.notEqual(scenes[2].querySelector("#sceneD"), null);
                assert.notEqual(scenes[2].style.display, 'none');
                assert.equal(container.querySelector("#sceneC"), null);
            } finally {
                act(() => root.unmount());
            }
        }
    });

    describe('A to A -> B -> C', function () {
        var stateNavigator, root, container;
        var SceneA = () => <div id="sceneA" />;
        var SceneB = () => <div id="sceneB" />;
        var SceneC = () => <div id="sceneC" />;
        beforeEach(() => {
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
            it('should render A -> _ -> C', function(){
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
                })
                test();
            });
        });
        describe('Dynamic', () => {
            it('should render A -> _ -> C', function(){
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
                })
                test();
            });
        });
        describe('Static Stack', () => {
            it('should render A -> _ -> C', function(){
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
                })
                test();
            });
        });
        describe('Dynamic Stack', () => {
            it('should render A -> _ -> C', function(){
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
                })
                test();
            });
        });
        const test = () => {
            act(() => {
                var url = stateNavigator.fluent(true)
                    .navigate('sceneB')
                    .navigate('sceneC').url;
                stateNavigator.navigateLink(url);
            });
            try {
                var scenes = container.querySelectorAll(".scene");
                assert.equal(scenes.length, 3);
                assert.notEqual(scenes[0].querySelector("#sceneA"), null);
                assert.notEqual(scenes[2].querySelector("#sceneC"), null);
                assert.equal(container.querySelector("#sceneB"), null);
            } finally {
                act(() => root.unmount());
            }
        }
    });

    describe('A to A -> B -> C to A -> B', function () {
        var stateNavigator, root, container;
        var SceneA = () => <div id="sceneA" />;
        var SceneB = () => <div id="sceneB" />;
        var SceneC = () => <div id="sceneC" />;
        beforeEach(() => {
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
            it('should render A -> B', async function(){
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
            it('should render A -> B', async function(){
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
        const test = async () => {
            await act(async () => {
                var url = stateNavigator.fluent(true)
                    .navigate('sceneB')
                    .navigate('sceneC').url;
                stateNavigator.navigateLink(url);
            });
            await act(async () => {
                stateNavigator.navigateBack(1);
            });
            try {
                var scenes = container.querySelectorAll(".scene");
                assert.equal(scenes.length, 2);
                assert.notEqual(scenes[0].querySelector("#sceneA"), null);
                assert.notEqual(scenes[1].querySelector("#sceneB"), null);
                assert.equal(container.querySelector("#sceneC"), null);
            } finally {
                act(() => root.unmount());
            }
        };
    });

    describe('A to A -> B -> C to A -> B', function () {
        var stateNavigator, root, container;
        var SceneA = () => <div id="sceneA" />;
        var SceneB = () => <div id="sceneB" />;
        var SceneC = () => <div id="sceneC" />;
        beforeEach(() => {
            stateNavigator = new StateNavigator([
                { key: 'sceneA' },
                { key: 'sceneB', trackCrumbTrail: true },
                { key: 'sceneC', trackCrumbTrail: true },
            ]);
            stateNavigator.navigate('sceneA');
            container = document.createElement('div');
            root = createRoot(container)
        });
        describe('Static Stack', () => {
            it('should render A -> B', async function(){
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
            it('should render A -> B', async function(){
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
            await act(async () => {
                var url = stateNavigator.fluent(true)
                    .navigate('sceneB')
                    .navigate('sceneC').url;
                stateNavigator.navigateLink(url);
            });
            await act(async () => {
                stateNavigator.navigateBack(1);
            });
            try {
                var scenes = container.querySelectorAll(".scene");
                assert.equal(scenes.length, 3);
                assert.notEqual(scenes[0].querySelector("#sceneA"), null);
                assert.equal(scenes[0].style.display, 'none');
                assert.notEqual(scenes[1].querySelector("#sceneB"), null);
                assert.notEqual(scenes[1].style.display, 'none');
                assert.notEqual(scenes[2].querySelector("#sceneC"), null);
                assert.equal(scenes[2].style.display, 'none');
            } finally {
                act(() => root.unmount());
            }
        };
    });

    describe('A to A -> B -> C to A -> D -> C', function () {
        var stateNavigator, root, container;
        var SceneA = () => <div id="sceneA" />;
        var SceneB = () => <div id="sceneB" />;
        var SceneC = () => <div id="sceneC" />;
        var SceneD = () => <div id="sceneD" />;
        beforeEach(() => {
            stateNavigator = new StateNavigator([
                { key: 'sceneA' },
                { key: 'sceneB', trackCrumbTrail: true },
                { key: 'sceneC', trackCrumbTrail: true },
                { key: 'sceneD', trackCrumbTrail: true },
            ]);
            stateNavigator.navigate('sceneA');
            container = document.createElement('div');
            root = createRoot(container)
        });
        describe('Static', () => {
            it('should render A -> _ -> C', async function(){
                var {sceneA, sceneB, sceneC, sceneD} = stateNavigator.states;
                sceneA.renderScene = () => <SceneA />;
                sceneB.renderScene = () => <SceneB />;
                sceneC.renderScene = () => <SceneC />;
                sceneD.renderScene = () => <SceneD />;
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
            it('should render A -> _ -> C', async function(){
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
                                <Scene stateKey="sceneD"><SceneD /></Scene>
                            </NavigationMotion>
                        </NavigationHandler>
                    );
                });
                await test();
            });
        });
        describe('Static Stack', () => {
            it('should render A -> _ -> C', async function(){
                var {sceneA, sceneB, sceneC, sceneD} = stateNavigator.states;
                sceneA.renderScene = () => <SceneA />;
                sceneB.renderScene = () => <SceneB />;
                sceneC.renderScene = () => <SceneC />;
                sceneD.renderScene = () => <SceneD />;
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
            it('should render A -> _ -> C', async function(){
                act(() => {
                    root.render(
                        <NavigationHandler stateNavigator={stateNavigator}>
                            <NavigationStack className="scene">
                                <Scene stateKey="sceneA"><SceneA /></Scene>
                                <Scene stateKey="sceneB"><SceneB /></Scene>
                                <Scene stateKey="sceneC"><SceneC /></Scene>
                                <Scene stateKey="sceneD"><SceneD /></Scene>
                            </NavigationStack>
                        </NavigationHandler>
                    );
                });
                await test();
            });
        });
        const test = async () => {
            await act(async () => {
                var url = stateNavigator.fluent(true)
                    .navigate('sceneB')
                    .navigate('sceneC').url;
                stateNavigator.navigateLink(url);
                url = stateNavigator.fluent(true)
                    .navigateBack(2)
                    .navigate('sceneD')
                    .navigate('sceneC').url;
                stateNavigator.navigateLink(url);
            });
            try {
                var scenes = container.querySelectorAll(".scene");
                assert.equal(scenes.length, 3);
                assert.notEqual(scenes[0].querySelector("#sceneA"), null);
                assert.notEqual(scenes[2].querySelector("#sceneC"), null);
                assert.equal(container.querySelector("#sceneB"), null);
                assert.equal(container.querySelector("#sceneD"), null);
            } finally {
                act(() => root.unmount());
            }
        };
    });

    describe('A to A -> B -> C to A -> D -> C to A -> D', function () {
        var stateNavigator, root, container;
        var SceneA = () => <div id="sceneA" />;
        var SceneB = () => <div id="sceneB" />;
        var SceneC = () => <div id="sceneC" />;
        var SceneD = () => <div id="sceneD" />;
        beforeEach(() => {
            stateNavigator = new StateNavigator([
                { key: 'sceneA' },
                { key: 'sceneB', trackCrumbTrail: true },
                { key: 'sceneC', trackCrumbTrail: true },
                { key: 'sceneD', trackCrumbTrail: true },
            ]);
            stateNavigator.navigate('sceneA');
            container = document.createElement('div');
            root = createRoot(container)
        });
        describe('Static', () => {
            it('should render A -> D', async function(){
                var {sceneA, sceneB, sceneC, sceneD} = stateNavigator.states;
                sceneA.renderScene = () => <SceneA />;
                sceneB.renderScene = () => <SceneB />;
                sceneC.renderScene = () => <SceneC />;
                sceneD.renderScene = () => <SceneD />;
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
            it('should render A -> D', async function(){
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
                                <Scene stateKey="sceneD"><SceneD /></Scene>
                            </NavigationMotion>
                        </NavigationHandler>
                    );
                });
                await test();
            });
        });
        const test = async () => {
            await act(async () => {
                var url = stateNavigator.fluent(true)
                    .navigate('sceneB')
                    .navigate('sceneC').url;
                stateNavigator.navigateLink(url);
                url = stateNavigator.fluent(true)
                    .navigateBack(2)
                    .navigate('sceneD')
                    .navigate('sceneC').url;
                stateNavigator.navigateLink(url);
            });
            await act(async () => {
                stateNavigator.navigateBack(1);
            });
            try {
                var scenes = container.querySelectorAll(".scene");
                assert.equal(scenes.length, 2);
                assert.notEqual(scenes[0].querySelector("#sceneA"), null);
                assert.notEqual(scenes[1].querySelector("#sceneD"), null);
                assert.equal(container.querySelector("#sceneB"), null);
                assert.equal(container.querySelector("#sceneC"), null);
            } finally {
                act(() => root.unmount());
            }
        };
    });

    describe('A to A -> B -> C to A -> D -> C to A -> D', function () {
        var stateNavigator, root, container;
        var SceneA = () => <div id="sceneA" />;
        var SceneB = () => <div id="sceneB" />;
        var SceneC = () => <div id="sceneC" />;
        var SceneD = () => <div id="sceneD" />;
        beforeEach(() => {
            stateNavigator = new StateNavigator([
                { key: 'sceneA' },
                { key: 'sceneB', trackCrumbTrail: true },
                { key: 'sceneC', trackCrumbTrail: true },
                { key: 'sceneD', trackCrumbTrail: true },
            ]);
            stateNavigator.navigate('sceneA');
            container = document.createElement('div');
            root = createRoot(container)
        });
        describe('Static Stack', () => {
            it('should render A -> D', async function(){
                var {sceneA, sceneB, sceneC, sceneD} = stateNavigator.states;
                sceneA.renderScene = () => <SceneA />;
                sceneB.renderScene = () => <SceneB />;
                sceneC.renderScene = () => <SceneC />;
                sceneD.renderScene = () => <SceneD />;
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
            it('should render A -> D', async function(){
                act(() => {
                    root.render(
                        <NavigationHandler stateNavigator={stateNavigator}>
                            <NavigationStack className="scene">
                                <Scene stateKey="sceneA"><SceneA /></Scene>
                                <Scene stateKey="sceneB"><SceneB /></Scene>
                                <Scene stateKey="sceneC"><SceneC /></Scene>
                                <Scene stateKey="sceneD"><SceneD /></Scene>
                            </NavigationStack>
                        </NavigationHandler>
                    );
                });
                await test();
            });
        });
        const test = async () => {
            await act(async () => {
                var url = stateNavigator.fluent(true)
                    .navigate('sceneB')
                    .navigate('sceneC').url;
                stateNavigator.navigateLink(url);
                url = stateNavigator.fluent(true)
                    .navigateBack(2)
                    .navigate('sceneD')
                    .navigate('sceneC').url;
                stateNavigator.navigateLink(url);
            });
            await act(async () => {
                stateNavigator.navigateBack(1);
            });
            try {
                var scenes = container.querySelectorAll(".scene");
                assert.equal(scenes.length, 3);
                assert.notEqual(scenes[0].querySelector("#sceneA"), null);
                assert.equal(scenes[0].style.display, 'none');
                assert.notEqual(scenes[1].querySelector("#sceneD"), null);
                assert.notEqual(scenes[1].style.display, 'none');
                assert.notEqual(scenes[2].querySelector("#sceneC"), null);
                assert.equal(scenes[2].style.display, 'none');
                assert.equal(container.querySelector("#sceneB"), null);
            } finally {
                act(() => root.unmount());
            }
        };
    });

    describe('A to A -> B -> C to A', function () {
        var stateNavigator, root, container;
        var SceneA = () => <div id="sceneA" />;
        var SceneB = () => <div id="sceneB" />;
        var SceneC = () => <div id="sceneC" />;
        beforeEach(() => {
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
            it('should render A', async function(){
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
            })
        });
        describe('Dynamic', () => {            
            it('should render A', async function(){
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
            })
        });
        const test = async () => {
            await act(async () => {
                var url = stateNavigator.fluent(true)
                    .navigate('sceneB')
                    .navigate('sceneC').url;
                stateNavigator.navigateLink(url);
            });
            await act(async () => {
                stateNavigator.navigateBack(2);
            });
            try {
                var scenes = container.querySelectorAll(".scene");
                assert.equal(scenes.length, 1);
                assert.notEqual(scenes[0].querySelector("#sceneA"), null);
                assert.equal(container.querySelector("#sceneB"), null);
                assert.equal(container.querySelector("#sceneC"), null);
            } finally {
                act(() => root.unmount());
            }
        };
    });

    describe('A to A -> B -> C to A', function () {
        var stateNavigator, root, container;
        var SceneA = () => <div id="sceneA" />;
        var SceneB = () => <div id="sceneB" />;
        var SceneC = () => <div id="sceneC" />;
        beforeEach(() => {
            stateNavigator = new StateNavigator([
                { key: 'sceneA' },
                { key: 'sceneB', trackCrumbTrail: true },
                { key: 'sceneC', trackCrumbTrail: true },
            ]);
            stateNavigator.navigate('sceneA');
            container = document.createElement('div');
            root = createRoot(container)
        });
        describe('Static Stack', () => {            
            it('should render A', async function(){
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
            })
        });
        describe('Dynamic Stack', () => {            
            it('should render A', async function(){
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
            })
        });
        const test = async () => {
            await act(async () => {
                var url = stateNavigator.fluent(true)
                    .navigate('sceneB')
                    .navigate('sceneC').url;
                stateNavigator.navigateLink(url);
            });
            await act(async () => {
                stateNavigator.navigateBack(2);
            });
            try {
                var scenes = container.querySelectorAll(".scene");
                assert.equal(scenes.length, 3);
                assert.notEqual(scenes[0].querySelector("#sceneA"), null);
                assert.notEqual(scenes[0].style.display, 'none');
                assert.equal(scenes[1].style.display, 'none');
                assert.notEqual(scenes[2].querySelector("#sceneC"), null);
                assert.equal(scenes[2].style.display, 'none');
                assert.equal(container.querySelector("#sceneB"), null);
            } finally {
                act(() => root.unmount());
            }
        };
    });

    describe('A -> B -> C to A', function () {
        var stateNavigator, root, container;
        var SceneA = () => <div id="sceneA" />;
        var SceneB = () => <div id="sceneB" />;
        var SceneC = () => <div id="sceneC" />;
        beforeEach(() => {
            stateNavigator = new StateNavigator([
                { key: 'sceneA' },
                { key: 'sceneB', trackCrumbTrail: true },
                { key: 'sceneC', trackCrumbTrail: true },
            ]);
            stateNavigator.navigate('sceneA');
            stateNavigator.navigate('sceneB');
            stateNavigator.navigate('sceneC');
            container = document.createElement('div');
            root = createRoot(container)
        });
        describe('Static', () => {
            it('should render A', async function(){
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
            it('should render A', async function(){
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
        const test = async () => {
            await act(async () => stateNavigator.navigateBack(2));
            try {
                var scenes = container.querySelectorAll(".scene");
                assert.equal(scenes.length, 1);
                assert.notEqual(scenes[0].querySelector("#sceneA"), null);
                assert.equal(container.querySelector("#sceneB"), null);
                assert.equal(container.querySelector("#sceneC"), null);
            } finally {
                act(() => root.unmount());
            }
        };
    });

    describe('A -> B -> C to A', function () {
        var stateNavigator, root, container;
        var SceneA = () => <div id="sceneA" />;
        var SceneB = () => <div id="sceneB" />;
        var SceneC = () => <div id="sceneC" />;
        beforeEach(() => {
            stateNavigator = new StateNavigator([
                { key: 'sceneA' },
                { key: 'sceneB', trackCrumbTrail: true },
                { key: 'sceneC', trackCrumbTrail: true },
            ]);
            stateNavigator.navigate('sceneA');
            stateNavigator.navigate('sceneB');
            stateNavigator.navigate('sceneC');
            container = document.createElement('div');
            root = createRoot(container)
        });
        describe('Static Stack', () => {
            it('should render A', async function(){
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
            it('should render A', async function(){
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
            await act(async () => stateNavigator.navigateBack(2));
            try {
                var scenes = container.querySelectorAll(".scene");
                assert.equal(scenes.length, 3);
                assert.notEqual(scenes[0].querySelector("#sceneA"), null);
                assert.notEqual(scenes[0].style.display, 'none');
                assert.equal(scenes[1].style.display, 'none');
                assert.notEqual(scenes[2].querySelector("#sceneC"), null);
                assert.equal(scenes[2].style.display, 'none');
                assert.equal(container.querySelector("#sceneB"), null);
            } finally {
                act(() => root.unmount());
            }
        };
    });

    describe('A -> B -> C to B', function () {
        var stateNavigator, root, container;
        var SceneA = () => <div id="sceneA" />;
        var SceneB = () => <div id="sceneB" />;
        var SceneC = () => <div id="sceneC" />;
        beforeEach(() => {
            stateNavigator = new StateNavigator([
                { key: 'sceneA' },
                { key: 'sceneB', trackCrumbTrail: true },
                { key: 'sceneC', trackCrumbTrail: true },
            ]);
            stateNavigator.navigate('sceneA');
            stateNavigator.navigate('sceneB');
            stateNavigator.navigate('sceneC');
            container = document.createElement('div');
            root = createRoot(container)
        });
        describe('Static', () => {
            it('should render B', async function(){
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
            it('should render B', async function(){
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
        const test = async () => {
            await act(async () => {
                var url = stateNavigator.fluent()
                    .navigate('sceneB').url;
                stateNavigator.navigateLink(url);
            });
            try {
                var scenes = container.querySelectorAll(".scene");
                assert.equal(scenes.length, 1);
                assert.notEqual(scenes[0].querySelector("#sceneB"), null);
                assert.equal(container.querySelector("#sceneA"), null);
                assert.equal(container.querySelector("#sceneC"), null);
            } finally {
                act(() => root.unmount());
            }
        };
    });

    describe('A -> B -> C to B', function () {
        var stateNavigator, root, container;
        var SceneA = () => <div id="sceneA" />;
        var SceneB = () => <div id="sceneB" />;
        var SceneC = () => <div id="sceneC" />;
        beforeEach(() => {
            stateNavigator = new StateNavigator([
                { key: 'sceneA' },
                { key: 'sceneB', trackCrumbTrail: true },
                { key: 'sceneC', trackCrumbTrail: true },
            ]);
            stateNavigator.navigate('sceneA');
            stateNavigator.navigate('sceneB');
            stateNavigator.navigate('sceneC');
            container = document.createElement('div');
            root = createRoot(container)
        });
        describe('Static Stack', () => {
            it('should render B', async function(){
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
            it('should render B', async function(){
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
            await act(async () => {
                var url = stateNavigator.fluent()
                    .navigate('sceneB').url;
                stateNavigator.navigateLink(url);
            });
            try {
                var scenes = container.querySelectorAll(".scene");
                assert.equal(scenes.length, 3);
                assert.notEqual(scenes[0].querySelector("#sceneB"), null);
                assert.notEqual(scenes[0].style.display, 'none');
                assert.equal(scenes[1].style.display, 'none');
                assert.notEqual(scenes[2].querySelector("#sceneC"), null);
                assert.equal(scenes[2].style.display, 'none');
                assert.equal(container.querySelector("#sceneA"), null);
            } finally {
                act(() => root.unmount());
            }
        };
    });

    describe('A to A -> A', function () {
        var stateNavigator, root, container;
        var SceneA = () => <div id="sceneA" />;
        beforeEach(() => {
            stateNavigator = new StateNavigator([
                { key: 'sceneA', trackCrumbTrail: true }
            ]);
            stateNavigator.navigate('sceneA');
            container = document.createElement('div');
            root = createRoot(container)
        });
        describe('Static', () => {
            it('should render A -> A', function(){
                var {sceneA} = stateNavigator.states;
                sceneA.renderScene = () => <SceneA />;
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
                test();
            });
        });
        describe('Dynamic', () => {
            it('should render A -> A', function(){
                act(() => {
                    root.render(
                        <NavigationHandler stateNavigator={stateNavigator}>
                            <NavigationMotion
                                renderMotion={(_style, scene, key) =>  (
                                    <div className="scene" id={key} key={key}>{scene}</div>
                                )}>
                                <Scene stateKey="sceneA"><SceneA /></Scene>
                            </NavigationMotion>
                        </NavigationHandler>
                    );
                });
                test();
            });
        });
        describe('Static Stack', () => {
            it('should render A -> A', function(){
                var {sceneA} = stateNavigator.states;
                sceneA.renderScene = () => <SceneA />;
                act(() => {
                    root.render(
                        <NavigationHandler stateNavigator={stateNavigator}>
                            <NavigationStack className="scene" />
                        </NavigationHandler>
                    );
                });
                test();
            });
        });
        describe('Dynamic Stack', () => {
            it('should render A -> A', function(){
                act(() => {
                    root.render(
                        <NavigationHandler stateNavigator={stateNavigator}>
                            <NavigationStack className="scene">
                                <Scene stateKey="sceneA"><SceneA /></Scene>
                            </NavigationStack>
                        </NavigationHandler>
                    );
                });
                test();
            });
        });
        const test = () => {
            act(() => stateNavigator.navigate('sceneA'));
            try {
                var scenes = container.querySelectorAll(".scene");
                assert.equal(scenes.length, 2);
                assert.notEqual(scenes[0].querySelector("#sceneA"), null);
                assert.notEqual(scenes[1].querySelector("#sceneA"), null);
            } finally {
                act(() => root.unmount());
            }
        };
    });

    describe('A to A -> A to A -> B', function () {
        var stateNavigator, root, container;
        var SceneA = () => <div id="sceneA" />;
        var SceneB = () => <div id="sceneB" />;
        beforeEach(() => {
            stateNavigator = new StateNavigator([
                { key: 'sceneA', trackCrumbTrail: true },
                { key: 'sceneB', trackCrumbTrail: true },
            ]);
            stateNavigator.navigate('sceneA');
            container = document.createElement('div');
            root = createRoot(container)
        });
        describe('Static', () => {
            it('should render A -> B+', async function(){
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
            it('should render A -> B+', async function(){
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
        const test = async () => {
            act(() => stateNavigator.navigate('sceneA'));
            await act(async () => {
                var url = stateNavigator.fluent(true)
                    .navigateBack(1)
                    .navigate('sceneB').url;
                stateNavigator.navigateLink(url);
            });
            try {
                var scenes = container.querySelectorAll(".scene");
                assert.equal(scenes.length, 2);
                assert.notEqual(scenes[0].querySelector("#sceneA"), null);
                assert.notEqual(scenes[1].querySelector("#sceneB"), null);
            } finally {
                act(() => root.unmount());
            }
        };
    });

    describe('A to A -> A to A -> B', function () {
        var stateNavigator, root, container;
        var SceneA = () => <div id="sceneA" />;
        var SceneB = () => <div id="sceneB" />;
        beforeEach(() => {
            stateNavigator = new StateNavigator([
                { key: 'sceneA', trackCrumbTrail: true },
                { key: 'sceneB', trackCrumbTrail: true },
            ]);
            stateNavigator.navigate('sceneA');
            container = document.createElement('div');
            root = createRoot(container)
        });
        describe('Static Stack', () => {
            it('should render A -> B+', async function(){
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
            it('should render A -> B+', async function(){
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
            act(() => stateNavigator.navigate('sceneA'));
            await act(async () => {
                var url = stateNavigator.fluent(true)
                    .navigateBack(1)
                    .navigate('sceneB').url;
                stateNavigator.navigateLink(url);
            });
            try {
                var scenes = container.querySelectorAll(".scene");
                assert.equal(scenes.length, 3);
                assert.notEqual(scenes[0].querySelector("#sceneA"), null);
                assert.equal(scenes[0].style.display, 'none');
                assert.notEqual(scenes[1].querySelector("#sceneA"), null);
                assert.equal(scenes[1].style.display, 'none');
                assert.notEqual(scenes[2].querySelector("#sceneB"), null);
                assert.notEqual(scenes[2].style.display, 'none');
            } finally {
                act(() => root.unmount());
            }
        };
    });

    describe('A to A -> A to A -> B to A -> B -> C to A -> B to A -> C', function () {
        var stateNavigator, root, container;
        var SceneA = () => <div id="sceneA" />;
        var SceneB = () => <div id="sceneB" />;
        var SceneC = () => <div id="sceneC" />;
        beforeEach(() => {
            stateNavigator = new StateNavigator([
                { key: 'sceneA', trackCrumbTrail: true },
                { key: 'sceneB', trackCrumbTrail: true },
                { key: 'sceneC', trackCrumbTrail: true },
            ]);
            stateNavigator.navigate('sceneA');
            container = document.createElement('div');
            root = createRoot(container)
        });
        describe('Static', () => {            
            it('should render A -> C++', async function(){
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
            it('should render A -> C++', async function(){
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
        const test = async () => {
            act(() => stateNavigator.navigate('sceneA'));
            await act(async () => {
                var url = stateNavigator.fluent(true)
                    .navigateBack(1)
                    .navigate('sceneB').url;
                stateNavigator.navigateLink(url);
            });
            act(() => stateNavigator.navigate('sceneC'));
            await act(async () => stateNavigator.navigateBack(1));
            await act(async () => {
                var url = stateNavigator.fluent(true)
                    .navigateBack(1)
                    .navigate('sceneC').url;
                stateNavigator.navigateLink(url);
            });
            try {
                var scenes = container.querySelectorAll(".scene");
                assert.equal(scenes.length, 2);
                assert.notEqual(scenes[0].querySelector("#sceneA"), null);
                assert.notEqual(scenes[1].querySelector("#sceneC"), null);
                assert.equal(container.querySelector("#sceneB"), null);
            } finally {
                act(() => root.unmount());
            }
        };
    });

    describe('A to A -> A to A -> B to A -> B -> C to A -> B to A -> C', function () {
        var stateNavigator, root, container;
        var SceneA = () => <div id="sceneA" />;
        var SceneB = () => <div id="sceneB" />;
        var SceneC = () => <div id="sceneC" />;
        beforeEach(() => {
            stateNavigator = new StateNavigator([
                { key: 'sceneA', trackCrumbTrail: true },
                { key: 'sceneB', trackCrumbTrail: true },
                { key: 'sceneC', trackCrumbTrail: true },
            ]);
            stateNavigator.navigate('sceneA');
            container = document.createElement('div');
            root = createRoot(container)
        });
        describe('Static Stack', () => {            
            it('should render A -> C++', async function(){
                var {sceneA, sceneB, sceneC} = stateNavigator.states;
                sceneA.renderScene = () => <SceneA />;
                sceneB.renderScene = () => <SceneB />;
                sceneC.renderScene = () => <SceneC />;
                act(() => {
                    root.render(
                        <NavigationHandler stateNavigator={stateNavigator}>
                            < NavigationStack className="scene" />
                        </NavigationHandler>
                    );
                });
                await test();
            });
        });
        describe('Dynamic Stack', () => {            
            it('should render A -> C++', async function(){
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
            act(() => stateNavigator.navigate('sceneA'));
            await act(async () => {
                var url = stateNavigator.fluent(true)
                    .navigateBack(1)
                    .navigate('sceneB').url;
                stateNavigator.navigateLink(url);
            });
            act(() => stateNavigator.navigate('sceneC'));
            await act(async () => stateNavigator.navigateBack(1));
            await act(async () => {
                var url = stateNavigator.fluent(true)
                    .navigateBack(1)
                    .navigate('sceneC').url;
                stateNavigator.navigateLink(url);
            });
            try {
                var scenes = container.querySelectorAll(".scene");
                assert.equal(scenes.length, 5);
                assert.notEqual(scenes[0].querySelector("#sceneA"), null);
                assert.equal(scenes[0].style.display, 'none');
                assert.notEqual(scenes[1].querySelector("#sceneA"), null);
                assert.equal(scenes[1].style.display, 'none');
                assert.notEqual(scenes[2].querySelector("#sceneB"), null);
                assert.equal(scenes[2].style.display, 'none');
                assert.notEqual(scenes[3].querySelector("#sceneC"), null);
                assert.notEqual(scenes[3].style.display, 'none');
                assert.notEqual(scenes[4].querySelector("#sceneC"), null);
                assert.equal(scenes[4].style.display, 'none');
            } finally {
                act(() => root.unmount());
            }
        };
    });

    describe('Set state', function () {
        var stateNavigator, root, container: HTMLDivElement, update;
        var SceneA = () => <div id="sceneA" />;
        var SceneB = () => {
            var [updated, setUpdated] = useState(false)
            update = setUpdated;
            return <div id='sceneB' data-updated={updated} />;
        };
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
            it('should render', function(){
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
                test();
            })
        });
        describe('Dynamic', () => {
            it('should render', function(){
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
                test();
            })
        });
        describe('Static Stack', () => {
            it('should render', function(){
                var {sceneA, sceneB} = stateNavigator.states;
                sceneA.renderScene = () => <SceneA />;
                sceneB.renderScene = () => <SceneB />;
                act(() => {
                    root.render(
                        <NavigationHandler stateNavigator={stateNavigator}>
                            <NavigationStack />
                        </NavigationHandler>
                    );
                });
                test();
            })
        });
        describe('Dynamic Stack', () => {
            it('should render', function(){
                act(() => {
                    root.render(
                        <NavigationHandler stateNavigator={stateNavigator}>
                            <NavigationStack>
                                <Scene stateKey="sceneA"><SceneA /></Scene>
                                <Scene stateKey="sceneB"><SceneB /></Scene>
                            </NavigationStack>
                        </NavigationHandler>
                    );
                });
                test();
            })
        });
        const test = () => {
            act(() => {
                stateNavigator.navigate('sceneB');
            });
            act(() => {
                update(true);
            });
            try {
                var scene = container.querySelector<HTMLDivElement>("#sceneB");
                assert.strictEqual(scene.dataset.updated, 'true');
            } finally {
                act(() => root.unmount());
            }
        };
    });

    describe('Crumb set state', function () {
        var stateNavigator, root, container: HTMLDivElement, update;
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
            it('should not render', function(){
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
                test();
            })
        });
        describe('Dynamic', () => {
            it('should not render', function(){
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
                test();
            })
        });
        describe('Static Stack', () => {
            it('should not render', function(){
                var {sceneA, sceneB} = stateNavigator.states;
                sceneA.renderScene = () => <SceneA />;
                sceneB.renderScene = () => <SceneB />;
                act(() => {
                    root.render(
                        <NavigationHandler stateNavigator={stateNavigator}>
                            <NavigationStack />
                        </NavigationHandler>
                    );
                });
                test();
            })
        });
        describe('Dynamic Stack', () => {
            it('should not render', function(){
                act(() => {
                    root.render(
                        <NavigationHandler stateNavigator={stateNavigator}>
                            <NavigationStack>
                                <Scene stateKey="sceneA"><SceneA /></Scene>
                                <Scene stateKey="sceneB"><SceneB /></Scene>
                            </NavigationStack>
                        </NavigationHandler>
                    );
                });
                test();
            })
        });
        const test = () => {
            act(() => {
                stateNavigator.navigate('sceneB');
            });
            act(() => {
                update(true);
            });
            try {
                var scene = container.querySelector<HTMLDivElement>("#sceneA");
                assert.strictEqual(scene.dataset.updated, 'false');
            } finally {
                act(() => root.unmount());
            }
        };
    });

    describe('Crumb set state navigate back', function () {
        var stateNavigator, root, container: HTMLDivElement, update;
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
            it('should render', async function(){
                var {sceneA, sceneB} = stateNavigator.states;
                sceneA.renderScene = () => <SceneA />;
                sceneB.renderScene = () => <SceneB />;
                act(() => {
                    root.render(
                        <NavigationHandler stateNavigator={stateNavigator}>
                            <NavigationMotion>
                                {(_style, scene, key) =>  (
                                    <div id={key} key={key}>{scene}</div>
                                )}
                            </NavigationMotion>
                        </NavigationHandler>
                    );
                });
                await test();
            })
        });
        describe('Dynamic', () => {
            it('should render', async function(){
                act(() => {
                    root.render(
                        <NavigationHandler stateNavigator={stateNavigator}>
                            <NavigationMotion
                                renderMotion={(_style, scene, key) =>  (
                                    <div id={key} key={key}>{scene}</div>
                                )}>
                                <Scene stateKey="sceneA"><SceneA /></Scene>
                                <Scene stateKey="sceneB"><SceneB /></Scene>
                            </NavigationMotion>
                        </NavigationHandler>
                    );
                });
                await test();
            })
        });
        describe('Static Stack', () => {
            it('should render', async function(){
                var {sceneA, sceneB} = stateNavigator.states;
                sceneA.renderScene = () => <SceneA />;
                sceneB.renderScene = () => <SceneB />;
                act(() => {
                    root.render(
                        <NavigationHandler stateNavigator={stateNavigator}>
                            <NavigationStack />
                        </NavigationHandler>
                    );
                });
                await test();
            })
        });
        describe('Dynamic Stack', () => {
            it('should render', async function(){
                act(() => {
                    root.render(
                        <NavigationHandler stateNavigator={stateNavigator}>
                            <NavigationStack>
                                <Scene stateKey="sceneA"><SceneA /></Scene>
                                <Scene stateKey="sceneB"><SceneB /></Scene>
                            </NavigationStack>
                        </NavigationHandler>
                    );
                });
                await test();
            })
        });
        const test = async () => {
            await act(async () => {
                stateNavigator.navigate('sceneB');
            });
            await act(async () => {
                update(true);
                stateNavigator.navigateBack(1);
            });
            try {
                var scene = container.querySelector<HTMLDivElement>("#sceneA");
                assert.strictEqual(scene.dataset.updated, 'true');
            } finally {
                act(() => root.unmount());
            }
        };
    });

    describe('Re-render NavigationMotion static', function () {
        it('should only re-render current scene', async function(){
            var stateNavigator = new StateNavigator([
                { key: 'sceneA' },
                { key: 'sceneB', trackCrumbTrail: true },
            ]);
            stateNavigator.navigate('sceneA');
            var {sceneA, sceneB} = stateNavigator.states;
            var SceneA = ({updated}) => <div id="sceneA" data-updated={updated} />;
            var SceneB = ({updated}) => <div id="sceneB" data-updated={updated} />;
            sceneA.renderScene = (updated) => <SceneA updated={updated} />;
            sceneB.renderScene = (updated) => <SceneB updated={updated} />;
            var update;
            var App = () => {
                var [updated, setUpdated] = useState(false);
                update = setUpdated;
                return (
                    <NavigationHandler stateNavigator={stateNavigator}>
                        <NavigationMotion renderScene={(state) => state.renderScene(updated)}>
                            {(_style, scene, key) =>  (
                                <div id={key} key={key}>{scene}</div>
                            )}
                        </NavigationMotion>
                    </NavigationHandler>
                );
            }
            var container = document.createElement('div');
            var root = createRoot(container)
            act(() => root.render(<App />));
            await act(async () => {
                stateNavigator.navigate('sceneB');
            });
            await act(async () => {
                update(true);
            });
            try {
                var scene = container.querySelector<HTMLDivElement>("#sceneA");
                assert.strictEqual(scene.dataset.updated, 'false');
                scene = container.querySelector<HTMLDivElement>("#sceneB");
                assert.strictEqual(scene.dataset.updated, 'true');
            } finally {
                act(() => root.unmount());
            }
        })
    });

    describe('Re-render NavigationStack static', function () {
        it('should only re-render current scene', async function(){
            var stateNavigator = new StateNavigator([
                { key: 'sceneA' },
                { key: 'sceneB', trackCrumbTrail: true },
            ]);
            stateNavigator.navigate('sceneA');
            var {sceneA, sceneB} = stateNavigator.states;
            var SceneA = ({updated}) => <div id="sceneA" data-updated={updated} />;
            var SceneB = ({updated}) => <div id="sceneB" data-updated={updated} />;
            sceneA.renderScene = (updated) => <SceneA updated={updated} />;
            sceneB.renderScene = (updated) => <SceneB updated={updated} />;
            var update;
            var App = () => {
                var [updated, setUpdated] = useState(false);
                update = setUpdated;
                return (
                    <NavigationHandler stateNavigator={stateNavigator}>
                        <NavigationStack renderScene={(state) => state.renderScene(updated)} />
                    </NavigationHandler>
                );
            }
            var container = document.createElement('div');
            var root = createRoot(container)
            act(() => root.render(<App />));
            await act(async () => {
                stateNavigator.navigate('sceneB');
            });
            await act(async () => {
                update(true);
            });
            try {
                var scene = container.querySelector<HTMLDivElement>("#sceneA");
                assert.strictEqual(scene.dataset.updated, 'false');
                scene = container.querySelector<HTMLDivElement>("#sceneB");
                assert.strictEqual(scene.dataset.updated, 'true');
            } finally {
                act(() => root.unmount());
            }
        })
    });

    describe('Re-render NavigationMotion dynamic', function () {
        it('should only re-render current scene', async function(){
            var stateNavigator = new StateNavigator([
                { key: 'sceneA' },
                { key: 'sceneB', trackCrumbTrail: true },
            ]);
            stateNavigator.navigate('sceneA');
            var SceneA = ({updated}) => <div id="sceneA" data-updated={updated} />;
            var SceneB = ({updated}) => <div id="sceneB" data-updated={updated} />;
            var update;
            var App = () => {
                var [updated, setUpdated] = useState(false);
                update = setUpdated;
                return (
                    <NavigationHandler stateNavigator={stateNavigator}>
                        <NavigationMotion
                            renderMotion={(_style, scene, key) =>  (
                                <div id={key} key={key}>{scene}</div>
                            )}>
                            <Scene stateKey="sceneA"><SceneA updated={updated} /></Scene>
                            <Scene stateKey="sceneB"><SceneB updated={updated} /></Scene>
                        </NavigationMotion>
                    </NavigationHandler>
                );
            }
            var container = document.createElement('div');
            var root = createRoot(container)
            act(() => root.render(<App />));
            await act(async () => {
                stateNavigator.navigate('sceneB');
            });
            await act(async () => {
                update(true);
            });
            try {
                var scene = container.querySelector<HTMLDivElement>("#sceneA");
                assert.strictEqual(scene.dataset.updated, 'false');
                scene = container.querySelector<HTMLDivElement>("#sceneB");
                assert.strictEqual(scene.dataset.updated, 'true');
            } finally {
                act(() => root.unmount());
            }
        })
    });

    describe('Re-render NavigationStack dynamic', function () {
        it('should only re-render current scene', async function(){
            var stateNavigator = new StateNavigator([
                { key: 'sceneA' },
                { key: 'sceneB', trackCrumbTrail: true },
            ]);
            stateNavigator.navigate('sceneA');
            var SceneA = ({updated}) => <div id="sceneA" data-updated={updated} />;
            var SceneB = ({updated}) => <div id="sceneB" data-updated={updated} />;
            var update;
            var App = () => {
                var [updated, setUpdated] = useState(false);
                update = setUpdated;
                return (
                    <NavigationHandler stateNavigator={stateNavigator}>
                        <NavigationStack>
                            <Scene stateKey="sceneA"><SceneA updated={updated} /></Scene>
                            <Scene stateKey="sceneB"><SceneB updated={updated} /></Scene>
                        </NavigationStack>
                    </NavigationHandler>
                );
            }
            var container = document.createElement('div');
            var root = createRoot(container)
            act(() => root.render(<App />));
            await act(async () => {
                stateNavigator.navigate('sceneB');
            });
            await act(async () => {
                update(true);
            });
            try {
                var scene = container.querySelector<HTMLDivElement>("#sceneA");
                assert.strictEqual(scene.dataset.updated, 'false');
                scene = container.querySelector<HTMLDivElement>("#sceneB");
                assert.strictEqual(scene.dataset.updated, 'true');
            } finally {
                act(() => root.unmount());
            }
        })
    });

    describe('Register new scene', function () {
        it('should not clear stack', async function(){
            var stateNavigator = new StateNavigator([
                { key: 'sceneA' },
                { key: 'sceneB', trackCrumbTrail: true },
                { key: 'sceneC', trackCrumbTrail: true },
            ]);
            stateNavigator.navigate('sceneA');
            var SceneA = () => <div id='sceneA' />;
            var SceneB = () => <div id='sceneB' />;
            var SceneC = () => <div id='sceneC' />;
            var update;
            var App = () => {
                var [updated, setUpdated] = useState(false);
                update = setUpdated;
                return (
                    <NavigationHandler stateNavigator={stateNavigator}>
                        <NavigationMotion
                            renderMotion={(_style, scene, key) =>  (
                                <div id={key} key={key}>{scene}</div>
                            )}>
                            <Scene stateKey="sceneA"><SceneA /></Scene>
                            <Scene stateKey="sceneB"><SceneB /></Scene>
                            {updated && <Scene stateKey="sceneC"><SceneC /></Scene>}
                        </NavigationMotion>
                    </NavigationHandler>
                );
            }
            var container = document.createElement('div');
            var root = createRoot(container)
            act(() => root.render(<App />));
            act(() => stateNavigator.navigate('sceneB'));
            await act(async () => update(true));
            try {
                assert.notEqual(container.querySelector("#sceneA"), null);
                assert.notEqual(container.querySelector("#sceneB"), null);
                assert.equal(container.querySelector("#sceneC"), null);
            } finally {
                act(() => root.unmount());
            }
        })
    });

    describe('Register new scene Stack', function () {
        it('should not clear stack', async function(){
            var stateNavigator = new StateNavigator([
                { key: 'sceneA' },
                { key: 'sceneB', trackCrumbTrail: true },
                { key: 'sceneC', trackCrumbTrail: true },
            ]);
            stateNavigator.navigate('sceneA');
            var SceneA = () => <div id='sceneA' />;
            var SceneB = () => <div id='sceneB' />;
            var SceneC = () => <div id='sceneC' />;
            var update;
            var App = () => {
                var [updated, setUpdated] = useState(false);
                update = setUpdated;
                return (
                    <NavigationHandler stateNavigator={stateNavigator}>
                        <NavigationStack>
                            <Scene stateKey="sceneA"><SceneA /></Scene>
                            <Scene stateKey="sceneB"><SceneB /></Scene>
                            {updated && <Scene stateKey="sceneC"><SceneC /></Scene>}
                        </NavigationStack>
                    </NavigationHandler>
                );
            }
            var container = document.createElement('div');
            var root = createRoot(container)
            act(() => root.render(<App />));
            act(() => stateNavigator.navigate('sceneB'));
            await act(async () => update(true));
            try {
                assert.notEqual(container.querySelector("#sceneA"), null);
                assert.notEqual(container.querySelector("#sceneB"), null);
                assert.equal(container.querySelector("#sceneC"), null);
            } finally {
                act(() => root.unmount());
            }
        })
    });

    describe('Unregister current scene in stack', function () {
        it('should clear stack', async function(){
            var stateNavigator = new StateNavigator([
                { key: 'sceneA' },
                { key: 'sceneB', trackCrumbTrail: true },
                { key: 'sceneC', trackCrumbTrail: true },
            ]);
            stateNavigator.navigate('sceneA');
            var SceneA = () => <div id='sceneA' />;
            var SceneB = () => <div id='sceneB' />;
            var SceneC = () => <div id='sceneC' />;
            var update;
            var App = () => {
                var [updated, setUpdated] = useState(false);
                update = setUpdated;
                return (
                    <NavigationHandler stateNavigator={stateNavigator}>
                        <NavigationMotion
                            renderMotion={(_style, scene, key) =>  (
                                <div id={key} key={key}>{scene}</div>
                            )}>
                            <Scene stateKey="sceneA"><SceneA /></Scene>
                            <Scene stateKey="sceneB"><SceneB /></Scene>
                            {!updated && <Scene stateKey="sceneC"><SceneC /></Scene>}
                        </NavigationMotion>
                    </NavigationHandler>
                );
            }
            var container = document.createElement('div');
            var root = createRoot(container)
            act(() => root.render(<App />));
            act(() => stateNavigator.navigate('sceneB'));
            act(() => stateNavigator.navigate('sceneC'));
            await act(async () => update(true));
            try {
                assert.notEqual(container.querySelector("#sceneA"), null);
                assert.equal(container.querySelector("#sceneB"), null);
                assert.equal(container.querySelector("#sceneC"), null);
            } finally {
                act(() => root.unmount());
            }
        })
    });

    describe('Unregister current scene in stack Stack', function () {
        it('should clear stack', async function(){
            var stateNavigator = new StateNavigator([
                { key: 'sceneA' },
                { key: 'sceneB', trackCrumbTrail: true },
                { key: 'sceneC', trackCrumbTrail: true },
            ]);
            stateNavigator.navigate('sceneA');
            var SceneA = () => <div id='sceneA' />;
            var SceneB = () => <div id='sceneB' />;
            var SceneC = () => <div id='sceneC' />;
            var update;
            var App = () => {
                var [updated, setUpdated] = useState(false);
                update = setUpdated;
                return (
                    <NavigationHandler stateNavigator={stateNavigator}>
                        <NavigationStack className="scene">
                            <Scene stateKey="sceneA"><SceneA /></Scene>
                            <Scene stateKey="sceneB"><SceneB /></Scene>
                            {!updated && <Scene stateKey="sceneC"><SceneC /></Scene>}
                        </NavigationStack>
                    </NavigationHandler>
                );
            }
            var container = document.createElement('div');
            var root = createRoot(container)
            act(() => root.render(<App />));
            act(() => stateNavigator.navigate('sceneB'));
            act(() => stateNavigator.navigate('sceneC'));
            await act(async () => update(true));
            try {
                var scenes = container.querySelectorAll<HTMLDivElement>(".scene");
                assert.notEqual(container.querySelector("#sceneA"), null);
                assert.notEqual(scenes[0].style.display, 'none');
                assert.notEqual(container.querySelector("#sceneB"), null);
                assert.equal(scenes[1].style.display, 'none');
                assert.notEqual(container.querySelector("#sceneC"), null);
                assert.equal(scenes[2].style.display, 'none');
            } finally {
                act(() => root.unmount());
            }
        })
    });

    describe('Unregister crumb scene in stack', function () {
        it('should clear stack', async function(){
            var stateNavigator = new StateNavigator([
                { key: 'sceneA' },
                { key: 'sceneB', trackCrumbTrail: true },
                { key: 'sceneC', trackCrumbTrail: true },
            ]);
            stateNavigator.navigate('sceneA');
            var SceneA = () => <div id='sceneA' />;
            var SceneB = () => <div id='sceneB' />;
            var SceneC = () => <div id='sceneC' />;
            var update;
            var App = () => {
                var [updated, setUpdated] = useState(false);
                update = setUpdated;
                return (
                    <NavigationHandler stateNavigator={stateNavigator}>
                        <NavigationMotion
                            renderMotion={(_style, scene, key) =>  (
                                <div id={key} key={key}>{scene}</div>
                            )}>
                            <Scene stateKey="sceneA"><SceneA /></Scene>
                            {!updated && <Scene stateKey="sceneB"><SceneB /></Scene>}
                            <Scene stateKey="sceneC"><SceneC /></Scene>
                        </NavigationMotion>
                    </NavigationHandler>
                );
            }
            var container = document.createElement('div');
            var root = createRoot(container)
            act(() => root.render(<App />));
            act(() => stateNavigator.navigate('sceneB'));
            act(() => stateNavigator.navigate('sceneC'));
            await act(async () => update(true));
            try {
                assert.notEqual(container.querySelector("#sceneA"), null);
                assert.equal(container.querySelector("#sceneB"), null);
                assert.equal(container.querySelector("#sceneC"), null);
            } finally {
                act(() => root.unmount());
            }
        })
    });

    describe('Unregister crumb scene in stack Stack', function () {
        it('should clear stack', async function(){
            var stateNavigator = new StateNavigator([
                { key: 'sceneA' },
                { key: 'sceneB', trackCrumbTrail: true },
                { key: 'sceneC', trackCrumbTrail: true },
            ]);
            stateNavigator.navigate('sceneA');
            var SceneA = () => <div id='sceneA' />;
            var SceneB = () => <div id='sceneB' />;
            var SceneC = () => <div id='sceneC' />;
            var update;
            var App = () => {
                var [updated, setUpdated] = useState(false);
                update = setUpdated;
                return (
                    <NavigationHandler stateNavigator={stateNavigator}>
                        <NavigationStack className="scene">
                            <Scene stateKey="sceneA"><SceneA /></Scene>
                            {!updated && <Scene stateKey="sceneB"><SceneB /></Scene>}
                            <Scene stateKey="sceneC"><SceneC /></Scene>
                        </NavigationStack>
                    </NavigationHandler>
                );
            }
            var container = document.createElement('div');
            var root = createRoot(container)
            act(() => root.render(<App />));
            act(() => stateNavigator.navigate('sceneB'));
            act(() => stateNavigator.navigate('sceneC'));
            await act(async () => update(true));
            try {
                var scenes = container.querySelectorAll<HTMLDivElement>(".scene");
                assert.notEqual(container.querySelector("#sceneA"), null);
                assert.notEqual(scenes[0].style.display, 'none');
                assert.notEqual(container.querySelector("#sceneB"), null);
                assert.equal(scenes[1].style.display, 'none');
                assert.notEqual(container.querySelector("#sceneC"), null);
                assert.equal(scenes[2].style.display, 'none');
            } finally {
                act(() => root.unmount());
            }
        })
    });

    describe('Unregister scene not in stack', function () {
        it('should not clear stack', async function(){
            var stateNavigator = new StateNavigator([
                { key: 'sceneA' },
                { key: 'sceneB', trackCrumbTrail: true },
                { key: 'sceneC', trackCrumbTrail: true },
                { key: 'sceneD', trackCrumbTrail: true },
            ]);
            stateNavigator.navigate('sceneA');
            var SceneA = () => <div id='sceneA' />;
            var SceneB = () => <div id='sceneB' />;
            var SceneC = () => <div id='sceneC' />;
            var SceneD = () => <div id='sceneD' />;
            var update;
            var App = () => {
                var [updated, setUpdated] = useState(false);
                update = setUpdated;
                return (
                    <NavigationHandler stateNavigator={stateNavigator}>
                        <NavigationMotion
                            renderMotion={(_style, scene, key) =>  (
                                <div id={key} key={key}>{scene}</div>
                            )}>
                            <Scene stateKey="sceneA"><SceneA /></Scene>
                            <Scene stateKey="sceneB"><SceneB /></Scene>
                            <Scene stateKey="sceneC"><SceneC /></Scene>
                            {!updated && <Scene stateKey="sceneD"><SceneD /></Scene>}
                        </NavigationMotion>
                    </NavigationHandler>
                );
            }
            var container = document.createElement('div');
            var root = createRoot(container)
            act(() => root.render(<App />));
            act(() => stateNavigator.navigate('sceneB'));
            act(() => stateNavigator.navigate('sceneC'));
            await act(async () => update(true));
            try {
                assert.notEqual(container.querySelector("#sceneA"), null);
                assert.notEqual(container.querySelector("#sceneB"), null);
                assert.notEqual(container.querySelector("#sceneC"), null);
            } finally {
                act(() => root.unmount());
            }
        })
    });

    describe('Unregister scene not in stack Stack', function () {
        it('should not clear stack', async function(){
            var stateNavigator = new StateNavigator([
                { key: 'sceneA' },
                { key: 'sceneB', trackCrumbTrail: true },
                { key: 'sceneC', trackCrumbTrail: true },
                { key: 'sceneD', trackCrumbTrail: true },
            ]);
            stateNavigator.navigate('sceneA');
            var SceneA = () => <div id='sceneA' />;
            var SceneB = () => <div id='sceneB' />;
            var SceneC = () => <div id='sceneC' />;
            var SceneD = () => <div id='sceneD' />;
            var update;
            var App = () => {
                var [updated, setUpdated] = useState(false);
                update = setUpdated;
                return (
                    <NavigationHandler stateNavigator={stateNavigator}>
                        <NavigationStack>
                            <Scene stateKey="sceneA"><SceneA /></Scene>
                            <Scene stateKey="sceneB"><SceneB /></Scene>
                            <Scene stateKey="sceneC"><SceneC /></Scene>
                            {!updated && <Scene stateKey="sceneD"><SceneD /></Scene>}
                        </NavigationStack>
                    </NavigationHandler>
                );
            }
            var container = document.createElement('div');
            var root = createRoot(container)
            act(() => root.render(<App />));
            act(() => stateNavigator.navigate('sceneB'));
            act(() => stateNavigator.navigate('sceneC'));
            await act(async () => update(true));
            try {
                assert.notEqual(container.querySelector("#sceneA"), null);
                assert.notEqual(container.querySelector("#sceneB"), null);
                assert.notEqual(container.querySelector("#sceneC"), null);
            } finally {
                act(() => root.unmount());
            }
        })
    });

    describe('Unregister stack', function () {
        it('should start new stack', async function(){
            var stateNavigator = new StateNavigator([
                { key: 'sceneA' },
                { key: 'sceneB', trackCrumbTrail: true },
                { key: 'sceneC', trackCrumbTrail: true },
                { key: 'sceneD', trackCrumbTrail: true },
            ]);
            stateNavigator.navigate('sceneA');
            var SceneA = () => <div id='sceneA' />;
            var SceneB = () => <div id='sceneB' />;
            var SceneC = () => <div id='sceneC' />;
            var SceneD = () => <div id='sceneD' />;
            var update;
            var App = () => {
                var [updated, setUpdated] = useState(false);
                update = setUpdated;
                return (
                    <NavigationHandler stateNavigator={stateNavigator}>
                        <NavigationMotion
                            renderMotion={(_style, scene, key) =>  (
                                <div id={key} key={key}>{scene}</div>
                            )}>
                            {!updated ? (
                                <>
                                    <Scene stateKey="sceneA"><SceneA /></Scene>
                                    <Scene stateKey="sceneB"><SceneB /></Scene>
                                </>
                            ) : (
                                <>
                                    <Scene stateKey="sceneC"><SceneC /></Scene>
                                    <Scene stateKey="sceneD"><SceneD /></Scene>
                                </>
                            )}
                        </NavigationMotion>
                    </NavigationHandler>
                );
            }
            var container = document.createElement('div');
            var root = createRoot(container)
            act(() => root.render(<App />));
            act(() => stateNavigator.navigate('sceneB'));
            await act(async () => update(true));
            try {
                assert.equal(container.querySelector("#sceneA"), null);
                assert.equal(container.querySelector("#sceneB"), null);
                assert.notEqual(container.querySelector("#sceneC"), null);
            } finally {
                act(() => root.unmount());
            }
        })
    });

    describe('Unregister stack Stack', function () {
        it('should start new stack', async function(){
            var stateNavigator = new StateNavigator([
                { key: 'sceneA' },
                { key: 'sceneB', trackCrumbTrail: true },
                { key: 'sceneC', trackCrumbTrail: true },
                { key: 'sceneD', trackCrumbTrail: true },
            ]);
            stateNavigator.navigate('sceneA');
            var SceneA = () => <div id='sceneA' />;
            var SceneB = () => <div id='sceneB' />;
            var SceneC = () => <div id='sceneC' />;
            var SceneD = () => <div id='sceneD' />;
            var update;
            var App = () => {
                var [updated, setUpdated] = useState(false);
                update = setUpdated;
                return (
                    <NavigationHandler stateNavigator={stateNavigator}>
                        <NavigationStack>
                            {!updated ? (
                                <>
                                    <Scene stateKey="sceneA"><SceneA /></Scene>
                                    <Scene stateKey="sceneB"><SceneB /></Scene>
                                </>
                            ) : (
                                <>
                                    <Scene stateKey="sceneC"><SceneC /></Scene>
                                    <Scene stateKey="sceneD"><SceneD /></Scene>
                                </>
                            )}
                        </NavigationStack>
                    </NavigationHandler>
                );
            }
            var container = document.createElement('div');
            var root = createRoot(container)
            act(() => root.render(<App />));
            act(() => stateNavigator.navigate('sceneB'));
            await act(async () => update(true));
            try {
                assert.equal(container.querySelector("#sceneA"), null);
                assert.equal(container.querySelector("#sceneB"), null);
                assert.notEqual(container.querySelector("#sceneC"), null);
            } finally {
                act(() => root.unmount());
            }
        })
    });

    describe('Blank state context dynamic', function () {
        it('should start stack with first scene', async function(){
            var stateNavigator = new StateNavigator([
                { key: 'sceneA' },
                { key: 'sceneB', trackCrumbTrail: true },
            ]);
            var SceneA = () => <div id='sceneA' />;
            var SceneB = () => <div id='sceneB' />;
            stateNavigator.navigate('sceneA');
            var App = () => (
                <NavigationHandler stateNavigator={stateNavigator}>
                    <NavigationMotion
                        renderMotion={(_style, scene, key) =>  (
                            <div id={key} key={key}>{scene}</div>
                        )}>
                            <Scene stateKey="sceneA"><SceneA /></Scene>
                            <Scene stateKey="sceneB"><SceneB /></Scene>
                    </NavigationMotion>
                </NavigationHandler>
            );
            var container = document.createElement('div');
            var root = createRoot(container)
            act(() => root.render(<App />));
            try {
                assert.notEqual(container.querySelector("#sceneA"), null);
            } finally {
                act(() => root.unmount());
            }
        })
    });

    describe('Blank state context dynamic Stack', function () {
        it('should start stack with first scene', async function(){
            var stateNavigator = new StateNavigator([
                { key: 'sceneA' },
                { key: 'sceneB', trackCrumbTrail: true },
            ]);
            var SceneA = () => <div id='sceneA' />;
            var SceneB = () => <div id='sceneB' />;
            stateNavigator.navigate('sceneA');
            var App = () => (
                <NavigationHandler stateNavigator={stateNavigator}>
                    <NavigationStack>
                            <Scene stateKey="sceneA"><SceneA /></Scene>
                            <Scene stateKey="sceneB"><SceneB /></Scene>
                    </NavigationStack>
                </NavigationHandler>
            );
            var container = document.createElement('div');
            var root = createRoot(container)
            act(() => root.render(<App />));
            try {
                assert.notEqual(container.querySelector("#sceneA"), null);
            } finally {
                act(() => root.unmount());
            }
        })
    });

    describe('Navigate unregistered scene dynamic', function () {
        it('should cancel', async function(){
            var stateNavigator = new StateNavigator([
                { key: 'sceneA' },
                { key: 'sceneB', trackCrumbTrail: true },
                { key: 'sceneC', trackCrumbTrail: true },
            ]);
            var SceneA = () => <div id='sceneA' />;
            var SceneB = () => <div id='sceneB' />;
            var App = () => (
                <NavigationHandler stateNavigator={stateNavigator}>
                    <NavigationMotion
                        renderMotion={(_style, scene, key) =>  (
                            <div id={key} key={key}>{scene}</div>
                        )}>
                            <Scene stateKey="sceneA"><SceneA /></Scene>
                            <Scene stateKey="sceneB"><SceneB /></Scene>
                    </NavigationMotion>
                </NavigationHandler>
            );
            var container = document.createElement('div');
            var root = createRoot(container)
            act(() => root.render(<App />));
            act(() => stateNavigator.navigate('sceneB'));
            act(() => stateNavigator.navigate('sceneC'));
            try {
                assert.notEqual(container.querySelector("#sceneA"), null);
                assert.notEqual(container.querySelector("#sceneB"), null);
                assert.equal(stateNavigator.stateContext.state, stateNavigator.states.sceneB)
            } finally {
                act(() => root.unmount());
            }
        })
    });

    describe('Navigate unregistered scene dynamic Stack', function () {
        it('should cancel', async function(){
            var stateNavigator = new StateNavigator([
                { key: 'sceneA' },
                { key: 'sceneB', trackCrumbTrail: true },
                { key: 'sceneC', trackCrumbTrail: true },
            ]);
            var SceneA = () => <div id='sceneA' />;
            var SceneB = () => <div id='sceneB' />;
            var App = () => (
                <NavigationHandler stateNavigator={stateNavigator}>
                    <NavigationStack>
                            <Scene stateKey="sceneA"><SceneA /></Scene>
                            <Scene stateKey="sceneB"><SceneB /></Scene>
                    </NavigationStack>
                </NavigationHandler>
            );
            var container = document.createElement('div');
            var root = createRoot(container)
            act(() => root.render(<App />));
            act(() => stateNavigator.navigate('sceneB'));
            act(() => stateNavigator.navigate('sceneC'));
            try {
                assert.notEqual(container.querySelector("#sceneA"), null);
                assert.notEqual(container.querySelector("#sceneB"), null);
                assert.equal(stateNavigator.stateContext.state, stateNavigator.states.sceneB)
            } finally {
                act(() => root.unmount());
            }
        })
    });

    describe('Unregister scene then navigate dynamic', function () {
        it('should cancel', async function(){
            var stateNavigator = new StateNavigator([
                { key: 'sceneA' },
                { key: 'sceneB', trackCrumbTrail: true },
                { key: 'sceneC', trackCrumbTrail: true },
            ]);
            var SceneA = () => <div id='sceneA' />;
            var SceneB = () => <div id='sceneB' />;
            var SceneC = () => <div id='sceneC' />;
            var update;
            var App = () => {
                var [updated, setUpdated] = useState(false);
                update = setUpdated;
                return (
                    <NavigationHandler stateNavigator={stateNavigator}>
                        <NavigationMotion
                            renderMotion={(_style, scene, key) =>  (
                                <div id={key} key={key}>{scene}</div>
                            )}>
                                <Scene stateKey="sceneA"><SceneA /></Scene>
                                <Scene stateKey="sceneB"><SceneB /></Scene>
                                {!updated && <Scene stateKey="sceneC"><SceneC /></Scene>}
                        </NavigationMotion>
                    </NavigationHandler>
                );
            };
            var container = document.createElement('div');
            var root = createRoot(container)
            act(() => root.render(<App />));
            act(() => stateNavigator.navigate('sceneB'));
            await act(async () => update(true));
            act(() => stateNavigator.navigate('sceneC'));
            try {
                assert.notEqual(container.querySelector("#sceneA"), null);
                assert.notEqual(container.querySelector("#sceneB"), null);
                assert.equal(container.querySelector("#sceneC"), null);
                assert.equal(stateNavigator.stateContext.state, stateNavigator.states.sceneB)
            } finally {
                act(() => root.unmount());
            }
        })
    });

    describe('Unregister scene then navigate dynamic Stack', function () {
        it('should cancel', async function(){
            var stateNavigator = new StateNavigator([
                { key: 'sceneA' },
                { key: 'sceneB', trackCrumbTrail: true },
                { key: 'sceneC', trackCrumbTrail: true },
            ]);
            var SceneA = () => <div id='sceneA' />;
            var SceneB = () => <div id='sceneB' />;
            var SceneC = () => <div id='sceneC' />;
            var update;
            var App = () => {
                var [updated, setUpdated] = useState(false);
                update = setUpdated;
                return (
                    <NavigationHandler stateNavigator={stateNavigator}>
                        <NavigationStack>
                                <Scene stateKey="sceneA"><SceneA /></Scene>
                                <Scene stateKey="sceneB"><SceneB /></Scene>
                                {!updated && <Scene stateKey="sceneC"><SceneC /></Scene>}
                        </NavigationStack>
                    </NavigationHandler>
                );
            };
            var container = document.createElement('div');
            var root = createRoot(container)
            act(() => root.render(<App />));
            act(() => stateNavigator.navigate('sceneB'));
            await act(async () => update(true));
            act(() => stateNavigator.navigate('sceneC'));
            try {
                assert.notEqual(container.querySelector("#sceneA"), null);
                assert.notEqual(container.querySelector("#sceneB"), null);
                assert.equal(container.querySelector("#sceneC"), null);
                assert.equal(stateNavigator.stateContext.state, stateNavigator.states.sceneB)
            } finally {
                act(() => root.unmount());
            }
        })
    });

    describe('State context A -> B dynamic', function () {
        it('should not start with first scene', async function(){
            var stateNavigator = new StateNavigator([
                { key: 'sceneA' },
                { key: 'sceneB', trackCrumbTrail: true },
            ]);
            var SceneA = () => <div id='sceneA' />;
            var SceneB = () => <div id='sceneB' />;
            stateNavigator.navigate('sceneA');
            stateNavigator.navigate('sceneB');
            var App = () => (
                <NavigationHandler stateNavigator={stateNavigator}>
                    <NavigationMotion
                        renderMotion={(_style, scene, key) =>  (
                            <div id={key} key={key}>{scene}</div>
                        )}>
                            <Scene stateKey="sceneA"><SceneA /></Scene>
                            <Scene stateKey="sceneB"><SceneB /></Scene>
                    </NavigationMotion>
                </NavigationHandler>
            );
            var container = document.createElement('div');
            var root = createRoot(container)
            act(() => root.render(<App />));
            try {
                assert.notEqual(container.querySelector("#sceneB"), null);
            } finally {
                act(() => root.unmount());
            }
        })
    });

    describe('State context A -> B dynamic Stack', function () {
        it('should not start with first scene', async function(){
            var stateNavigator = new StateNavigator([
                { key: 'sceneA' },
                { key: 'sceneB', trackCrumbTrail: true },
            ]);
            var SceneA = () => <div id='sceneA' />;
            var SceneB = () => <div id='sceneB' />;
            stateNavigator.navigate('sceneA');
            stateNavigator.navigate('sceneB');
            var App = () => (
                <NavigationHandler stateNavigator={stateNavigator}>
                    <NavigationStack>
                            <Scene stateKey="sceneA"><SceneA /></Scene>
                            <Scene stateKey="sceneB"><SceneB /></Scene>
                    </NavigationStack>
                </NavigationHandler>
            );
            var container = document.createElement('div');
            var root = createRoot(container)
            act(() => root.render(<App />));
            try {
                assert.notEqual(container.querySelector("#sceneB"), null);
            } finally {
                act(() => root.unmount());
            }
        })
    });

    describe('Register mix of nested scenes dynamic', function () {
        it('should render', async function(){
            var stateNavigator = new StateNavigator([
                { key: 'sceneA' },
                { key: 'sceneB', trackCrumbTrail: true },
                { key: 'sceneC', trackCrumbTrail: true },
                { key: 'sceneD', trackCrumbTrail: true },
            ]);
            stateNavigator.navigate('sceneA');
            var SceneA = () => <div id='sceneA' />;
            var SceneB = () => <div id='sceneB' />;
            var SceneC = () => <div id='sceneC' />;
            var SceneD = () => <div id='sceneD' />;
            var App = () => (
                <NavigationHandler stateNavigator={stateNavigator}>
                    <NavigationMotion
                        renderMotion={(_style, scene, key) =>  (
                            <div id={key} key={key}>{scene}</div>
                        )}>
                        <>
                            <Scene stateKey="sceneA"><SceneA /></Scene>
                        </>
                        <Scene stateKey="sceneB"><SceneB /></Scene>
                        <>
                            <Scene stateKey="sceneC"><SceneC /></Scene>
                            <Scene stateKey="sceneD"><SceneD /></Scene>
                        </>
                    </NavigationMotion>
                </NavigationHandler>
            );
            var container = document.createElement('div');
            var root = createRoot(container)
            act(() => root.render(<App />));
            act(() => stateNavigator.navigate('sceneB'));
            await act(async () => stateNavigator.navigate('sceneC'));
            try {
                assert.notEqual(container.querySelector("#sceneA"), null);
                assert.notEqual(container.querySelector("#sceneB"), null);
                assert.notEqual(container.querySelector("#sceneC"), null);
                assert.equal(container.querySelector("#sceneD"), null);
            } finally {
                act(() => root.unmount());
            }
        })
    });

    describe('Register mix of nested scenes dynamic Stack', function () {
        it('should render', async function(){
            var stateNavigator = new StateNavigator([
                { key: 'sceneA' },
                { key: 'sceneB', trackCrumbTrail: true },
                { key: 'sceneC', trackCrumbTrail: true },
                { key: 'sceneD', trackCrumbTrail: true },
            ]);
            stateNavigator.navigate('sceneA');
            var SceneA = () => <div id='sceneA' />;
            var SceneB = () => <div id='sceneB' />;
            var SceneC = () => <div id='sceneC' />;
            var SceneD = () => <div id='sceneD' />;
            var App = () => (
                <NavigationHandler stateNavigator={stateNavigator}>
                    <NavigationStack>
                        <>
                            <Scene stateKey="sceneA"><SceneA /></Scene>
                        </>
                        <Scene stateKey="sceneB"><SceneB /></Scene>
                        <>
                            <Scene stateKey="sceneC"><SceneC /></Scene>
                            <Scene stateKey="sceneD"><SceneD /></Scene>
                        </>
                    </NavigationStack>
                </NavigationHandler>
            );
            var container = document.createElement('div');
            var root = createRoot(container)
            act(() => root.render(<App />));
            act(() => stateNavigator.navigate('sceneB'));
            await act(async () => stateNavigator.navigate('sceneC'));
            try {
                assert.notEqual(container.querySelector("#sceneA"), null);
                assert.notEqual(container.querySelector("#sceneB"), null);
                assert.notEqual(container.querySelector("#sceneC"), null);
                assert.equal(container.querySelector("#sceneD"), null);
            } finally {
                act(() => root.unmount());
            }
        })
    });

    describe('Unregister current scene with invalidated link to C', function () {
        it('should navigate to C', async function(){
            var stateNavigator = new StateNavigator([
                { key: 'sceneA' },
                { key: 'sceneB', trackCrumbTrail: true },
                { key: 'sceneC', trackCrumbTrail: true },
            ]);
            stateNavigator.navigate('sceneA');
            var SceneA = () => <div id='sceneA' />;
            var SceneB = () => <div id='sceneB' />;
            var SceneC = () => <div id='sceneC' />;
            var update;
            var App = () => {
                var [updated, setUpdated] = useState(false);
                update = setUpdated;
                return (
                    <NavigationHandler stateNavigator={stateNavigator}>
                        <NavigationMotion
                            renderMotion={(_style, scene, key) =>  (
                                <div id={key} key={key}>{scene}</div>
                            )}
                            stackInvalidatedLink="/sceneC">
                                <Scene stateKey="sceneA"><SceneA /></Scene>
                                {!updated && <Scene stateKey="sceneB"><SceneB /></Scene>}
                                <Scene stateKey="sceneC"><SceneC /></Scene>
                        </NavigationMotion>
                    </NavigationHandler>
                );
            };
            var container = document.createElement('div');
            var root = createRoot(container)
            act(() => root.render(<App />));
            act(() => stateNavigator.navigate('sceneB'));
            await act(async () => update(true));
            try {
                assert.equal(container.querySelector("#sceneA"), null);
                assert.equal(container.querySelector("#sceneB"), null);
                assert.notEqual(container.querySelector("#sceneC"), null);
                assert.equal(stateNavigator.stateContext.state, stateNavigator.states.sceneC)
                assert.equal(stateNavigator.stateContext.crumbs.length, 0)
            } finally {
                act(() => root.unmount());
            }
        })
    });

    describe('Unregister current scene with invalidated link to C Stack', function () {
        it('should navigate to C', async function(){
            var stateNavigator = new StateNavigator([
                { key: 'sceneA' },
                { key: 'sceneB', trackCrumbTrail: true },
                { key: 'sceneC', trackCrumbTrail: true },
            ]);
            stateNavigator.navigate('sceneA');
            var SceneA = () => <div id='sceneA' />;
            var SceneB = () => <div id='sceneB' />;
            var SceneC = () => <div id='sceneC' />;
            var update;
            var App = () => {
                var [updated, setUpdated] = useState(false);
                update = setUpdated;
                return (
                    <NavigationHandler stateNavigator={stateNavigator}>
                        <NavigationStack stackInvalidatedLink="/sceneC">
                                <Scene stateKey="sceneA"><SceneA /></Scene>
                                {!updated && <Scene stateKey="sceneB"><SceneB /></Scene>}
                                <Scene stateKey="sceneC"><SceneC /></Scene>
                        </NavigationStack>
                    </NavigationHandler>
                );
            };
            var container = document.createElement('div');
            var root = createRoot(container)
            act(() => root.render(<App />));
            act(() => stateNavigator.navigate('sceneB'));
            await act(async () => update(true));
            try {
                assert.equal(container.querySelector("#sceneA"), null);
                assert.equal(container.querySelector("#sceneB"), null);
                assert.notEqual(container.querySelector("#sceneC"), null);
                assert.equal(stateNavigator.stateContext.state, stateNavigator.states.sceneC)
                assert.equal(stateNavigator.stateContext.crumbs.length, 0)
            } finally {
                act(() => root.unmount());
            }
        })
    });

    describe('Unregister crumb scene with invalidated link', function () {
        it('should navigate', async function(){
            var stateNavigator = new StateNavigator([
                { key: 'sceneA' },
                { key: 'sceneB', trackCrumbTrail: true },
                { key: 'sceneC', trackCrumbTrail: true },
            ]);
            stateNavigator.navigate('sceneA');
            var SceneA = () => <div id='sceneA' />;
            var SceneB = () => <div id='sceneB' />;
            var SceneC = () => <div id='sceneC' />;
            var update;
            var App = () => {
                var [updated, setUpdated] = useState(false);
                update = setUpdated;
                return (
                    <NavigationHandler stateNavigator={stateNavigator}>
                        <NavigationMotion
                            renderMotion={(_style, scene, key) =>  (
                                <div id={key} key={key}>{scene}</div>
                            )}
                            stackInvalidatedLink="/sceneC">
                                {!updated && <Scene stateKey="sceneA"><SceneA /></Scene>}
                                <Scene stateKey="sceneB"><SceneB /></Scene>
                                <Scene stateKey="sceneC"><SceneC /></Scene>
                        </NavigationMotion>
                    </NavigationHandler>
                );
            };
            var container = document.createElement('div');
            var root = createRoot(container)
            act(() => root.render(<App />));
            act(() => stateNavigator.navigate('sceneB'));
            await act(async () => update(true));
            try {
                assert.equal(container.querySelector("#sceneA"), null);
                assert.equal(container.querySelector("#sceneB"), null);
                assert.notEqual(container.querySelector("#sceneC"), null);
                assert.equal(stateNavigator.stateContext.state, stateNavigator.states.sceneC)
                assert.equal(stateNavigator.stateContext.crumbs.length, 0)
            } finally {
                act(() => root.unmount());
            }
        })
    });

    describe('Unregister crumb scene with invalidated link Stack', function () {
        it('should navigate', async function(){
            var stateNavigator = new StateNavigator([
                { key: 'sceneA' },
                { key: 'sceneB', trackCrumbTrail: true },
                { key: 'sceneC', trackCrumbTrail: true },
            ]);
            stateNavigator.navigate('sceneA');
            var SceneA = () => <div id='sceneA' />;
            var SceneB = () => <div id='sceneB' />;
            var SceneC = () => <div id='sceneC' />;
            var update;
            var App = () => {
                var [updated, setUpdated] = useState(false);
                update = setUpdated;
                return (
                    <NavigationHandler stateNavigator={stateNavigator}>
                        <NavigationStack stackInvalidatedLink="/sceneC">
                                {!updated && <Scene stateKey="sceneA"><SceneA /></Scene>}
                                <Scene stateKey="sceneB"><SceneB /></Scene>
                                <Scene stateKey="sceneC"><SceneC /></Scene>
                        </NavigationStack>
                    </NavigationHandler>
                );
            };
            var container = document.createElement('div');
            var root = createRoot(container)
            act(() => root.render(<App />));
            act(() => stateNavigator.navigate('sceneB'));
            await act(async () => update(true));
            try {
                assert.equal(container.querySelector("#sceneA"), null);
                assert.equal(container.querySelector("#sceneB"), null);
                assert.notEqual(container.querySelector("#sceneC"), null);
                assert.equal(stateNavigator.stateContext.state, stateNavigator.states.sceneC)
                assert.equal(stateNavigator.stateContext.crumbs.length, 0)
            } finally {
                act(() => root.unmount());
            }
        })
    });

    describe('Unregister current scene with invalidated link null', function () {
        it('should navigate to first scene', async function(){
            var stateNavigator = new StateNavigator([
                { key: 'sceneA' },
                { key: 'sceneB', trackCrumbTrail: true },
                { key: 'sceneC', trackCrumbTrail: true },
            ]);
            stateNavigator.navigate('sceneA');
            var SceneA = () => <div id='sceneA' />;
            var SceneB = () => <div id='sceneB' />;
            var SceneC = () => <div id='sceneC' />;
            var update;
            var App = () => {
                var [updated, setUpdated] = useState(false);
                update = setUpdated;
                return (
                    <NavigationHandler stateNavigator={stateNavigator}>
                        <NavigationMotion
                            renderMotion={(_style, scene, key) =>  (
                                <div id={key} key={key}>{scene}</div>
                            )}
                            stackInvalidatedLink={null}>
                                <Scene stateKey="sceneA"><SceneA /></Scene>
                                {!updated && <Scene stateKey="sceneB"><SceneB /></Scene>}
                                <Scene stateKey="sceneC"><SceneC /></Scene>
                        </NavigationMotion>
                    </NavigationHandler>
                );
            };
            var container = document.createElement('div');
            var root = createRoot(container)
            act(() => root.render(<App />));
            act(() => stateNavigator.navigate('sceneB'));
            await act(async () => update(true));
            try {
                assert.notEqual(container.querySelector("#sceneA"), null);
                assert.equal(container.querySelector("#sceneB"), null);
                assert.equal(container.querySelector("#sceneC"), null);
                assert.equal(stateNavigator.stateContext.state, stateNavigator.states.sceneA)
                assert.equal(stateNavigator.stateContext.crumbs.length, 0)
            } finally {
                act(() => root.unmount());
            }
        })
    });

    describe('Unregister current scene with invalidated link null Stack', function () {
        it('should navigate to first scene', async function(){
            var stateNavigator = new StateNavigator([
                { key: 'sceneA' },
                { key: 'sceneB', trackCrumbTrail: true },
                { key: 'sceneC', trackCrumbTrail: true },
            ]);
            stateNavigator.navigate('sceneA');
            var SceneA = () => <div id='sceneA' />;
            var SceneB = () => <div id='sceneB' />;
            var SceneC = () => <div id='sceneC' />;
            var update;
            var App = () => {
                var [updated, setUpdated] = useState(false);
                update = setUpdated;
                return (
                    <NavigationHandler stateNavigator={stateNavigator}>
                        <NavigationStack stackInvalidatedLink={null}>
                                <Scene stateKey="sceneA"><SceneA /></Scene>
                                {!updated && <Scene stateKey="sceneB"><SceneB /></Scene>}
                                <Scene stateKey="sceneC"><SceneC /></Scene>
                        </NavigationStack>
                    </NavigationHandler>
                );
            };
            var container = document.createElement('div');
            var root = createRoot(container)
            act(() => root.render(<App />));
            act(() => stateNavigator.navigate('sceneB'));
            await act(async () => update(true));
            try {
                assert.notEqual(container.querySelector("#sceneA"), null);
                assert.equal(container.querySelector("#sceneB"), null);
                assert.equal(container.querySelector("#sceneC"), null);
                assert.equal(stateNavigator.stateContext.state, stateNavigator.states.sceneA)
                assert.equal(stateNavigator.stateContext.crumbs.length, 0)
            } finally {
                act(() => root.unmount());
            }
        })
    });

    describe('Unregister stack with fluent invalidated', function () {
        it('should navigate', async function(){
            var stateNavigator = new StateNavigator([
                { key: 'sceneA' },
                { key: 'sceneB', trackCrumbTrail: true },
                { key: 'sceneC', trackCrumbTrail: true },
                { key: 'sceneD', trackCrumbTrail: true },
            ]);
            stateNavigator.navigate('sceneA');
            var SceneA = () => <div id='sceneA' />;
            var SceneB = () => <div id='sceneB' />;
            var SceneC = () => <div id='sceneC' />;
            var SceneD = () => <div id='sceneD' />;
            var update;
            var App = () => {
                var [updated, setUpdated] = useState(false);
                update = setUpdated;
                return (
                    <NavigationHandler stateNavigator={stateNavigator}>
                        <NavigationMotion
                            renderMotion={(_style, scene, key) =>  (
                                <div id={key} key={key}>{scene}</div>
                            )}
                            stackInvalidatedLink={stateNavigator.fluent()
                                .navigate('sceneC')
                                .navigate('sceneD').url}>
                            {!updated ? (
                                <>
                                    <Scene stateKey="sceneA"><SceneA /></Scene>
                                    <Scene stateKey="sceneB"><SceneB /></Scene>
                                </>
                            ) : (
                                <>
                                    <Scene stateKey="sceneC"><SceneC /></Scene>
                                    <Scene stateKey="sceneD"><SceneD /></Scene>
                                </>
                            )}
                        </NavigationMotion>
                    </NavigationHandler>
                );
            };
            var container = document.createElement('div');
            var root = createRoot(container)
            act(() => root.render(<App />));
            act(() => stateNavigator.navigate('sceneB'));
            await act(async () => update(true));
            try {
                assert.equal(container.querySelector("#sceneB"), null);
                assert.notEqual(container.querySelector("#sceneD"), null);
                assert.equal(stateNavigator.stateContext.state, stateNavigator.states.sceneD)
                assert.equal(stateNavigator.stateContext.crumbs.length, 1)
            } finally {
                act(() => root.unmount());
            }
        })
    });

    describe('Unregister stack with fluent invalidated Stack', function () {
        it('should navigate', async function(){
            var stateNavigator = new StateNavigator([
                { key: 'sceneA' },
                { key: 'sceneB', trackCrumbTrail: true },
                { key: 'sceneC', trackCrumbTrail: true },
                { key: 'sceneD', trackCrumbTrail: true },
            ]);
            stateNavigator.navigate('sceneA');
            var SceneA = () => <div id='sceneA' />;
            var SceneB = () => <div id='sceneB' />;
            var SceneC = () => <div id='sceneC' />;
            var SceneD = () => <div id='sceneD' />;
            var update;
            var App = () => {
                var [updated, setUpdated] = useState(false);
                update = setUpdated;
                return (
                    <NavigationHandler stateNavigator={stateNavigator}>
                        <NavigationStack stackInvalidatedLink={stateNavigator.fluent()
                                .navigate('sceneC')
                                .navigate('sceneD').url}>
                            {!updated ? (
                                <>
                                    <Scene stateKey="sceneA"><SceneA /></Scene>
                                    <Scene stateKey="sceneB"><SceneB /></Scene>
                                </>
                            ) : (
                                <>
                                    <Scene stateKey="sceneC"><SceneC /></Scene>
                                    <Scene stateKey="sceneD"><SceneD /></Scene>
                                </>
                            )}
                        </NavigationStack>
                    </NavigationHandler>
                );
            };
            var container = document.createElement('div');
            var root = createRoot(container)
            act(() => root.render(<App />));
            act(() => stateNavigator.navigate('sceneB'));
            await act(async () => update(true));
            try {
                assert.equal(container.querySelector("#sceneB"), null);
                assert.notEqual(container.querySelector("#sceneD"), null);
                assert.equal(stateNavigator.stateContext.state, stateNavigator.states.sceneD)
                assert.equal(stateNavigator.stateContext.crumbs.length, 1)
            } finally {
                act(() => root.unmount());
            }
        })
    });

    describe('Navigation motion without children static', function () {
        it('should render', function(){
            var stateNavigator = new StateNavigator([
                { key: 'sceneA' }
            ]);
            stateNavigator.navigate('sceneA');
            var SceneA = () => <div id="sceneA" />;
            var {sceneA} = stateNavigator.states;
            sceneA.renderScene = () => <SceneA />;
            var container = document.createElement('div');
            var root = createRoot(container)
            act(() => {
                root.render(
                    <NavigationHandler stateNavigator={stateNavigator}>
                        <NavigationMotion
                            renderMotion={(_style, scene, key) =>  (
                                <div className="scene" id={key} key={key}>{scene}</div>
                            )} />
                    </NavigationHandler>
                );
            });
            try {
                var scenes = container.querySelectorAll(".scene");
                assert.equal(scenes.length, 1);
                assert.notEqual(scenes[0].querySelector("#sceneA"), null);
            } finally {
                act(() => root.unmount());
            }
        });
    });

    describe('Navigation motion without children static Stack', function () {
        it('should render', function(){
            var stateNavigator = new StateNavigator([
                { key: 'sceneA' }
            ]);
            stateNavigator.navigate('sceneA');
            var SceneA = () => <div id="sceneA" />;
            var {sceneA} = stateNavigator.states;
            sceneA.renderScene = () => <SceneA />;
            var container = document.createElement('div');
            var root = createRoot(container)
            act(() => {
                root.render(
                    <NavigationHandler stateNavigator={stateNavigator}>
                        <NavigationStack className="scene" />
                    </NavigationHandler>
                );
            });
            try {
                var scenes = container.querySelectorAll(".scene");
                assert.equal(scenes.length, 1);
                assert.notEqual(scenes[0].querySelector("#sceneA"), null);
            } finally {
                act(() => root.unmount());
            }
        });
    });

    describe('Server A', function () {
        var stateNavigator, html;
        var SceneA = () => <div id="sceneA" />;
        beforeEach(() => {
            stateNavigator = new StateNavigator([
                { key: 'sceneA' }
            ]);
            stateNavigator.navigate('sceneA');
        });
        describe('Static', () => {
            it('should render A', function(){
                var {sceneA} = stateNavigator.states;
                sceneA.renderScene = () => <SceneA />;
                html = ReactDOMServer.renderToString(
                    <NavigationHandler stateNavigator={stateNavigator}>
                        <NavigationMotion>
                            {(_style, scene, key) =>  (
                                <div className="scene" id={key} key={key}>{scene}</div>
                            )}
                        </NavigationMotion>
                    </NavigationHandler>
                );
                test();
            });
        });
        describe('Dynamic', () => {
            it('should render A', function(){
                html = ReactDOMServer.renderToString(
                    <NavigationHandler stateNavigator={stateNavigator}>
                        <NavigationMotion
                            renderMotion={(_style, scene, key) =>  (
                                <div className="scene" id={key} key={key}>{scene}</div>
                            )}>
                            <Scene stateKey="sceneA"><SceneA /></Scene>
                        </NavigationMotion>
                    </NavigationHandler>
                );
                test();
            });
        });
        describe('Static Stack', () => {
            it('should render A', function(){
                var {sceneA} = stateNavigator.states;
                sceneA.renderScene = () => <SceneA />;
                html = ReactDOMServer.renderToString(
                    <NavigationHandler stateNavigator={stateNavigator}>
                        <NavigationStack className="scene" />
                    </NavigationHandler>
                );
                test();
            });
        });
        describe('Dynamic Stack', () => {
            it('should render A', function(){
                html = ReactDOMServer.renderToString(
                    <NavigationHandler stateNavigator={stateNavigator}>
                        <NavigationStack className="scene">
                            <Scene stateKey="sceneA"><SceneA /></Scene>
                        </NavigationStack>
                    </NavigationHandler>
                );
                test();
            });
        });
        const test = () => {
            var container = document.createElement('div');
            container.innerHTML = html;
            var scenes = container.querySelectorAll(".scene");
            assert.equal(scenes.length, 1);
            assert.notEqual(scenes[0].querySelector("#sceneA"), null);
        };
    });

    describe('Stack class state', function () {
        var stateNavigator, root, container;
        var SceneA = () => <div id="sceneA" />;
        beforeEach(() => {
            stateNavigator = new StateNavigator([
                { key: 'sceneA' }
            ]);
            stateNavigator.navigate('sceneA');
            container = document.createElement('div');
            root = createRoot(container)
        });
        describe('Static Stack', () => {
            it('should render class', function(){
                var {sceneA} = stateNavigator.states;
                sceneA.renderScene = () => <SceneA />;
                act(() => {
                    root.render(
                        <NavigationHandler stateNavigator={stateNavigator}>
                            <NavigationStack className={(state) => (
                                state.key === 'sceneA' ? 'scene' : null
                            )} />
                        </NavigationHandler>
                    );
                });
                test();
            });
        });
        describe('Dynamic Stack', () => {
            it('should render class', function(){
                act(() => {
                    root.render(
                        <NavigationHandler stateNavigator={stateNavigator}>
                            <NavigationStack className={(state) => (
                                state.key === 'sceneA' ? 'scene' : null
                            )}>
                                <Scene stateKey="sceneA"><SceneA /></Scene>
                            </NavigationStack>
                        </NavigationHandler>
                    );
                });
                test();
            });
        });
        const test = () => {
            try {
                var scenes = container.querySelectorAll(".scene");
                assert.equal(scenes.length, 1);
                assert.notEqual(scenes[0].querySelector("#sceneA"), null);
            } finally {
                act(() => root.unmount());
            }
        };
    });

    describe('Dynamic Stack scene class state', function () {
        it('should render class', function(){
            var SceneA = () => <div id="sceneA" />;
            var stateNavigator = new StateNavigator([
                { key: 'sceneA' }
            ]);
            stateNavigator.navigate('sceneA');
            var container = document.createElement('div');
            var root = createRoot(container)
            act(() => {
                root.render(
                    <NavigationHandler stateNavigator={stateNavigator}>
                        <NavigationStack>
                            <Scene stateKey="sceneA" className="scene"><SceneA /></Scene>
                        </NavigationStack>
                    </NavigationHandler>
                );
            });
            try {
                var scenes = container.querySelectorAll(".scene");
                assert.equal(scenes.length, 1);
                assert.notEqual(scenes[0].querySelector("#sceneA"), null);
            } finally {
                act(() => root.unmount());
            }
        });
    });

    describe('Stack class data', function () {
        var stateNavigator, root, container;
        var SceneA = () => <div id="sceneA" />;
        beforeEach(() => {
            stateNavigator = new StateNavigator([
                { key: 'sceneA' }
            ]);
            stateNavigator.navigate('sceneA', {x: 1});
            container = document.createElement('div');
            root = createRoot(container)
        });
        describe('Static Stack', () => {
            it('should render class', function(){
                var {sceneA} = stateNavigator.states;
                sceneA.renderScene = () => <SceneA />;
                act(() => {
                    root.render(
                        <NavigationHandler stateNavigator={stateNavigator}>
                            <NavigationStack className={(_state, data) => (
                                data.x === 1 ? 'scene' : null
                            )} />
                        </NavigationHandler>
                    );
                });
                test();
            });
        });
        describe('Dynamic Stack', () => {
            it('should render class', function(){
                act(() => {
                    root.render(
                        <NavigationHandler stateNavigator={stateNavigator}>
                            <NavigationStack className={(_state, data) => (
                                data.x === 1 ? 'scene' : null
                            )}>
                                <Scene stateKey="sceneA"><SceneA /></Scene>
                            </NavigationStack>
                        </NavigationHandler>
                    );
                });
                test();
            });
        });
        const test = () => {
            try {
                var scenes = container.querySelectorAll(".scene");
                assert.equal(scenes.length, 1);
                assert.notEqual(scenes[0].querySelector("#sceneA"), null);
            } finally {
                act(() => root.unmount());
            }
        };
    });

    describe('Dynamic Stack scene class data', function () {
        it('should render class', function(){
            var SceneA = () => <div id="sceneA" />;
            var stateNavigator = new StateNavigator([
                { key: 'sceneA' }
            ]);
            stateNavigator.navigate('sceneA', {x: 1});
            var container = document.createElement('div');
            var root = createRoot(container)
            act(() => {
                root.render(
                    <NavigationHandler stateNavigator={stateNavigator}>
                        <NavigationStack>
                            <Scene stateKey="sceneA" className={(data) => (
                                data.x === 1 ? 'scene' : null
                            )}><SceneA /></Scene>
                        </NavigationStack>
                    </NavigationHandler>
                );
            });
            try {
                var scenes = container.querySelectorAll(".scene");
                assert.equal(scenes.length, 1);
                assert.notEqual(scenes[0].querySelector("#sceneA"), null);
            } finally {
                act(() => root.unmount());
            }
        });
    });

    describe('Stack class crumb', function () {
        var stateNavigator, root, container;
        var SceneA = () => <div id="sceneA" />;
        var SceneB = () => <div id="sceneB" />;
        beforeEach(() => {
            stateNavigator = new StateNavigator([
                { key: 'sceneA' },
                { key: 'sceneB', trackCrumbTrail: true },
            ]);
            stateNavigator.navigate('sceneA');
            container = document.createElement('div');
            root = createRoot(container)
        });
        describe('Static Stack', () => {
            it('should render class', async function(){
                var {sceneA, sceneB} = stateNavigator.states;
                sceneA.renderScene = () => <SceneA />;
                sceneB.renderScene = () => <SceneB />;
                act(() => {
                    root.render(
                        <NavigationHandler stateNavigator={stateNavigator}>
                            <NavigationStack className={(_state, _data, crumbs) => (
                                crumbs?.[0]?.state.key === 'sceneA' ? 'scene' : null
                            )} />
                        </NavigationHandler>
                    );
                });
                await test();
            });
        });
        describe('Dynamic Stack', () => {
            it('should render class', async function(){
                act(() => {
                    root.render(
                        <NavigationHandler stateNavigator={stateNavigator}>
                            <NavigationStack className={(_state, _data, crumbs) => (
                                crumbs?.[0]?.state.key === 'sceneA' ? 'scene' : null
                            )}>
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
            await act(async () => stateNavigator.navigate('sceneB'));
            try {
                var scenes = container.querySelectorAll(".scene");
                assert.equal(scenes.length, 1);
                assert.notEqual(container.querySelector("#sceneA"), null);
                assert.notEqual(scenes[0].querySelector("#sceneB"), null);
            } finally {
                act(() => root.unmount());
            }
        };
    });

    describe('Dynamic Stack scene class crumb', function () {
        it('should render class', async function(){
            var SceneA = () => <div id="sceneA" />;
            var SceneB = () => <div id="sceneB" />;
            var stateNavigator = new StateNavigator([
                { key: 'sceneA' },
                { key: 'sceneB', trackCrumbTrail: true },
            ]);
            stateNavigator.navigate('sceneA');
            var container = document.createElement('div');
            var root = createRoot(container)
            act(() => {
                root.render(
                    <NavigationHandler stateNavigator={stateNavigator}>
                        <NavigationStack>
                            <Scene stateKey="sceneA"><SceneA /></Scene>
                            <Scene stateKey="sceneB" className={(_data, crumbs) => (
                                crumbs?.[0]?.state.key === 'sceneA' ? 'scene' : null
                            )}><SceneB /></Scene>
                        </NavigationStack>
                    </NavigationHandler>
                );
            });
            await act(async () => stateNavigator.navigate('sceneB'));
            try {
                var scenes = container.querySelectorAll(".scene");
                assert.equal(scenes.length, 1);
                assert.notEqual(container.querySelector("#sceneA"), null);
                assert.notEqual(scenes[0].querySelector("#sceneB"), null);
            } finally {
                act(() => root.unmount());
            }
        });
    });

    describe('Dynamic Stack scene class override', function () {
        it('should render class', async function(){
            var SceneA = () => <div id="sceneA" />;
            var SceneB = () => <div id="sceneB" />;
            var stateNavigator = new StateNavigator([
                { key: 'sceneA' },
                { key: 'sceneB', trackCrumbTrail: true },
            ]);
            stateNavigator.navigate('sceneA');
            var container = document.createElement('div');
            var root = createRoot(container)
            act(() => {
                root.render(
                    <NavigationHandler stateNavigator={stateNavigator}>
                        <NavigationStack className="scene">
                            <Scene stateKey="sceneA"><SceneA /></Scene>
                            <Scene stateKey="sceneB" className="otherScene"><SceneB /></Scene>
                        </NavigationStack>
                    </NavigationHandler>
                );
            });
            await act(async () => stateNavigator.navigate('sceneB'));
            try {
                var scenes = container.querySelectorAll(".scene");
                assert.equal(scenes.length, 1);
                assert.notEqual(scenes[0].querySelector("#sceneA"), null);
                scenes = container.querySelectorAll(".otherScene");
                assert.equal(scenes.length, 1);
                assert.notEqual(scenes[0].querySelector("#sceneB"), null);
            } finally {
                act(() => root.unmount());
            }
        });
    });

    describe('Stack style state', function () {
        var stateNavigator, root, container;
        var SceneA = () => <div id="sceneA" />;
        beforeEach(() => {
            stateNavigator = new StateNavigator([
                { key: 'sceneA' }
            ]);
            stateNavigator.navigate('sceneA');
            container = document.createElement('div');
            root = createRoot(container)
        });
        describe('Static Stack', () => {
            it('should render style', function(){
                var {sceneA} = stateNavigator.states;
                sceneA.renderScene = () => <SceneA />;
                act(() => {
                    root.render(
                        <NavigationHandler stateNavigator={stateNavigator}>
                            <NavigationStack className="scene" style={(state) => (
                                state.key === 'sceneA' ? {backgroundColor: 'red'} : null
                            )} />
                        </NavigationHandler>
                    );
                });
                test();
            });
        });
        describe('Dynamic Stack', () => {
            it('should render style', function(){
                act(() => {
                    root.render(
                        <NavigationHandler stateNavigator={stateNavigator}>
                            <NavigationStack className="scene" style={(state) => (
                                state.key === 'sceneA' ? {backgroundColor: 'red'} : null
                            )}>
                                <Scene stateKey="sceneA"><SceneA /></Scene>
                            </NavigationStack>
                        </NavigationHandler>
                    );
                });
                test();
            });
        });
        const test = () => {
            try {
                var scenes = container.querySelectorAll(".scene");
                assert.equal(scenes.length, 1);
                assert.equal(scenes[0].style.backgroundColor, 'red');
            } finally {
                act(() => root.unmount());
            }
        };
    });

    describe('Dynamic Stack scene style state', function () {
        it('should render style', function(){
            var SceneA = () => <div id="sceneA" />;
            var stateNavigator = new StateNavigator([
                { key: 'sceneA' }
            ]);
            stateNavigator.navigate('sceneA');
            var container = document.createElement('div');
            var root = createRoot(container)
            act(() => {
                root.render(
                    <NavigationHandler stateNavigator={stateNavigator}>
                        <NavigationStack>
                            <Scene stateKey="sceneA" className="scene" style={{backgroundColor: 'red'}}><SceneA /></Scene>
                        </NavigationStack>
                    </NavigationHandler>
                );
            });
            try {
                var scenes = container.querySelectorAll(".scene") as any;
                assert.equal(scenes.length, 1);
                assert.notEqual(scenes[0].querySelector("#sceneA"), null);
                assert.equal(scenes[0].style.backgroundColor, 'red');
            } finally {
                act(() => root.unmount());
            }
        });
    });

    describe('Stack style data', function () {
        var stateNavigator, root, container;
        var SceneA = () => <div id="sceneA" />;
        beforeEach(() => {
            stateNavigator = new StateNavigator([
                { key: 'sceneA' }
            ]);
            stateNavigator.navigate('sceneA', {x: 1});
            container = document.createElement('div');
            root = createRoot(container)
        });
        describe('Static Stack', () => {
            it('should render style', function(){
                var {sceneA} = stateNavigator.states;
                sceneA.renderScene = () => <SceneA />;
                act(() => {
                    root.render(
                        <NavigationHandler stateNavigator={stateNavigator}>
                            <NavigationStack className="scene" style={(_state, data) => (
                                data.x === 1 ? {backgroundColor: 'red'} : null
                            )} />
                        </NavigationHandler>
                    );
                });
                test();
            });
        });
        describe('Dynamic Stack', () => {
            it('should render style', function(){
                act(() => {
                    root.render(
                        <NavigationHandler stateNavigator={stateNavigator}>
                            <NavigationStack className="scene" style={(_state, data) => (
                                data.x === 1 ? {backgroundColor: 'red'} : null
                            )}>
                                <Scene stateKey="sceneA"><SceneA /></Scene>
                            </NavigationStack>
                        </NavigationHandler>
                    );
                });
                test();
            });
        });
        const test = () => {
            try {
                var scenes = container.querySelectorAll(".scene");
                assert.equal(scenes.length, 1);
                assert.notEqual(scenes[0].querySelector("#sceneA"), null);
                assert.equal(scenes[0].style.backgroundColor, 'red');
            } finally {
                act(() => root.unmount());
            }
        };
    });

    describe('Dynamic Stack scene style data', function () {
        it('should render style', function(){
            var SceneA = () => <div id="sceneA" />;
            var stateNavigator = new StateNavigator([
                { key: 'sceneA' }
            ]);
            stateNavigator.navigate('sceneA', {x: 1});
            var container = document.createElement('div');
            var root = createRoot(container)
            act(() => {
                root.render(
                    <NavigationHandler stateNavigator={stateNavigator}>
                        <NavigationStack>
                            <Scene stateKey="sceneA" className="scene" style={(data) => (
                                data.x === 1 ? {backgroundColor: 'red'} : null
                            )}><SceneA /></Scene>
                        </NavigationStack>
                    </NavigationHandler>
                );
            });
            try {
                var scenes = container.querySelectorAll(".scene") as any;
                assert.equal(scenes.length, 1);
                assert.notEqual(scenes[0].querySelector("#sceneA"), null);
                assert.equal(scenes[0].style.backgroundColor, 'red');
            } finally {
                act(() => root.unmount());
            }
        });
    });

    describe('Stack style crumb', function () {
        var stateNavigator, root, container;
        var SceneA = () => <div id="sceneA" />;
        var SceneB = () => <div id="sceneB" />;
        beforeEach(() => {
            stateNavigator = new StateNavigator([
                { key: 'sceneA' },
                { key: 'sceneB', trackCrumbTrail: true },
            ]);
            stateNavigator.navigate('sceneA');
            container = document.createElement('div');
            root = createRoot(container)
        });
        describe('Static Stack', () => {
            it('should render style', async function(){
                var {sceneA, sceneB} = stateNavigator.states;
                sceneA.renderScene = () => <SceneA />;
                sceneB.renderScene = () => <SceneB />;
                act(() => {
                    root.render(
                        <NavigationHandler stateNavigator={stateNavigator}>
                            <NavigationStack className="scene" style={(_state, _data, crumbs) => (
                                crumbs?.[0]?.state.key === 'sceneA' ? {backgroundColor: 'red'} : null
                            )} />
                        </NavigationHandler>
                    );
                });
                await test();
            });
        });
        describe('Dynamic Stack', () => {
            it('should render style', async function(){
                act(() => {
                    root.render(
                        <NavigationHandler stateNavigator={stateNavigator}>
                            <NavigationStack className="scene" style={(_state, _data, crumbs) => (
                                crumbs?.[0]?.state.key === 'sceneA' ? {backgroundColor: 'red'} : null
                            )}>
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
            await act(async () => stateNavigator.navigate('sceneB'));
            try {
                var scenes = container.querySelectorAll(".scene");
                assert.equal(scenes.length, 2);
                assert.notEqual(container.querySelector("#sceneA"), null);
                assert.notEqual(container.querySelector("#sceneB"), null);
                assert.equal(scenes[1].style.backgroundColor, 'red');
            } finally {
                act(() => root.unmount());
            }
        };
    });

    describe('Dynamic Stack scene style crumb', function () {
        it('should render style', async function(){
            var SceneA = () => <div id="sceneA" />;
            var SceneB = () => <div id="sceneB" />;
            var stateNavigator = new StateNavigator([
                { key: 'sceneA' },
                { key: 'sceneB', trackCrumbTrail: true },
            ]);
            stateNavigator.navigate('sceneA');
            var container = document.createElement('div');
            var root = createRoot(container)
            act(() => {
                root.render(
                    <NavigationHandler stateNavigator={stateNavigator}>
                        <NavigationStack className="scene">
                            <Scene stateKey="sceneA"><SceneA /></Scene>
                            <Scene stateKey="sceneB" style={(_data, crumbs) => (
                                crumbs?.[0]?.state.key === 'sceneA' ? {backgroundColor: 'red'} : null
                            )}><SceneB /></Scene>
                        </NavigationStack>
                    </NavigationHandler>
                );
            });
            await act(async () => stateNavigator.navigate('sceneB'));
            try {
                var scenes = container.querySelectorAll(".scene") as any;
                assert.equal(scenes.length, 2);
                assert.notEqual(container.querySelector("#sceneA"), null);
                assert.notEqual(container.querySelector("#sceneB"), null);
                assert.equal(scenes[1].style.backgroundColor, 'red');
            } finally {
                act(() => root.unmount());
            }
        });
    });

    describe('Dynamic Stack scene style override', function () {
        it('should render style', async function(){
            var SceneA = () => <div id="sceneA" />;
            var SceneB = () => <div id="sceneB" />;
            var stateNavigator = new StateNavigator([
                { key: 'sceneA' },
                { key: 'sceneB', trackCrumbTrail: true },
            ]);
            stateNavigator.navigate('sceneA');
            var container = document.createElement('div');
            var root = createRoot(container)
            act(() => {
                root.render(
                    <NavigationHandler stateNavigator={stateNavigator}>
                        <NavigationStack className="scene" style={{backgroundColor: 'red'}}>
                            <Scene stateKey="sceneA"><SceneA /></Scene>
                            <Scene stateKey="sceneB" style={{backgroundColor: 'blue'}}><SceneB /></Scene>
                        </NavigationStack>
                    </NavigationHandler>
                );
            });
            await act(async () => stateNavigator.navigate('sceneB'));
            try {
                var scenes = container.querySelectorAll(".scene") as any;
                assert.equal(scenes.length, 2);
                assert.equal(scenes[0].style.backgroundColor, 'red');
                assert.equal(scenes[1].style.backgroundColor, 'blue');
            } finally {
                act(() => root.unmount());
            }
        });
    });
});
