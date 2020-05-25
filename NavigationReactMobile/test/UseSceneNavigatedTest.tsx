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
        it('should call navigated hook', function(){
            var stateNavigator = new StateNavigator([
                { key: 'sceneA' }
            ]);
            stateNavigator.navigate('sceneA');
            var {sceneA} = stateNavigator.states;
            var navigatedA;
            var SceneA = () => {
                useSceneNavigated(() => {
                    navigatedA = true;
                })
                return <div />;
            };
            sceneA.renderScene = () => <SceneA />;
            var container = document.createElement('div');
            act(() => {
                navigatedA = false;
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
                assert.equal(navigatedA, true);
            } finally {
                ReactDOM.unmountComponentAtNode(container);
            }
        })
    });

    describe('A -> B', function () {
        it('should call navigated hook on B and not on A', function(){
            var stateNavigator = new StateNavigator([
                { key: 'sceneA' },
                { key: 'sceneB', trackCrumbTrail: true }
            ]);
            stateNavigator.navigate('sceneA');
            stateNavigator.navigate('sceneB');
            var {sceneA, sceneB} = stateNavigator.states;
            var navigatedA, navigatedB;
            var SceneA = () => {
                useSceneNavigated(() => {
                    navigatedA = true;
                })
                return <div />;
            };
            var SceneB = () => {
                useSceneNavigated(() => {
                    navigatedB = true;
                })
                return <div />;
            };
            sceneA.renderScene = () => <SceneA />;
            sceneB.renderScene = () => <SceneB />;
            var container = document.createElement('div');
            act(() => {
                navigatedA = navigatedB = false;
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
                assert.equal(navigatedA, false);
                assert.equal(navigatedB, true);
            } finally {
                ReactDOM.unmountComponentAtNode(container);
            }
        })
    });

    describe('AA', function () {
        it('should not call navigated hook', function(){
            var stateNavigator = new StateNavigator([
                { key: 'sceneA' }
            ]);
            stateNavigator.navigate('sceneA');
            var {sceneA} = stateNavigator.states;
            var navigatedA;
            var setCountA;
            var SceneA = () => {
                var [count, setCount]  = useState(0);
                setCountA = setCount;
                useSceneNavigated(() => {
                    navigatedA = true;
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
                navigatedA = false;
                setCountA(1);
            });
            try {
                assert.equal(navigatedA, false);
            } finally {
                ReactDOM.unmountComponentAtNode(container);
            }
        })
    });

    describe('A to A -> B', function () {
        it('should call navigated hook on B and not on A', function(){
            var stateNavigator = new StateNavigator([
                { key: 'sceneA' },
                { key: 'sceneB', trackCrumbTrail: true }
            ]);
            stateNavigator.navigate('sceneA');
            var {sceneA, sceneB} = stateNavigator.states;
            var navigatedA, navigatedB;
            var SceneA = () => {
                useSceneNavigated(() => {
                    navigatedA = true;
                })
                return <div />;
            };
            var SceneB = () => {
                useSceneNavigated(() => {
                    navigatedB = true;
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
                navigatedA = navigatedB = false;
                stateNavigator.navigate('sceneB');
            });
            try {
                assert.equal(navigatedA, false);
                assert.equal(navigatedB, true);
            } finally {
                ReactDOM.unmountComponentAtNode(container);
            }
        })
    });

    describe('A -> B to A', function () {
        it('should call navigated hook on A and not on B', function(){
            var stateNavigator = new StateNavigator([
                { key: 'sceneA' },
                { key: 'sceneB', trackCrumbTrail: true }
            ]);
            stateNavigator.navigate('sceneA');
            var {sceneA, sceneB} = stateNavigator.states;
            var navigatedA, navigatedB;
            var SceneA = () => {
                useSceneNavigated(() => {
                    navigatedA = true;
                })
                return <div />;
            };
            var SceneB = () => {
                useSceneNavigated(() => {
                    navigatedB = true;
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
                navigatedA = navigatedB = false;
                stateNavigator.navigate('sceneA');
            });
            try {
                assert.equal(navigatedA, true);
                assert.equal(navigatedB, false);
            } finally {
                ReactDOM.unmountComponentAtNode(container);
            }
        })
    });

    describe('A to A', function () {
        it('should call navigated hook', function(){
            var stateNavigator = new StateNavigator([
                { key: 'sceneA' }
            ]);
            stateNavigator.navigate('sceneA');
            var {sceneA} = stateNavigator.states;
            var navigatedA;
            var SceneA = () => {
                useSceneNavigated(() => {
                    navigatedA = true;
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
                navigatedA = false;
                stateNavigator.navigate('sceneA');
            });
            try {
                assert.equal(navigatedA, true);
            } finally {
                ReactDOM.unmountComponentAtNode(container);
            }
        })
    });

    describe('A to B', function () {
        it('should call navigated hook on B and not on A', function(){
            var stateNavigator = new StateNavigator([
                { key: 'sceneA' },
                { key: 'sceneB' }
            ]);
            stateNavigator.navigate('sceneA');
            var {sceneA, sceneB} = stateNavigator.states;
            var navigatedA, navigatedB;
            var SceneA = () => {
                useSceneNavigated(() => {
                    navigatedA = true;
                })
                return <div />;
            };
            var SceneB = () => {
                useSceneNavigated(() => {
                    navigatedB = true;
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
                navigatedA = navigatedB = false;
                stateNavigator.navigate('sceneB');
            });
            try {
                assert.equal(navigatedA, false);
                assert.equal(navigatedB, true);
            } finally {
                ReactDOM.unmountComponentAtNode(container);
            }
        })
    });

    describe('A -> B to C -> B', function () {
        it('should call navigated hook on B and not on A or C', function(){
            var stateNavigator = new StateNavigator([
                { key: 'sceneA' },
                { key: 'sceneB', trackCrumbTrail: true },
                { key: 'sceneC' }
            ]);
            stateNavigator.navigate('sceneA');
            var {sceneA, sceneB, sceneC} = stateNavigator.states;
            var navigatedA, navigatedB, navigatedC;
            var SceneA = () => {
                useSceneNavigated(() => {
                    navigatedA = true;
                })
                return <div />;
            };
            var SceneB = () => {
                useSceneNavigated(() => {
                    navigatedB = true;
                })
                return <div />;
            };
            var SceneC = () => {
                useSceneNavigated(() => {
                    navigatedC = true;
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
                navigatedA = navigatedB = navigatedC = false;
                var url = stateNavigator.fluent()
                    .navigate('sceneC')
                    .navigate('sceneB').url;
                stateNavigator.navigateLink(url);
            });
            try {
                assert.equal(navigatedA, false);
                assert.equal(navigatedB, true);
                assert.equal(navigatedC, false);
            } finally {
                ReactDOM.unmountComponentAtNode(container);
            }
        })
    });

    describe('A -> B to C -> D', function () {
        it('should call navigated hook on D and not on A, B or C', function(){
            var stateNavigator = new StateNavigator([
                { key: 'sceneA' },
                { key: 'sceneB', trackCrumbTrail: true },
                { key: 'sceneC' },
                { key: 'sceneD', trackCrumbTrail: true }
            ]);
            stateNavigator.navigate('sceneA');
            var {sceneA, sceneB, sceneC, sceneD} = stateNavigator.states;
            var navigatedA, navigatedB, navigatedC, navigatedD;
            var SceneA = () => {
                useSceneNavigated(() => {
                    navigatedA = true;
                })
                return <div />;
            };
            var SceneB = () => {
                useSceneNavigated(() => {
                    navigatedB = true;
                })
                return <div />;
            };
            var SceneC = () => {
                useSceneNavigated(() => {
                    navigatedC = true;
                })
                return <div />;
            };
            var SceneD = () => {
                useSceneNavigated(() => {
                    navigatedD = true;
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
                stateNavigator.navigate('sceneB');
            });
            act(() => {
                navigatedA = navigatedB = navigatedC = navigatedD = false;
                var url = stateNavigator.fluent()
                    .navigate('sceneC')
                    .navigate('sceneD').url;
                stateNavigator.navigateLink(url);
            });
            try {
                assert.equal(navigatedA, false);
                assert.equal(navigatedB, false);
                assert.equal(navigatedC, false);
                assert.equal(navigatedD, true);
            } finally {
                ReactDOM.unmountComponentAtNode(container);
            }
        })
    });

    describe('A to A --> B -> C', function () {
        it('should call navigated hook on C and not on A or B', function(){
            var stateNavigator = new StateNavigator([
                { key: 'sceneA' },
                { key: 'sceneB', trackCrumbTrail: true },
                { key: 'sceneC', trackCrumbTrail: true }
            ]);
            stateNavigator.navigate('sceneA');
            var {sceneA, sceneB, sceneC} = stateNavigator.states;
            var navigatedA, navigatedB, navigatedC;
            var SceneA = () => {
                useSceneNavigated(() => {
                    navigatedA = true;
                })
                return <div />;
            };
            var SceneB = () => {
                useSceneNavigated(() => {
                    navigatedB = true;
                })
                return <div />;
            };
            var SceneC = () => {
                useSceneNavigated(() => {
                    navigatedC = true;
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
            act(() => {
                navigatedA = navigatedB = navigatedC = false;
                var url = stateNavigator.fluent(true)
                    .navigate('sceneB')
                    .navigate('sceneC').url;
                stateNavigator.navigateLink(url);
            });
            try {
                assert.equal(navigatedA, false);
                assert.equal(navigatedB, false);
                assert.equal(navigatedC, true);
            } finally {
                ReactDOM.unmountComponentAtNode(container);
            }
        })
    });

    describe('A -> B to C -> D', function () {
        it('should call navigated hook on D and not on A, B or C', function(){
            var stateNavigator = new StateNavigator([
                { key: 'sceneA' },
                { key: 'sceneB', trackCrumbTrail: true },
                { key: 'sceneC' },
                { key: 'sceneD', trackCrumbTrail: true }
            ]);
            stateNavigator.navigate('sceneA');
            var {sceneA, sceneB, sceneC, sceneD} = stateNavigator.states;
            var navigatedA, navigatedB, navigatedC, navigatedD;
            var SceneA = () => {
                useSceneNavigated(() => {
                    navigatedA = true;
                })
                return <div />;
            };
            var SceneB = () => {
                useSceneNavigated(() => {
                    navigatedB = true;
                })
                return <div />;
            };
            var SceneC = () => {
                useSceneNavigated(() => {
                    navigatedC = true;
                })
                return <div />;
            };
            var SceneD = () => {
                useSceneNavigated(() => {
                    navigatedD = true;
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
                stateNavigator.navigate('sceneB');
            });
            act(() => {
                navigatedA = navigatedB = navigatedC = navigatedD = false;
                var url = stateNavigator.fluent()
                    .navigate('sceneC')
                    .navigate('sceneD').url;
                stateNavigator.navigateLink(url);
            });
            try {
                assert.equal(navigatedA, false);
                assert.equal(navigatedB, false);
                assert.equal(navigatedC, false);
                assert.equal(navigatedD, true);
            } finally {
                ReactDOM.unmountComponentAtNode(container);
            }
        })
    });

    describe('A to A --> B -> C to A -> B', function () {
        it('should call navigated hook on B and not on A or C', function(){
            var stateNavigator = new StateNavigator([
                { key: 'sceneA' },
                { key: 'sceneB', trackCrumbTrail: true },
                { key: 'sceneC', trackCrumbTrail: true }
            ]);
            stateNavigator.navigate('sceneA');
            var {sceneA, sceneB, sceneC} = stateNavigator.states;
            var navigatedA, navigatedB, navigatedC;
            var SceneA = () => {
                useSceneNavigated(() => {
                    navigatedA = true;
                })
                return <div />;
            };
            var SceneB = () => {
                useSceneNavigated(() => {
                    navigatedB = true;
                })
                return <div />;
            };
            var SceneC = () => {
                useSceneNavigated(() => {
                    navigatedC = true;
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
                var url = stateNavigator.fluent(true)
                    .navigate('sceneB')
                    .navigate('sceneC').url;
                stateNavigator.navigateLink(url);
            });
            act(() => {
                navigatedA = navigatedB = navigatedC = false;
                stateNavigator.navigateBack(1);
            });
            try {
                assert.equal(navigatedA, false);
                assert.equal(navigatedB, true);
                assert.equal(navigatedC, false);
            } finally {
                ReactDOM.unmountComponentAtNode(container);
            }
        })
    });
});
