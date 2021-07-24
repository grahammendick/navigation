import assert from 'assert';
import 'mocha';
import { StateNavigator } from 'navigation';
import { NavigationContext, NavigationHandler } from 'navigation-react';
import { NavigationMotion, useNavigated } from 'navigation-react-mobile';
import React, { useState, useContext } from 'react';
import ReactDOM from 'react-dom';
import { act } from 'react-dom/test-utils';
import { JSDOM } from 'jsdom';

declare var global: any;
var { window } = new JSDOM('<!doctype html><html><body></body></html>', { pretendToBeVisual: true });
window.addEventListener = () => {};
global.window = window;
global.document = window.document;

describe('NavigatedHook', function () {
    describe('A', function () {
        it('should call navigated hook', function(){
            var stateNavigator = new StateNavigator([
                { key: 'sceneA' }
            ]);
            stateNavigator.navigate('sceneA');
            var {sceneA} = stateNavigator.states;
            var navigatedA;
            var SceneA = () => {
                useNavigated(() => {
                    navigatedA = true;
                })
                return <div />;
            };
            sceneA.renderScene = () => <SceneA />;
            var container = document.createElement('div');
            var root = (ReactDOM as any).createRoot(container)
            act(() => {
                navigatedA = false;
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
                assert.equal(navigatedA, true);
            } finally {
                root.unmount();
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
                useNavigated(() => {
                    navigatedA = true;
                })
                return <div />;
            };
            var SceneB = () => {
                useNavigated(() => {
                    navigatedB = true;
                })
                return <div />;
            };
            sceneA.renderScene = () => <SceneA />;
            sceneB.renderScene = () => <SceneB />;
            var container = document.createElement('div');
            var root = (ReactDOM as any).createRoot(container)
            act(() => {
                navigatedA = navigatedB = false;
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
                assert.equal(navigatedA, false);
                assert.equal(navigatedB, true);
            } finally {
                root.unmount();
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
                useNavigated(() => {
                    navigatedA = true;
                })
                return <div />;
            };
            var SceneB = () => {
                useNavigated(() => {
                    navigatedB = true;
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
                navigatedA = navigatedB = false;
                stateNavigator.navigate('sceneB');
            });
            try {
                assert.equal(navigatedA, false);
                assert.equal(navigatedB, true);
            } finally {
                root.unmount();
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
                useNavigated(() => {
                    navigatedA = true;
                })
                return <div />;
            };
            var SceneB = () => {
                useNavigated(() => {
                    navigatedB = true;
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
                navigatedA = navigatedB = false;
                stateNavigator.navigateBack(1);
            });
            try {
                assert.equal(navigatedA, true);
                assert.equal(navigatedB, false);
            } finally {
                root.unmount();
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
                useNavigated(() => {
                    navigatedA = true;
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
                navigatedA = false;
                stateNavigator.navigate('sceneA');
            });
            try {
                assert.equal(navigatedA, true);
            } finally {
                root.unmount();
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
                useNavigated(() => {
                    navigatedA = true;
                })
                return <div />;
            };
            var SceneB = () => {
                useNavigated(() => {
                    navigatedB = true;
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
                navigatedA = navigatedB = false;
                stateNavigator.navigate('sceneB');
            });
            try {
                assert.equal(navigatedA, false);
                assert.equal(navigatedB, true);
            } finally {
                root.unmount();
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
                useNavigated(() => {
                    navigatedA = true;
                })
                return <div />;
            };
            var SceneB = () => {
                useNavigated(() => {
                    navigatedB = true;
                })
                return <div />;
            };
            var SceneC = () => {
                useNavigated(() => {
                    navigatedC = true;
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
                root.unmount();
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
                useNavigated(() => {
                    navigatedA = true;
                })
                return <div />;
            };
            var SceneB = () => {
                useNavigated(() => {
                    navigatedB = true;
                })
                return <div />;
            };
            var SceneC = () => {
                useNavigated(() => {
                    navigatedC = true;
                })
                return <div />;
            };
            var SceneD = () => {
                useNavigated(() => {
                    navigatedD = true;
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
                root.unmount();
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
                useNavigated(() => {
                    navigatedA = true;
                })
                return <div />;
            };
            var SceneB = () => {
                useNavigated(() => {
                    navigatedB = true;
                })
                return <div />;
            };
            var SceneC = () => {
                useNavigated(() => {
                    navigatedC = true;
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
                root.unmount();
            }
        })
    });

    describe('A to A -> B -> C to A -> B', function () {
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
                useNavigated(() => {
                    navigatedA = true;
                })
                return <div />;
            };
            var SceneB = () => {
                useNavigated(() => {
                    navigatedB = true;
                })
                return <div />;
            };
            var SceneC = () => {
                useNavigated(() => {
                    navigatedC = true;
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
                navigatedA = navigatedB = navigatedC = false;
                stateNavigator.navigateBack(1);
            });
            try {
                assert.equal(navigatedA, false);
                assert.equal(navigatedB, true);
                assert.equal(navigatedC, false);
            } finally {
                root.unmount();
            }
        })
    });

    describe('A to A -> B to A to A -> B to A', function () {
        it('should call navigated hook on A and not B', function(){
            var stateNavigator = new StateNavigator([
                { key: 'sceneA' },
                { key: 'sceneB', trackCrumbTrail: true }
            ]);
            stateNavigator.navigate('sceneA');
            var {sceneA, sceneB} = stateNavigator.states;
            var navigatedA, navigatedB;
            var SceneA = () => {
                useNavigated(() => {
                    navigatedA = true;
                })
                return <div />;
            };
            var SceneB = () => {
                useNavigated(() => {
                    navigatedB = true;
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
                navigatedA = navigatedB = false;
                stateNavigator.navigate('sceneA');
            });
            try {
                assert.equal(navigatedA, true);
                assert.equal(navigatedB, false);
            } finally {
                root.unmount();
            }
        })
    });

    describe('A -> B -> C to A', function () {
        it('should call navigated hook on A and not on B or C', function(){
            var stateNavigator = new StateNavigator([
                { key: 'sceneA' },
                { key: 'sceneB', trackCrumbTrail: true },
                { key: 'sceneC', trackCrumbTrail: true }
            ]);
            stateNavigator.navigate('sceneA');
            var {sceneA, sceneB, sceneC} = stateNavigator.states;
            var navigatedA, navigatedB, navigatedC;
            var SceneA = () => {
                useNavigated(() => {
                    navigatedA = true;
                })
                return <div />;
            };
            var SceneB = () => {
                useNavigated(() => {
                    navigatedB = true;
                })
                return <div />;
            };
            var SceneC = () => {
                useNavigated(() => {
                    navigatedC = true;
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
                navigatedA = navigatedB = navigatedC = false;
                stateNavigator.navigateBack(2);
            });
            try {
                assert.equal(navigatedA, true);
                assert.equal(navigatedB, false);
                assert.equal(navigatedC, false);
            } finally {
                root.unmount();
            }
        })
    });

    describe('A -> B -> C to B', function () {
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
                useNavigated(() => {
                    navigatedA = true;
                })
                return <div />;
            };
            var SceneB = () => {
                useNavigated(() => {
                    navigatedB = true;
                })
                return <div />;
            };
            var SceneC = () => {
                useNavigated(() => {
                    navigatedC = true;
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
                navigatedA = navigatedB = navigatedC = false;
                var url = stateNavigator.fluent()
                    .navigate('sceneB').url;
                stateNavigator.navigateLink(url);
            });
            try {
                assert.equal(navigatedA, false);
                assert.equal(navigatedB, true);
                assert.equal(navigatedC, false);
            } finally {
                root.unmount();
            }
        })
    });

    describe('Suspend navigation', function () {
        it('should not call navigated hook', function(){
            var stateNavigator = new StateNavigator([
                { key: 'sceneA' },
                { key: 'sceneB', trackCrumbTrail: true }
            ]);
            stateNavigator.navigate('sceneA');
            var {sceneA, sceneB} = stateNavigator.states;
            var navigatedA, navigatedB;
            var SceneA = () => {
                useNavigated(() => {
                    navigatedA = true;
                })
                return <div />;
            };
            var SceneB = () => {
                useNavigated(() => {
                    navigatedB = true;
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
                navigatedA = navigatedB = false;
                var url = stateNavigator.getNavigationLink('sceneB');
                stateNavigator.navigateLink(url, undefined, false, () => {});
            });
            try {
                assert.equal(navigatedA, false);
                assert.equal(navigatedB, false);
            } finally {
                root.unmount();
            }
        })
    });

    describe('Set state', function () {
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
                useNavigated(() => {
                    navigatedA = true;
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
                navigatedA = false;
                setCountA(1);
            });
            try {
                assert.equal(navigatedA, false);
            } finally {
                root.unmount();
            }
        })
    });

    describe('Navigated handler state', function () {
        it('should access latest state', function(){
            var stateNavigator = new StateNavigator([
                { key: 'sceneA' }
            ]);
            stateNavigator.navigate('sceneA');
            var {sceneA} = stateNavigator.states;
            var countA, setCountA;
            var SceneA = () => {
                var [count, setCount]  = useState(0);
                setCountA = setCount;
                useNavigated(() => {
                    countA = count;
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
            act(() => setCountA(1));
            act(() => {
                countA = 0;
                stateNavigator.navigate('sceneA');
            });
            try {
                assert.equal(countA, 1);
            } finally {
                root.unmount();
            }
        })
    });

    describe('Navigated handler context', function () {
        it('should access latest context', function(){
            var stateNavigator = new StateNavigator([
                { key: 'sceneA' }
            ]);
            stateNavigator.navigate('sceneA', {x: 0});
            var {sceneA} = stateNavigator.states;
            var stateContextA;
            var SceneA = () => {
                var navigationEvent = useContext(NavigationContext);
                useNavigated(() => {
                    var {stateContext} = navigationEvent.stateNavigator;
                    stateContextA = stateContext;
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
                stateContextA = null;
                stateNavigator.navigate('sceneA', {y: 1});
            });
            try {
                assert.equal(stateContextA.oldState, sceneA);
                assert.equal(stateContextA.oldData.x, 0);
                assert.equal(stateContextA.data.y, 1);
            } finally {
                root.unmount();
            }
        })
    });
});
