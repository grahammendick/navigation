import assert from 'assert';
import mocha from 'mocha';
import { StateNavigator } from 'navigation';
import { NavigationHandler } from 'navigation-react';
import { NavigationMotion, useSceneNavigated } from 'navigation-react-mobile';
import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { act } from 'react-dom/test-utils';
import { JSDOM } from 'jsdom';

declare var global: any;
var { window } = new JSDOM('<!doctype html><html><body></body></html>', { pretendToBeVisual: true });
window.addEventListener = () => {};
global.window = window;
global.document = window.document;

describe('UseSceneNavigated', function () {
    describe('A', function () {
        it('should call navigating hook', function(){
            var stateNavigator = new StateNavigator([
                { key: 'sceneA' }
            ]);
            stateNavigator.navigate('sceneA');
            var {sceneA} = stateNavigator.states;
            var navigatingA = false;
            var SceneA = () => {
                useSceneNavigated(() => {
                    navigatingA = true;
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
            try {
                assert.equal(navigatingA, true);
            } finally {
                ReactDOM.unmountComponentAtNode(container);
            }
        })
    });

    describe('AA', function () {
        it('should not call navigating hook', function(){
            var stateNavigator = new StateNavigator([
                { key: 'sceneA' }
            ]);
            stateNavigator.navigate('sceneA');
            var {sceneA} = stateNavigator.states;
            var navigatingA = false;
            var setCountA;
            var SceneA = () => {
                var [count, setCount]  = useState(0);
                setCountA = setCount;
                useSceneNavigated(() => {
                    navigatingA = true;
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
            navigatingA = false;
            setCountA(1);
            try {
                assert.equal(navigatingA, false);
            } finally {
                ReactDOM.unmountComponentAtNode(container);
            }
        })
    });

    describe('A to A -> B', function () {
        it('should call navigating hook on B and not on A', function(){
            var stateNavigator = new StateNavigator([
                { key: 'sceneA' },
                { key: 'sceneB', trackCrumbTrail: true }
            ]);
            stateNavigator.navigate('sceneA');
            var {sceneA, sceneB} = stateNavigator.states;
            var navigatingA, navigatingB = false;
            var SceneA = () => {
                useSceneNavigated(() => {
                    navigatingA = true;
                })
                return <div />;
            };
            var SceneB = () => {
                useSceneNavigated(() => {
                    navigatingB = true;
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
            navigatingA = navigatingB = false;
            stateNavigator.navigate('sceneB');
            try {
                assert.equal(navigatingA, false);
                assert.equal(navigatingB, true);
            } finally {
                ReactDOM.unmountComponentAtNode(container);
            }
        })
    });

    describe('A -> B to A', function () {
        it('should call navigating hook on A and not on B', function(){
            var stateNavigator = new StateNavigator([
                { key: 'sceneA' },
                { key: 'sceneB', trackCrumbTrail: true }
            ]);
            stateNavigator.navigate('sceneA');
            var {sceneA, sceneB} = stateNavigator.states;
            var navigatingA, navigatingB = false;
            var SceneA = () => {
                useSceneNavigated(() => {
                    navigatingA = true;
                })
                return <div />;
            };
            var SceneB = () => {
                useSceneNavigated(() => {
                    navigatingB = true;
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
            stateNavigator.navigate('sceneB');
            navigatingA = navigatingB = false;
            stateNavigator.navigate('sceneA');
            try {
                assert.equal(navigatingA, true);
                assert.equal(navigatingB, false);
            } finally {
                ReactDOM.unmountComponentAtNode(container);
            }
        })
    });

    describe('A to A', function () {
        it('should call navigating hook', function(){
            var stateNavigator = new StateNavigator([
                { key: 'sceneA' }
            ]);
            stateNavigator.navigate('sceneA');
            var {sceneA} = stateNavigator.states;
            var navigatingA = false;
            var SceneA = () => {
                useSceneNavigated(() => {
                    navigatingA = true;
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
            navigatingA = false;
            stateNavigator.navigate('sceneA');
            try {
                assert.equal(navigatingA, true);
            } finally {
                ReactDOM.unmountComponentAtNode(container);
            }
        })
    });

    describe('A to B', function () {
        it('should call navigating hook on B and not on A', function(){
            var stateNavigator = new StateNavigator([
                { key: 'sceneA' },
                { key: 'sceneB' }
            ]);
            stateNavigator.navigate('sceneA');
            var {sceneA, sceneB} = stateNavigator.states;
            var navigatingA, navigatingB = false;
            var SceneA = () => {
                useSceneNavigated(() => {
                    navigatingA = true;
                })
                return <div />;
            };
            var SceneB = () => {
                useSceneNavigated(() => {
                    navigatingB = true;
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
            navigatingA = navigatingB = false;
            stateNavigator.navigate('sceneB');
            try {
                assert.equal(navigatingA, false);
                assert.equal(navigatingB, true);
            } finally {
                ReactDOM.unmountComponentAtNode(container);
            }
        })
    });

    describe('A -> B to C -> B', function () {
        it('should call navigating hook on B and not on A or C', function(){
            var stateNavigator = new StateNavigator([
                { key: 'sceneA' },
                { key: 'sceneB', trackCrumbTrail: true },
                { key: 'sceneC' }
            ]);
            stateNavigator.navigate('sceneA');
            var {sceneA, sceneB, sceneC} = stateNavigator.states;
            var navigatingA, navigatingB, navigatingC = false;
            var SceneA = () => {
                useSceneNavigated(() => {
                    navigatingA = true;
                })
                return <div />;
            };
            var SceneB = () => {
                useSceneNavigated(() => {
                    navigatingB = true;
                })
                return <div />;
            };
            var SceneC = () => {
                useSceneNavigated(() => {
                    navigatingC = true;
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
            });
            stateNavigator.navigate('sceneB');
            navigatingA = navigatingB = navigatingC = false;
            var url = stateNavigator.fluent()
                .navigate('sceneC')
                .navigate('sceneB').url;
            stateNavigator.navigateLink(url);
            try {
                assert.equal(navigatingA, false);
                assert.equal(navigatingB, true);
                assert.equal(navigatingC, false);
            } finally {
                ReactDOM.unmountComponentAtNode(container);
            }
        })
    });

    describe('A -> B to C -> D', function () {
        it('should call navigating hook on D and not on A, B or C', function(){
            var stateNavigator = new StateNavigator([
                { key: 'sceneA' },
                { key: 'sceneB', trackCrumbTrail: true },
                { key: 'sceneC' },
                { key: 'sceneD', trackCrumbTrail: true }
            ]);
            stateNavigator.navigate('sceneA');
            var {sceneA, sceneB, sceneC, sceneD} = stateNavigator.states;
            var navigatingA, navigatingB, navigatingC, navigatingD = false;
            var SceneA = () => {
                useSceneNavigated(() => {
                    navigatingA = true;
                })
                return <div />;
            };
            var SceneB = () => {
                useSceneNavigated(() => {
                    navigatingB = true;
                })
                return <div />;
            };
            var SceneC = () => {
                useSceneNavigated(() => {
                    navigatingC = true;
                })
                return <div />;
            };
            var SceneD = () => {
                useSceneNavigated(() => {
                    navigatingD = true;
                })
                return <div />;
            };
            sceneA.renderScene = () => <SceneA />;
            sceneB.renderScene = () => <SceneB />;
            sceneC.renderScene = () => <SceneC />;
            sceneD.renderScene = () => <SceneD />;
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
            stateNavigator.navigate('sceneB');
            navigatingA = navigatingB = navigatingC = navigatingD = false;
            var url = stateNavigator.fluent()
                .navigate('sceneC')
                .navigate('sceneD').url;
            stateNavigator.navigateLink(url);
            try {
                assert.equal(navigatingA, false);
                assert.equal(navigatingB, false);
                assert.equal(navigatingC, false);
                assert.equal(navigatingD, true);
            } finally {
                ReactDOM.unmountComponentAtNode(container);
            }
        })
    });
});
