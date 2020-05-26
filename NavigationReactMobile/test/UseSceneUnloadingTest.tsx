import assert from 'assert';
import 'mocha';
import { StateNavigator } from 'navigation';
import { NavigationContext, NavigationHandler } from 'navigation-react';
import { NavigationMotion, useSceneUnloading } from 'navigation-react-mobile';
import React, { useState, useContext } from 'react';
import ReactDOM from 'react-dom';
import { act } from 'react-dom/test-utils';
import { JSDOM } from 'jsdom';

declare var global: any;
var { window } = new JSDOM('<!doctype html><html><body></body></html>', { pretendToBeVisual: true });
window.addEventListener = () => {};
global.window = window;
global.document = window.document;

describe('UseSceneUnloading', function () {
    describe('A', function () {
        it('should not call unloading hook', function(){
            var stateNavigator = new StateNavigator([
                { key: 'sceneA' }
            ]);
            stateNavigator.navigate('sceneA');
            var {sceneA} = stateNavigator.states;
            var unloadingA;
            var SceneA = () => {
                useSceneUnloading(() => {
                    unloadingA = true;
                    return true;
                })
                return <div />;
            };
            sceneA.renderScene = () => <SceneA />;
            var container = document.createElement('div');
            act(() => {
                unloadingA = false;
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
                assert.equal(unloadingA, false);
            } finally {
                ReactDOM.unmountComponentAtNode(container);
            }
        })
    });

    describe('A -> B', function () {
        it('should not call unloading hook on on A or B', function(){
            var stateNavigator = new StateNavigator([
                { key: 'sceneA' },
                { key: 'sceneB', trackCrumbTrail: true }
            ]);
            stateNavigator.navigate('sceneA');
            stateNavigator.navigate('sceneB');
            var {sceneA, sceneB} = stateNavigator.states;
            var unloadingA, unloadingB;
            var SceneA = () => {
                useSceneUnloading(() => {
                    unloadingA = true;
                    return true;
                })
                return <div />;
            };
            var SceneB = () => {
                useSceneUnloading(() => {
                    unloadingB = true;
                    return true;
                })
                return <div />;
            };
            sceneA.renderScene = () => <SceneA />;
            sceneB.renderScene = () => <SceneB />;
            var container = document.createElement('div');
            act(() => {
                unloadingA = unloadingB = false;
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
                assert.equal(unloadingA, false);
                assert.equal(unloadingB, false);
            } finally {
                ReactDOM.unmountComponentAtNode(container);
            }
        })
    });

    describe('A to A -> B', function () {
        it('should call unloading hook on A and not B', function(){
            var stateNavigator = new StateNavigator([
                { key: 'sceneA' },
                { key: 'sceneB', trackCrumbTrail: true }
            ]);
            stateNavigator.navigate('sceneA');
            var {sceneA, sceneB} = stateNavigator.states;
            var unloadingA, unloadingB;
            var SceneA = () => {
                useSceneUnloading(() => {
                    unloadingA = true;
                    return true;
                })
                return <div />;
            };
            var SceneB = () => {
                useSceneUnloading(() => {
                    unloadingB = true;
                    return true;
                })
                return <div />;
            };
            sceneA.renderScene = () => <SceneA />;
            sceneB.renderScene = () => <SceneB />;
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
            act(() => {
                unloadingA = unloadingB = false;
                stateNavigator.navigate('sceneB');
            });
            try {
                assert.equal(unloadingA, true);
                assert.equal(unloadingB, false);
            } finally {
                ReactDOM.unmountComponentAtNode(container);
            }
        })
    });

    describe('A -> B to A', function () {
        it('should call unloading hook on B and not on A', function(){
            var stateNavigator = new StateNavigator([
                { key: 'sceneA' },
                { key: 'sceneB', trackCrumbTrail: true }
            ]);
            stateNavigator.navigate('sceneA');
            var {sceneA, sceneB} = stateNavigator.states;
            var unloadingA, unloadingB;
            var SceneA = () => {
                useSceneUnloading(() => {
                    unloadingA = true;
                    return true;
                })
                return <div />;
            };
            var SceneB = () => {
                useSceneUnloading(() => {
                    unloadingB = true;
                    return true;
                })
                return <div />;
            };
            sceneA.renderScene = () => <SceneA />;
            sceneB.renderScene = () => <SceneB />;
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
                stateNavigator.navigate('sceneB');
            });
            act(() => {
                unloadingA = unloadingB = false;
                stateNavigator.navigateBack(1);
            });
            try {
                assert.equal(unloadingA, false);
                assert.equal(unloadingB, true);
            } finally {
                ReactDOM.unmountComponentAtNode(container);
            }
        })
    });

    describe('A to A', function () {
        it('should not call unloading hook', function(){
            var stateNavigator = new StateNavigator([
                { key: 'sceneA' }
            ]);
            stateNavigator.navigate('sceneA');
            var {sceneA} = stateNavigator.states;
            var unloadingA;
            var SceneA = () => {
                useSceneUnloading(() => {
                    unloadingA = true;
                    return true;
                })
                return <div />;
            };
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
            act(() => {
                unloadingA = false;
                stateNavigator.navigate('sceneA');
            });
            try {
                assert.equal(unloadingA, false);
            } finally {
                ReactDOM.unmountComponentAtNode(container);
            }
        })
    });

    describe('A to B', function () {
        it('should call unloading hook on A and not on B', function(){
            var stateNavigator = new StateNavigator([
                { key: 'sceneA' },
                { key: 'sceneB' }
            ]);
            stateNavigator.navigate('sceneA');
            var {sceneA, sceneB} = stateNavigator.states;
            var unloadingA, unloadingB;
            var SceneA = () => {
                useSceneUnloading(() => {
                    unloadingA = true;
                    return true;
                })
                return <div />;
            };
            var SceneB = () => {
                useSceneUnloading(() => {
                    unloadingB = true;
                    return true;
                })
                return <div />;
            };
            sceneA.renderScene = () => <SceneA />;
            sceneB.renderScene = () => <SceneB />;
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
            act(() => {
                unloadingA = unloadingB = false;
                stateNavigator.navigate('sceneB');
            });
            try {
                assert.equal(unloadingA, true);
                assert.equal(unloadingB, false);
            } finally {
                ReactDOM.unmountComponentAtNode(container);
            }
        })
    });

    describe('A -> B to C -> B', function () {
        it('should not call unloading hook on A, B or C', function(){
            var stateNavigator = new StateNavigator([
                { key: 'sceneA' },
                { key: 'sceneB', trackCrumbTrail: true },
                { key: 'sceneC' }
            ]);
            stateNavigator.navigate('sceneA');
            var {sceneA, sceneB, sceneC} = stateNavigator.states;
            var unloadingA, unloadingB, unloadingC;
            var SceneA = () => {
                useSceneUnloading(() => {
                    unloadingA = true;
                    return true;
                })
                return <div />;
            };
            var SceneB = () => {
                useSceneUnloading(() => {
                    unloadingB = true;
                    return true;
                })
                return <div />;
            };
            var SceneC = () => {
                useSceneUnloading(() => {
                    unloadingC = true;
                    return true;
                })
                return <div />;
            };
            sceneA.renderScene = () => <SceneA />;
            sceneB.renderScene = () => <SceneB />;
            sceneC.renderScene = () => <SceneC />;
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
                stateNavigator.navigate('sceneB');
            });
            act(() => {
                unloadingA = unloadingB = unloadingC = false;
                var url = stateNavigator.fluent()
                    .navigate('sceneC')
                    .navigate('sceneB').url;
                stateNavigator.navigateLink(url);
            });
            try {
                assert.equal(unloadingA, false);
                assert.equal(unloadingB, false);
                assert.equal(unloadingC, false);
            } finally {
                ReactDOM.unmountComponentAtNode(container);
            }
        })
    });
});
