import assert from 'assert';
import 'mocha';
import { StateNavigator } from 'navigation';
import { NavigationHandler } from 'navigation-react';
import { NavigationMotion, Scene } from 'navigation-react-mobile';
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

describe('NavigationMotion', function () {
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

        const test = () => {
            try {
                var scenes = container.querySelectorAll(".scene");
                assert.equal(scenes.length, 1);
                assert.equal(scenes[0].id, "0");
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
        const test = () => {
            try {
                var scenes = container.querySelectorAll(".scene");
                assert.equal(scenes.length, 2);
                assert.equal(scenes[0].id, "0");
                assert.equal(container.querySelector("#sceneA"), null);
                assert.equal(scenes[1].id, "1");
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
            it('should render A -> B', function(){
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
            it('should render A -> B', function(){
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
                assert.equal(scenes.length, 2);
                assert.equal(scenes[0].id, "0");
                assert.notEqual(scenes[0].querySelector("#sceneA"), null);
                assert.equal(scenes[1].id, "1");
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
                assert.equal(scenes[0].id, "0");
                assert.notEqual(scenes[0].querySelector("#sceneA"), null);
                assert.equal(container.querySelector("#sceneB"), null);
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
                stateNavigator.navigateBack(1);
            });
            try {
                var scenes = container.querySelectorAll(".scene");
                assert.equal(scenes.length, 1);
                assert.equal(scenes[0].id, "0");
                assert.notEqual(scenes[0].querySelector("#sceneA"), null);
                assert.equal(container.querySelector("#sceneB"), null);
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
        const test = () => {
            act(() => stateNavigator.navigate('sceneA'));
            try {
                var scenes = container.querySelectorAll(".scene");
                assert.equal(scenes.length, 1);
                assert.equal(scenes[0].id, "0");
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
                assert.equal(scenes[0].id, "0+");
                assert.notEqual(scenes[0].querySelector("#sceneB"), null);
                assert.equal(container.querySelector("#sceneA"), null);
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
                assert.equal(scenes[0].id, "0++");
                assert.notEqual(scenes[0].querySelector("#sceneC"), null);
                assert.equal(container.querySelector("#sceneA"), null);
                assert.equal(container.querySelector("#sceneB"), null);
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
                assert.equal(scenes[0].id, "0");
                assert.equal(scenes[1].id, "1");
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
                assert.equal(scenes[0].id, "0");
                assert.notEqual(scenes[0].querySelector("#sceneC"), null);
                assert.equal(container.querySelector("#sceneA"), null);
                assert.equal(container.querySelector("#sceneB"), null);
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
                assert.equal(scenes[0].id, "0");
                assert.notEqual(scenes[0].querySelector("#sceneA"), null);
                assert.equal(scenes[1].id, "1");
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
                assert.equal(scenes[0].id, "0");
                assert.notEqual(scenes[0].querySelector("#sceneC"), null);
                assert.equal(container.querySelector("#sceneA"), null);
                assert.equal(container.querySelector("#sceneB"), null);
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
                assert.equal(scenes[0].id, "0");
                assert.notEqual(scenes[0].querySelector("#sceneA"), null);
                assert.equal(scenes[1].id, "1+");
                assert.notEqual(scenes[1].querySelector("#sceneD"), null);
                assert.equal(container.querySelector("#sceneB"), null);
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
                assert.equal(scenes[0].id, "0");
                assert.notEqual(scenes[0].querySelector("#sceneA"), null);
                assert.equal(scenes[1].id, "1");
                assert.equal(scenes[2].id, "2");
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
        describe('Dynammic', () => {
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
                stateNavigator.navigateBack(1);
            });
            try {
                var scenes = container.querySelectorAll(".scene");
                assert.equal(scenes.length, 2);
                assert.equal(scenes[0].id, "0");
                assert.notEqual(scenes[0].querySelector("#sceneA"), null);
                assert.equal(scenes[1].id, "1");
                assert.notEqual(scenes[1].querySelector("#sceneB"), null);
                assert.equal(container.querySelector("#sceneC"), null);
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
                assert.equal(scenes[0].id, "0");
                assert.notEqual(scenes[0].querySelector("#sceneA"), null);
                assert.equal(scenes[1].id, "1");
                assert.equal(scenes[2].id, "2");
                assert.notEqual(scenes[2].querySelector("#sceneC"), null);
                assert.equal(container.querySelector("#sceneB"), null);
                assert.equal(container.querySelector("#sceneD"), null);
            } finally {
                act(() => root.unmount());
            }
        };
    });

    describe('A to A -> B -> C to A -> D -> C to A -> D', function () {
        it('should render A -> D', async function(){
            var stateNavigator = new StateNavigator([
                { key: 'sceneA' },
                { key: 'sceneB', trackCrumbTrail: true },
                { key: 'sceneC', trackCrumbTrail: true },
                { key: 'sceneD', trackCrumbTrail: true },
            ]);
            stateNavigator.navigate('sceneA');
            var {sceneA, sceneB, sceneC, sceneD} = stateNavigator.states;
            var SceneA = () => <div id="sceneA" />;
            var SceneB = () => <div id="sceneB" />;
            var SceneC = () => <div id="sceneC" />;
            var SceneD = () => <div id="sceneD" />;
            sceneA.renderScene = () => <SceneA />;
            sceneB.renderScene = () => <SceneB />;
            sceneC.renderScene = () => <SceneC />;
            sceneD.renderScene = () => <SceneD />;
            var container = document.createElement('div');
            const root = createRoot(container)
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
                stateNavigator.navigateBack(1);
            });
            try {
                var scenes = container.querySelectorAll(".scene");
                assert.equal(scenes.length, 2);
                assert.equal(scenes[0].id, "0");
                assert.notEqual(scenes[0].querySelector("#sceneA"), null);
                assert.equal(scenes[1].id, "1");
                assert.notEqual(scenes[1].querySelector("#sceneD"), null);
                assert.equal(container.querySelector("#sceneB"), null);
                assert.equal(container.querySelector("#sceneC"), null);
            } finally {
                act(() => root.unmount());
            }
        })
    });

    describe('A to A -> B -> C to A', function () {
        it('should render A', async function(){
            var stateNavigator = new StateNavigator([
                { key: 'sceneA' },
                { key: 'sceneB', trackCrumbTrail: true },
                { key: 'sceneC', trackCrumbTrail: true },
            ]);
            stateNavigator.navigate('sceneA');
            var {sceneA, sceneB, sceneC} = stateNavigator.states;
            var SceneA = () => <div id="sceneA" />;
            var SceneB = () => <div id="sceneB" />;
            var SceneC = () => <div id="sceneC" />;
            sceneA.renderScene = () => <SceneA />;
            sceneB.renderScene = () => <SceneB />;
            sceneC.renderScene = () => <SceneC />;
            var container = document.createElement('div');
            const root = createRoot(container)
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
            await act(async () => {
                var url = stateNavigator.fluent(true)
                    .navigate('sceneB')
                    .navigate('sceneC').url;
                stateNavigator.navigateLink(url);
                stateNavigator.navigateBack(2);
            });
            try {
                var scenes = container.querySelectorAll(".scene");
                assert.equal(scenes.length, 1);
                assert.equal(scenes[0].id, "0");
                assert.notEqual(scenes[0].querySelector("#sceneA"), null);
                assert.equal(container.querySelector("#sceneB"), null);
                assert.equal(container.querySelector("#sceneC"), null);
            } finally {
                act(() => root.unmount());
            }
        })
    });

    describe('A -> B -> C to A', function () {
        it('should render A', async function(){
            var stateNavigator = new StateNavigator([
                { key: 'sceneA' },
                { key: 'sceneB', trackCrumbTrail: true },
                { key: 'sceneC', trackCrumbTrail: true },
            ]);
            stateNavigator.navigate('sceneA');
            stateNavigator.navigate('sceneB');
            stateNavigator.navigate('sceneC');
            var {sceneA, sceneB, sceneC} = stateNavigator.states;
            var SceneA = () => <div id="sceneA" />;
            var SceneB = () => <div id="sceneB" />;
            var SceneC = () => <div id="sceneC" />;
            sceneA.renderScene = () => <SceneA />;
            sceneB.renderScene = () => <SceneB />;
            sceneC.renderScene = () => <SceneC />;
            var container = document.createElement('div');
            const root = createRoot(container)
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
            await act(async () => stateNavigator.navigateBack(2));
            try {
                var scenes = container.querySelectorAll(".scene");
                assert.equal(scenes.length, 1);
                assert.equal(scenes[0].id, "0");
                assert.notEqual(scenes[0].querySelector("#sceneA"), null);
                assert.equal(container.querySelector("#sceneB"), null);
                assert.equal(container.querySelector("#sceneC"), null);
            } finally {
                act(() => root.unmount());
            }
        })
    });

    describe('A -> B -> C to B', function () {
        it('should render B', async function(){
            var stateNavigator = new StateNavigator([
                { key: 'sceneA' },
                { key: 'sceneB', trackCrumbTrail: true },
                { key: 'sceneC', trackCrumbTrail: true },
            ]);
            stateNavigator.navigate('sceneA');
            stateNavigator.navigate('sceneB');
            stateNavigator.navigate('sceneC');
            var {sceneA, sceneB, sceneC} = stateNavigator.states;
            var SceneA = () => <div id="sceneA" />;
            var SceneB = () => <div id="sceneB" />;
            var SceneC = () => <div id="sceneC" />;
            sceneA.renderScene = () => <SceneA />;
            sceneB.renderScene = () => <SceneB />;
            sceneC.renderScene = () => <SceneC />;
            var container = document.createElement('div');
            const root = createRoot(container)
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
            await act(async () => {
                var url = stateNavigator.fluent()
                    .navigate('sceneB').url;
                stateNavigator.navigateLink(url);
            });
            try {
                var scenes = container.querySelectorAll(".scene");
                assert.equal(scenes.length, 1);
                assert.equal(scenes[0].id, "0");
                assert.notEqual(scenes[0].querySelector("#sceneB"), null);
                assert.equal(container.querySelector("#sceneA"), null);
                assert.equal(container.querySelector("#sceneC"), null);
            } finally {
                act(() => root.unmount());
            }
        })
    });

    describe('A to A -> A', function () {
        it('should render A -> A', function(){
            var stateNavigator = new StateNavigator([
                { key: 'sceneA', trackCrumbTrail: true }
            ]);
            stateNavigator.navigate('sceneA');
            var {sceneA} = stateNavigator.states;
            var SceneA = () => <div id="sceneA" />;
            sceneA.renderScene = () => <SceneA />;
            var container = document.createElement('div');
            const root = createRoot(container)
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
            act(() => stateNavigator.navigate('sceneA'));
            try {
                var scenes = container.querySelectorAll(".scene");
                assert.equal(scenes.length, 2);
                assert.equal(scenes[0].id, "0");
                assert.notEqual(scenes[0].querySelector("#sceneA"), null);
                assert.equal(scenes[1].id, "1");
                assert.notEqual(scenes[1].querySelector("#sceneA"), null);
            } finally {
                act(() => root.unmount());
            }
        })
    });

    describe('A to A -> A to A -> B', function () {
        it('should render A -> B+', async function(){
            var stateNavigator = new StateNavigator([
                { key: 'sceneA', trackCrumbTrail: true },
                { key: 'sceneB', trackCrumbTrail: true },
            ]);
            stateNavigator.navigate('sceneA');
            var {sceneA, sceneB} = stateNavigator.states;
            var SceneA = () => <div id="sceneA" />;
            var SceneB = () => <div id="sceneB" />;
            sceneA.renderScene = () => <SceneA />;
            sceneB.renderScene = () => <SceneB />;
            var container = document.createElement('div');
            const root = createRoot(container)
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
                assert.equal(scenes[0].id, "0");
                assert.notEqual(scenes[0].querySelector("#sceneA"), null);
                assert.equal(scenes[1].id, "1+");
                assert.notEqual(scenes[1].querySelector("#sceneB"), null);
            } finally {
                act(() => root.unmount());
            }
        })
    });

    describe('A to A -> A to A -> B to A -> B -> C to A -> B to A -> C', function () {
        it('should render A -> C++', async function(){
            var stateNavigator = new StateNavigator([
                { key: 'sceneA', trackCrumbTrail: true },
                { key: 'sceneB', trackCrumbTrail: true },
                { key: 'sceneC', trackCrumbTrail: true },
            ]);
            stateNavigator.navigate('sceneA');
            var {sceneA, sceneB, sceneC} = stateNavigator.states;
            var SceneA = () => <div id="sceneA" />;
            var SceneB = () => <div id="sceneB" />;
            var SceneC = () => <div id="sceneC" />;
            sceneA.renderScene = () => <SceneA />;
            sceneB.renderScene = () => <SceneB />;
            sceneC.renderScene = () => <SceneC />;
            var container = document.createElement('div');
            const root = createRoot(container)
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
                assert.equal(scenes[0].id, "0");
                assert.notEqual(scenes[0].querySelector("#sceneA"), null);
                assert.equal(scenes[1].id, "1++");
                assert.notEqual(scenes[1].querySelector("#sceneC"), null);
                assert.equal(container.querySelector("#sceneB"), null);
            } finally {
                act(() => root.unmount());
            }
        })
    });

    describe('Set state', function () {
        it('should render', function(){
            var stateNavigator = new StateNavigator([
                { key: 'sceneA' },
                { key: 'sceneB', trackCrumbTrail: true },
            ]);
            stateNavigator.navigate('sceneA');
            var {sceneA, sceneB} = stateNavigator.states;
            var update;
            var SceneA = () => <div id="sceneA" />;
            var SceneB = () => {
                var [updated, setUpdated] = useState(false)
                update = setUpdated;
                return <div id='sceneB' data-updated={updated} />;
            };
            sceneA.renderScene = () => <SceneA />;
            sceneB.renderScene = () => <SceneB />;
            var container = document.createElement('div');
            var root = createRoot(container)
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
        })
    });

    describe('Crumb set state', function () {
        it('should not render', function(){
            var stateNavigator = new StateNavigator([
                { key: 'sceneA' },
                { key: 'sceneB', trackCrumbTrail: true },
            ]);
            stateNavigator.navigate('sceneA');
            var {sceneA, sceneB} = stateNavigator.states;
            var update;
            var SceneA = () => {
                var [updated, setUpdated] = useState(false)
                update = setUpdated;
                return <div id='sceneA' data-updated={updated} />;
            };
            var SceneB = () => <div id="sceneB" />;
            sceneA.renderScene = () => <SceneA />;
            sceneB.renderScene = () => <SceneB />;
            var container = document.createElement('div');
            var root = createRoot(container)
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
        })
    });

    describe('Crumb set state navigate back', function () {
        it('should render', async function(){
            var stateNavigator = new StateNavigator([
                { key: 'sceneA' },
                { key: 'sceneB', trackCrumbTrail: true },
            ]);
            stateNavigator.navigate('sceneA');
            var {sceneA, sceneB} = stateNavigator.states;
            var update;
            var SceneA = () => {
                var [updated, setUpdated] = useState(false)
                update = setUpdated;
                return <div id='sceneA' data-updated={updated} />;
            };
            var SceneB = () => <div id="sceneB" />;
            sceneA.renderScene = () => <SceneA />;
            sceneB.renderScene = () => <SceneB />;
            var container = document.createElement('div');
            var root = createRoot(container)
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
            await act(async () => {
                stateNavigator.navigate('sceneB');
                update(true);
                stateNavigator.navigateBack(1);
            });
            try {
                var scene = container.querySelector<HTMLDivElement>("#sceneA");
                assert.strictEqual(scene.dataset.updated, 'true');
            } finally {
                act(() => root.unmount());
            }
        })
    });

    describe('Re-render NavigationStack', function () {
        it('should only re-render current scene', async function(){
            var stateNavigator = new StateNavigator([
                { key: 'sceneA' },
                { key: 'sceneB', trackCrumbTrail: true },
            ]);
            stateNavigator.navigate('sceneA');
            var {sceneA, sceneB} = stateNavigator.states;
            var SceneA = ({updated}) => <div id='sceneA' data-updated={updated} />;
            var SceneB = ({updated}) => <div id='sceneB' data-updated={updated} />;
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
});
