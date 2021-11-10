import assert from 'assert';
import 'mocha';
import { StateNavigator } from 'navigation';
import { NavigationContext, NavigationHandler } from 'navigation-react';
import { NavigationMotion, useUnloading } from 'navigation-react-mobile';
import React, { useState, useContext } from 'react';
import ReactDOM from 'react-dom';
import { act } from 'react-dom/test-utils';
import { JSDOM } from 'jsdom';

declare var global: any;
global.IS_REACT_ACT_ENVIRONMENT = true;
var { window } = new JSDOM('<!doctype html><html><body></body></html>', { pretendToBeVisual: true });
window.addEventListener = () => {};
global.window = window;
global.document = window.document;

describe('UnloadingHook', function () {
    describe('A', function () {
        it('should not call unloading hook', function(){
            var stateNavigator = new StateNavigator([
                { key: 'sceneA' }
            ]);
            stateNavigator.navigate('sceneA');
            var {sceneA} = stateNavigator.states;
            var unloadingA;
            var SceneA = () => {
                useUnloading(() => {
                    unloadingA = true;
                    return true;
                })
                return <div />;
            };
            sceneA.renderScene = () => <SceneA />;
            var container = document.createElement('div');
            var root = (ReactDOM as any).createRoot(container)
            act(() => {
                unloadingA = false;
                root.render(
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
                act(() => root.unmount());
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
                useUnloading(() => {
                    unloadingA = true;
                    return true;
                })
                return <div />;
            };
            var SceneB = () => {
                useUnloading(() => {
                    unloadingB = true;
                    return true;
                })
                return <div />;
            };
            sceneA.renderScene = () => <SceneA />;
            sceneB.renderScene = () => <SceneB />;
            var container = document.createElement('div');
            var root = (ReactDOM as any).createRoot(container)
            act(() => {
                unloadingA = unloadingB = false;
                root.render(
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
                act(() => root.unmount());
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
                useUnloading(() => {
                    unloadingA = true;
                    return true;
                })
                return <div />;
            };
            var SceneB = () => {
                useUnloading(() => {
                    unloadingB = true;
                    return true;
                })
                return <div />;
            };
            sceneA.renderScene = () => <SceneA />;
            sceneB.renderScene = () => <SceneB />;
            var container = document.createElement('div');
            var root = (ReactDOM as any).createRoot(container)
            act(() => {
                root.render(
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
                act(() => root.unmount());
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
                useUnloading(() => {
                    unloadingA = true;
                    return true;
                })
                return <div />;
            };
            var SceneB = () => {
                useUnloading(() => {
                    unloadingB = true;
                    return true;
                })
                return <div />;
            };
            sceneA.renderScene = () => <SceneA />;
            sceneB.renderScene = () => <SceneB />;
            var container = document.createElement('div');
            var root = (ReactDOM as any).createRoot(container)
            act(() => {
                root.render(
                    <NavigationHandler stateNavigator={stateNavigator}>
                        <NavigationMotion>
                            {(_style, scene, key) =>  <div key={key}>{scene}</div>}
                        </NavigationMotion>
                    </NavigationHandler>,
                    container
                );
            });
            act(() => stateNavigator.navigate('sceneB'));
            act(() => {
                unloadingA = unloadingB = false;
                stateNavigator.navigateBack(1);
            });
            try {
                assert.equal(unloadingA, false);
                assert.equal(unloadingB, true);
            } finally {
                act(() => root.unmount());
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
                useUnloading(() => {
                    unloadingA = true;
                    return true;
                })
                return <div />;
            };
            sceneA.renderScene = () => <SceneA />;
            var container = document.createElement('div');
            var root = (ReactDOM as any).createRoot(container)
            act(() => {
                root.render(
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
                act(() => root.unmount());
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
                useUnloading(() => {
                    unloadingA = true;
                    return true;
                })
                return <div />;
            };
            var SceneB = () => {
                useUnloading(() => {
                    unloadingB = true;
                    return true;
                })
                return <div />;
            };
            sceneA.renderScene = () => <SceneA />;
            sceneB.renderScene = () => <SceneB />;
            var container = document.createElement('div');
            var root = (ReactDOM as any).createRoot(container)
            act(() => {
                root.render(
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
                act(() => root.unmount());
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
                useUnloading(() => {
                    unloadingA = true;
                    return true;
                })
                return <div />;
            };
            var SceneB = () => {
                useUnloading(() => {
                    unloadingB = true;
                    return true;
                })
                return <div />;
            };
            var SceneC = () => {
                useUnloading(() => {
                    unloadingC = true;
                    return true;
                })
                return <div />;
            };
            sceneA.renderScene = () => <SceneA />;
            sceneB.renderScene = () => <SceneB />;
            sceneC.renderScene = () => <SceneC />;
            var container = document.createElement('div');
            var root = (ReactDOM as any).createRoot(container)
            act(() => {
                root.render(
                    <NavigationHandler stateNavigator={stateNavigator}>
                        <NavigationMotion>
                            {(_style, scene, key) =>  <div key={key}>{scene}</div>}
                        </NavigationMotion>
                    </NavigationHandler>,
                    container
                );
            });
            act(() => stateNavigator.navigate('sceneB'));
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
                act(() => root.unmount());
            }
        })
    });

    describe('A -> B to C -> D', function () {
        it('should call unloading hook on B and not on A, C, or D', function(){
            var stateNavigator = new StateNavigator([
                { key: 'sceneA' },
                { key: 'sceneB', trackCrumbTrail: true },
                { key: 'sceneC' },
                { key: 'sceneD', trackCrumbTrail: true }
            ]);
            stateNavigator.navigate('sceneA');
            var {sceneA, sceneB, sceneC, sceneD} = stateNavigator.states;
            var unloadingA, unloadingB, unloadingC, unloadingD;
            var SceneA = () => {
                useUnloading(() => {
                    unloadingA = true;
                    return true;
                })
                return <div />;
            };
            var SceneB = () => {
                useUnloading(() => {
                    unloadingB = true;
                    return true;
                })
                return <div />;
            };
            var SceneC = () => {
                useUnloading(() => {
                    unloadingC = true;
                    return true;
                })
                return <div />;
            };
            var SceneD = () => {
                useUnloading(() => {
                    unloadingD = true;
                    return true;
                })
                return <div />;
            };
            sceneA.renderScene = () => <SceneA />;
            sceneB.renderScene = () => <SceneB />;
            sceneC.renderScene = () => <SceneC />;
            sceneD.renderScene = () => <SceneD />;
            var container = document.createElement('div');
            var root = (ReactDOM as any).createRoot(container)
            act(() => {
                root.render(
                    <NavigationHandler stateNavigator={stateNavigator}>
                        <NavigationMotion>
                            {(_style, scene, key) =>  <div key={key}>{scene}</div>}
                        </NavigationMotion>
                    </NavigationHandler>,
                    container
                );
            });
            act(() => stateNavigator.navigate('sceneB'));
            act(() => {
                unloadingA = unloadingB = unloadingC = unloadingD = false;
                var url = stateNavigator.fluent()
                    .navigate('sceneC')
                    .navigate('sceneD').url;
                stateNavigator.navigateLink(url);
            });
            try {
                assert.equal(unloadingA, false);
                assert.equal(unloadingB, true);
                assert.equal(unloadingC, false);
                assert.equal(unloadingD, false);
            } finally {
                act(() => root.unmount());
            }
        })
    });

    describe('A to A --> B -> C', function () {
        it('should call unloading hook on A and not on B or C', function(){
            var stateNavigator = new StateNavigator([
                { key: 'sceneA' },
                { key: 'sceneB', trackCrumbTrail: true },
                { key: 'sceneC', trackCrumbTrail: true }
            ]);
            stateNavigator.navigate('sceneA');
            var {sceneA, sceneB, sceneC} = stateNavigator.states;
            var unloadingA, unloadingB, unloadingC;
            var SceneA = () => {
                useUnloading(() => {
                    unloadingA = true;
                    return true;
                })
                return <div />;
            };
            var SceneB = () => {
                useUnloading(() => {
                    unloadingB = true;
                    return true;
                })
                return <div />;
            };
            var SceneC = () => {
                useUnloading(() => {
                    unloadingC = true;
                    return true;
                })
                return <div />;
            };
            sceneA.renderScene = () => <SceneA />;
            sceneB.renderScene = () => <SceneB />;
            sceneC.renderScene = () => <SceneC />;
            var container = document.createElement('div');
            var root = (ReactDOM as any).createRoot(container)
            act(() => {
                root.render(
                    <NavigationHandler stateNavigator={stateNavigator}>
                        <NavigationMotion>
                            {(_style, scene, key) =>  <div key={key}>{scene}</div>}
                        </NavigationMotion>
                    </NavigationHandler>,
                    container
                );
            });
            act(() => {
                unloadingA = unloadingB = unloadingC = false;
                var url = stateNavigator.fluent(true)
                    .navigate('sceneB')
                    .navigate('sceneC').url;
                stateNavigator.navigateLink(url);
            });
            try {
                assert.equal(unloadingA, true);
                assert.equal(unloadingB, false);
                assert.equal(unloadingC, false);
            } finally {
                act(() => root.unmount());
            }
        })
    });

    describe('A to A -> B -> C to A -> B', function () {
        it('should call unloading hook on C and not A or B', function(){
            var stateNavigator = new StateNavigator([
                { key: 'sceneA' },
                { key: 'sceneB', trackCrumbTrail: true },
                { key: 'sceneC', trackCrumbTrail: true }
            ]);
            stateNavigator.navigate('sceneA');
            var {sceneA, sceneB, sceneC} = stateNavigator.states;
            var unloadingA, unloadingB, unloadingC;
            var SceneA = () => {
                useUnloading(() => {
                    unloadingA = true;
                    return true;
                })
                return <div />;
            };
            var SceneB = () => {
                useUnloading(() => {
                    unloadingB = true;
                    return true;
                })
                return <div />;
            };
            var SceneC = () => {
                useUnloading(() => {
                    unloadingC = true;
                    return true;
                })
                return <div />;
            };
            sceneA.renderScene = () => <SceneA />;
            sceneB.renderScene = () => <SceneB />;
            sceneC.renderScene = () => <SceneC />;
            var container = document.createElement('div');
            var root = (ReactDOM as any).createRoot(container)
            act(() => {
                root.render(
                    <NavigationHandler stateNavigator={stateNavigator}>
                        <NavigationMotion>
                            {(_style, scene, key) =>  <div key={key}>{scene}</div>}
                        </NavigationMotion>
                    </NavigationHandler>,
                    container
                );
            });
            act(() => {
                var url = stateNavigator.fluent(true)
                    .navigate('sceneB')
                    .navigate('sceneC').url;
                stateNavigator.navigateLink(url);
            });
            act(() => {
                unloadingA = unloadingB = unloadingC = false;
                stateNavigator.navigateBack(1);
            });
            try {
                assert.equal(unloadingA, false);
                assert.equal(unloadingB, false);
                assert.equal(unloadingC, true);
            } finally {
                act(() => root.unmount());
            }
        })
    });

    describe('A to A -> B to A to A -> B to A', function () {
        it('should call unloading hook on B and not A', function(){
            var stateNavigator = new StateNavigator([
                { key: 'sceneA' },
                { key: 'sceneB', trackCrumbTrail: true }
            ]);
            stateNavigator.navigate('sceneA');
            var {sceneA, sceneB} = stateNavigator.states;
            var unloadingA, unloadingB;
            var SceneA = () => {
                useUnloading(() => {
                    unloadingA = true;
                    return true;
                })
                return <div />;
            };
            var SceneB = () => {
                useUnloading(() => {
                    unloadingB = true;
                    return true;
                })
                return <div />;
            };
            sceneA.renderScene = () => <SceneA />;
            sceneB.renderScene = () => <SceneB />;
            var container = document.createElement('div');
            var root = (ReactDOM as any).createRoot(container)
            act(() => {
                root.render(
                    <NavigationHandler stateNavigator={stateNavigator}>
                        <NavigationMotion>
                            {(_style, scene, key) =>  <div key={key}>{scene}</div>}
                        </NavigationMotion>
                    </NavigationHandler>,
                    container
                );
            });
            act(() => {
                stateNavigator.navigate('sceneB');
                stateNavigator.navigate('sceneA');
                stateNavigator.navigate('sceneB');
            });
            act(() => {
                unloadingA = unloadingB = false;
                stateNavigator.navigate('sceneA');
            });
            try {
                assert.equal(unloadingA, false);
                assert.equal(unloadingB, true);
            } finally {
                act(() => root.unmount());
            }
        })
    });

    describe('A -> B -> C to A', function () {
        it('should call unloading hook on C and not on A or B', function(){
            var stateNavigator = new StateNavigator([
                { key: 'sceneA' },
                { key: 'sceneB', trackCrumbTrail: true },
                { key: 'sceneC', trackCrumbTrail: true }
            ]);
            stateNavigator.navigate('sceneA');
            var {sceneA, sceneB, sceneC} = stateNavigator.states;
            var unloadingA, unloadingB, unloadingC;
            var SceneA = () => {
                useUnloading(() => {
                    unloadingA = true;
                    return true;
                })
                return <div />;
            };
            var SceneB = () => {
                useUnloading(() => {
                    unloadingB = true;
                    return true;
                })
                return <div />;
            };
            var SceneC = () => {
                useUnloading(() => {
                    unloadingC = true;
                    return true;
                })
                return <div />;
            };
            sceneA.renderScene = () => <SceneA />;
            sceneB.renderScene = () => <SceneB />;
            sceneC.renderScene = () => <SceneC />;
            var container = document.createElement('div');
            var root = (ReactDOM as any).createRoot(container)
            act(() => {
                root.render(
                    <NavigationHandler stateNavigator={stateNavigator}>
                        <NavigationMotion>
                            {(_style, scene, key) =>  <div key={key}>{scene}</div>}
                        </NavigationMotion>
                    </NavigationHandler>,
                    container
                );
            });
            act(() => {
                stateNavigator.navigate('sceneB');
                stateNavigator.navigate('sceneC');
            });
            act(() => {
                unloadingA = unloadingB = unloadingC = false;
                stateNavigator.navigateBack(2);
            });
            try {
                assert.equal(unloadingA, false);
                assert.equal(unloadingB, false);
                assert.equal(unloadingC, true);
            } finally {
                act(() => root.unmount());
            }
        })
    });

    describe('A -> B -> C to B', function () {
        it('should call unloading hook on C and not on A or B', function(){
            var stateNavigator = new StateNavigator([
                { key: 'sceneA' },
                { key: 'sceneB', trackCrumbTrail: true },
                { key: 'sceneC', trackCrumbTrail: true }
            ]);
            stateNavigator.navigate('sceneA');
            var {sceneA, sceneB, sceneC} = stateNavigator.states;
            var unloadingA, unloadingB, unloadingC;
            var SceneA = () => {
                useUnloading(() => {
                    unloadingA = true;
                    return true;
                })
                return <div />;
            };
            var SceneB = () => {
                useUnloading(() => {
                    unloadingB = true;
                    return true;
                })
                return <div />;
            };
            var SceneC = () => {
                useUnloading(() => {
                    unloadingC = true;
                    return true;
                })
                return <div />;
            };
            sceneA.renderScene = () => <SceneA />;
            sceneB.renderScene = () => <SceneB />;
            sceneC.renderScene = () => <SceneC />;
            var container = document.createElement('div');
            var root = (ReactDOM as any).createRoot(container)
            act(() => {
                root.render(
                    <NavigationHandler stateNavigator={stateNavigator}>
                        <NavigationMotion>
                            {(_style, scene, key) =>  <div key={key}>{scene}</div>}
                        </NavigationMotion>
                    </NavigationHandler>,
                    container
                );
            });
            act(() => {
                stateNavigator.navigate('sceneB');
                stateNavigator.navigate('sceneC');
            });
            act(() => {
                unloadingA = unloadingB = unloadingC = false;
                var url = stateNavigator.fluent()
                    .navigate('sceneB').url;
                stateNavigator.navigateLink(url);
            });
            try {
                assert.equal(unloadingA, false);
                assert.equal(unloadingB, false);
                assert.equal(unloadingC, true);
            } finally {
                act(() => root.unmount());
            }
        })
    });

    describe('Suspend navigation', function () {
        it('should call unloading hook', function(){
            var stateNavigator = new StateNavigator([
                { key: 'sceneA' },
                { key: 'sceneB', trackCrumbTrail: true }
            ]);
            stateNavigator.navigate('sceneA');
            var {sceneA, sceneB} = stateNavigator.states;
            var unloadingA, unloadingB;
            var SceneA = () => {
                useUnloading(() => {
                    unloadingA = true;
                    return true;
                })
                return <div />;
            };
            var SceneB = () => {
                useUnloading(() => {
                    unloadingB = true;
                    return true;
                })
                return <div />;
            };
            sceneA.renderScene = () => <SceneA />;
            sceneB.renderScene = () => <SceneB />;
            var container = document.createElement('div');
            var root = (ReactDOM as any).createRoot(container)
            act(() => {
                root.render(
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
                var url = stateNavigator.getNavigationLink('sceneB');
                stateNavigator.navigateLink(url, undefined, false, () => {});
            });
            try {
                assert.equal(unloadingA, true);
                assert.equal(unloadingB, false);
            } finally {
                act(() => root.unmount());
            }
        })
    });

    describe('Set state', function () {
        it('should not call unloading hook', function(){
            var stateNavigator = new StateNavigator([
                { key: 'sceneA' }
            ]);
            stateNavigator.navigate('sceneA');
            var {sceneA} = stateNavigator.states;
            var unloadingA;
            var setCountA;
            var SceneA = () => {
                var [count, setCount]  = useState(0);
                setCountA = setCount;
                useUnloading(() => {
                    unloadingA = true;
                    return true;
                })
                return <div />;
            };
            sceneA.renderScene = () => <SceneA />;
            var container = document.createElement('div');
            var root = (ReactDOM as any).createRoot(container)
            act(() => {
                root.render(
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
                setCountA(1);
            });
            try {
                assert.equal(unloadingA, false);
            } finally {
                act(() => root.unmount());
            }
        })
    });

    describe('Unloading handler state', function () {
        it('should access latest state', function(){
            var stateNavigator = new StateNavigator([
                { key: 'sceneA' },
                { key: 'sceneB', trackCrumbTrail: true }
            ]);
            stateNavigator.navigate('sceneA');
            var {sceneA, sceneB} = stateNavigator.states;
            var countA, setCountA;
            var SceneA = () => {
                var [count, setCount]  = useState(0);
                setCountA = setCount;
                useUnloading(() => {
                    countA = count;
                    return true;
                })
                return <div />;
            };
            var SceneB = () => <div />;
            sceneA.renderScene = () => <SceneA />;
            sceneB.renderScene = () => <SceneB />;
            var container = document.createElement('div');
            var root = (ReactDOM as any).createRoot(container)
            act(() => {
                root.render(
                    <NavigationHandler stateNavigator={stateNavigator}>
                        <NavigationMotion>
                            {(_style, scene, key) =>  <div key={key}>{scene}</div>}
                        </NavigationMotion>
                    </NavigationHandler>,
                    container
                );
            });
            act(() => setCountA(1));
            act(() => {
                countA = 0;
                stateNavigator.navigate('sceneB');
            });
            try {
                assert.equal(countA, 1);
            } finally {
                act(() => root.unmount());
            }
        })
    });

    describe('Unloading handler context', function () {
        it('should access current context', function(){
            var stateNavigator = new StateNavigator([
                { key: 'sceneA' },
                { key: 'sceneB', trackCrumbTrail: true }
            ]);
            stateNavigator.navigate('sceneA');
            var {sceneA, sceneB} = stateNavigator.states;
            var stateContextA;
            var SceneA = () => {
                var navigationEvent = useContext(NavigationContext);
                useUnloading(() => {
                    var {stateContext} = navigationEvent.stateNavigator;
                    stateContextA = stateContext;
                    return true;
                })
                return <div />;
            };
            var SceneB = () => <div />;
            sceneA.renderScene = () => <SceneA />;
            sceneB.renderScene = () => <SceneB />;
            var container = document.createElement('div');
            var root = (ReactDOM as any).createRoot(container)
            act(() => {
                root.render(
                    <NavigationHandler stateNavigator={stateNavigator}>
                        <NavigationMotion>
                            {(_style, scene, key) =>  <div key={key}>{scene}</div>}
                        </NavigationMotion>
                    </NavigationHandler>,
                    container
                );
            });
            act(() => {
                stateContextA = null;
                stateNavigator.navigate('sceneB');
            });
            try {
                assert.equal(stateContextA.oldState, null);
                assert.equal(stateContextA.state, sceneA);
            } finally {
                act(() => root.unmount());
            }
        })
    });

    describe('Unloading handler data', function () {
        it('should access data', function(){
            var stateNavigator = new StateNavigator([
                { key: 'sceneA', defaultTypes: {x: 'number'} },
                { key: 'sceneB', defaultTypes: {y: 'number'}, trackCrumbTrail: true },
                { key: 'sceneC', trackCrumbTrail: true }
            ]);
            stateNavigator.navigate('sceneA', {x: 0});
            var {sceneA, sceneB, sceneC} = stateNavigator.states;
            var stateC, dataC, urlC, crumbsC, historyC;
            var SceneA = () => <div />;
            var SceneB = () => <div />;
            var SceneC = () => {
                useUnloading((state, data, url, history, crumbs) => {
                    stateC = state;
                    dataC = data;
                    urlC = url;
                    historyC = history;
                    crumbsC = crumbs;
                    return true;
                })
                return <div />;
            };
            sceneA.renderScene = () => <SceneA />;
            sceneB.renderScene = () => <SceneB />;
            sceneC.renderScene = () => <SceneC />;
            var container = document.createElement('div');
            var root = (ReactDOM as any).createRoot(container)
            act(() => {
                root.render(
                    <NavigationHandler stateNavigator={stateNavigator}>
                        <NavigationMotion>
                            {(_style, scene, key) =>  <div key={key}>{scene}</div>}
                        </NavigationMotion>
                    </NavigationHandler>,
                    container
                );
            });
            act(() => {
                stateNavigator.navigate('sceneB', {y: 1});
                stateNavigator.navigate('sceneC');
            });
            act(() => {
                stateC = dataC = urlC = crumbsC = historyC = null;
                stateNavigator.navigateBack(1);
            });
            try {
                assert.equal(stateC, sceneB);
                assert.equal(dataC.y, 1);
                assert.equal(urlC, '/sceneB?y=1&crumb=%2FsceneA%3Fx%3D0');
                assert.equal(crumbsC.length, 1);
                assert.equal(crumbsC[0].state, sceneA);
                assert.equal(crumbsC[0].data.x, 0);
                assert.equal(historyC, false);
            } finally {
                act(() => root.unmount());
            }
        })
    });

    describe('Cancel navigation', function () {
        it('should not navigate', function(){
            var stateNavigator = new StateNavigator([
                { key: 'sceneA' },
                { key: 'sceneB', trackCrumbTrail: true }
            ]);
            stateNavigator.navigate('sceneA');
            var {sceneA, sceneB} = stateNavigator.states;
            var SceneA = () => {
                useUnloading(() => {
                    return false;
                })
                return <div />;
            };
            var SceneB = () =>  <div />;
            sceneA.renderScene = () => <SceneA />;
            sceneB.renderScene = () => <SceneB />;
            var container = document.createElement('div');
            var root = (ReactDOM as any).createRoot(container)
            act(() => {
                root.render(
                    <NavigationHandler stateNavigator={stateNavigator}>
                        <NavigationMotion>
                            {(_style, scene, key) =>  <div key={key}>{scene}</div>}
                        </NavigationMotion>
                    </NavigationHandler>,
                    container
                );
            });
            act(() => {
                stateNavigator.navigate('sceneB');
            });
            try {
                assert.equal(stateNavigator.stateContext.state, sceneA);
            } finally {
                act(() => root.unmount());
            }
        })
    });

    describe('Unloading set state', function () {
        it('should render', function(){
            var stateNavigator = new StateNavigator([
                { key: 'sceneA' },
                { key: 'sceneB', trackCrumbTrail: true }
            ]);
            stateNavigator.navigate('sceneA');
            var {sceneA, sceneB} = stateNavigator.states;
            var SceneA = () => {
                var [unloading, setUnloading] = useState(false)
                useUnloading(() => {
                    setUnloading(true);
                    return true;
                })
                return <div id='sceneA' data-unloading={unloading} />;
            };
            var SceneB = () => <div />;
            sceneA.renderScene = () => <SceneA />;
            sceneB.renderScene = () => <SceneB />;
            var container = document.createElement('div');
            var root = (ReactDOM as any).createRoot(container)
            act(() => {
                root.render(
                    <NavigationHandler stateNavigator={stateNavigator}>
                        <NavigationMotion>
                            {(_style, scene, key) =>  <div key={key}>{scene}</div>}
                        </NavigationMotion>
                    </NavigationHandler>,
                    container
                );
            });
            act(() => {
                stateNavigator.navigate('sceneB');
            });
            try {
                var scene = container.querySelector<HTMLDivElement>("#sceneA");                
                assert.strictEqual(scene.dataset.unloading, 'true');
            } finally {
                act(() => root.unmount());
            }
        })
    });
});
