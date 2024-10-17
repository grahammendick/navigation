import assert from 'assert';
import 'mocha';
import { StateNavigator } from 'navigation';
import { NavigationContext, NavigationHandler } from 'navigation-react';
import { NavigationMotion, NavigationStack, useUnloaded } from 'navigation-react-mobile';
import React, { useState, useContext } from 'react';
import { createRoot } from 'react-dom/client';
import { act } from 'react-dom/test-utils';
import { JSDOM } from 'jsdom';

declare var global: any;
global.IS_REACT_ACT_ENVIRONMENT = true;
var { window } = new JSDOM('<!doctype html><html><body></body></html>', { pretendToBeVisual: true, url: 'https://navigation.com' });
window.addEventListener = () => {};
global.window = window;
global.document = window.document;

describe('UnloadedHook', function () {
    describe('A', function () {
        const test = stack => {
            it('should not call unloaded hook', function(){
                var stateNavigator = new StateNavigator([
                    { key: 'sceneA' }
                ]);
                stateNavigator.navigate('sceneA');
                var {sceneA} = stateNavigator.states;
                var unloadedA;
                var SceneA = () => {
                    useUnloaded(() => {
                        unloadedA = true;
                    })
                    return <div />;
                };
                sceneA.renderScene = () => <SceneA />;
                var container = document.createElement('div');
                var root = createRoot(container)
                act(() => {
                    unloadedA = false;
                    root.render(
                        <NavigationHandler stateNavigator={stateNavigator}>
                            {stack}
                        </NavigationHandler>
                    );
                });
                try {
                    assert.equal(unloadedA, false);
                } finally {
                    act(() => root.unmount());
                }
            });
        }
        describe('Motion', () => {
            test(
                <NavigationMotion>
                    {(_style, scene, key) =>  <div key={key}>{scene}</div>}
                </NavigationMotion>
            );
        });
        describe('Stack', () => {
            test(<NavigationStack />);
        });
    });

    describe('A -> B', function () {
        const test = stack => {
            it('should not call unloaded hook on on A or B', function(){
                var stateNavigator = new StateNavigator([
                    { key: 'sceneA' },
                    { key: 'sceneB', trackCrumbTrail: true }
                ]);
                stateNavigator.navigate('sceneA');
                stateNavigator.navigate('sceneB');
                var {sceneA, sceneB} = stateNavigator.states;
                var unloadedA, unloadedB;
                var SceneA = () => {
                    useUnloaded(() => {
                        unloadedA = true;
                    })
                    return <div />;
                };
                var SceneB = () => {
                    useUnloaded(() => {
                        unloadedB = true;
                    })
                    return <div />;
                };
                sceneA.renderScene = () => <SceneA />;
                sceneB.renderScene = () => <SceneB />;
                var container = document.createElement('div');
                var root = createRoot(container)
                act(() => {
                    unloadedA = unloadedB = false;
                    root.render(
                        <NavigationHandler stateNavigator={stateNavigator}>
                            {stack}
                        </NavigationHandler>
                    );
                });
                try {
                    assert.equal(unloadedA, false);
                    assert.equal(unloadedB, false);
                } finally {
                    act(() => root.unmount());
                }
            });
        }
        describe('Motion', () => {
            test(
                <NavigationMotion>
                    {(_style, scene, key) =>  <div key={key}>{scene}</div>}
                </NavigationMotion>
            );
        });
        describe('Stack', () => {
            test(<NavigationStack />);
        });
    });

    describe('A to A -> B', function () {
        const test = stack => {
            it('should call unloaded hook on A and not B', function(){
                var stateNavigator = new StateNavigator([
                    { key: 'sceneA' },
                    { key: 'sceneB', trackCrumbTrail: true }
                ]);
                stateNavigator.navigate('sceneA');
                var {sceneA, sceneB} = stateNavigator.states;
                var unloadedA, unloadedB;
                var SceneA = () => {
                    useUnloaded(() => {
                        unloadedA = true;
                    })
                    return <div />;
                };
                var SceneB = () => {
                    useUnloaded(() => {
                        unloadedB = true;
                    })
                    return <div />;
                };
                sceneA.renderScene = () => <SceneA />;
                sceneB.renderScene = () => <SceneB />;
                var container = document.createElement('div');
                var root = createRoot(container)
                act(() => {
                    root.render(
                        <NavigationHandler stateNavigator={stateNavigator}>
                            {stack}
                        </NavigationHandler>
                    );
                });
                act(() => {
                    unloadedA = unloadedB = false;
                    stateNavigator.navigate('sceneB');
                });
                try {
                    assert.equal(unloadedA, true);
                    assert.equal(unloadedB, false);
                } finally {
                    act(() => root.unmount());
                }
            });
        }
        describe('Motion', () => {
            test(
                <NavigationMotion>
                    {(_style, scene, key) =>  <div key={key}>{scene}</div>}
                </NavigationMotion>
            );
        });
        describe('Stack', () => {
            test(<NavigationStack />);
        });
    });

    describe('A -> B to A', function () {
        const test = stack => {
            it('should call unloaded hook on B and not on A', function(){
                var stateNavigator = new StateNavigator([
                    { key: 'sceneA' },
                    { key: 'sceneB', trackCrumbTrail: true }
                ]);
                stateNavigator.navigate('sceneA');
                var {sceneA, sceneB} = stateNavigator.states;
                var unloadedA, unloadedB;
                var SceneA = () => {
                    useUnloaded(() => {
                        unloadedA = true;
                    })
                    return <div />;
                };
                var SceneB = () => {
                    useUnloaded(() => {
                        unloadedB = true;
                    })
                    return <div />;
                };
                sceneA.renderScene = () => <SceneA />;
                sceneB.renderScene = () => <SceneB />;
                var container = document.createElement('div');
                var root = createRoot(container)
                act(() => {
                    root.render(
                        <NavigationHandler stateNavigator={stateNavigator}>
                            {stack}
                        </NavigationHandler>
                    );
                });
                act(() => stateNavigator.navigate('sceneB'));
                act(() => {
                    unloadedA = unloadedB = false;
                    stateNavigator.navigateBack(1);
                });
                try {
                    assert.equal(unloadedA, false);
                    assert.equal(unloadedB, true);
                } finally {
                    act(() => root.unmount());
                }
            });
        }
        describe('Motion', () => {
            test(
                <NavigationMotion>
                    {(_style, scene, key) =>  <div key={key}>{scene}</div>}
                </NavigationMotion>
            );
        });
        describe('Stack', () => {
            test(<NavigationStack />);
        });
    });

    describe('A to A', function () {
        const test = stack => {
            it('should not call unloaded hook', function(){
                var stateNavigator = new StateNavigator([
                    { key: 'sceneA' }
                ]);
                stateNavigator.navigate('sceneA');
                var {sceneA} = stateNavigator.states;
                var unloadedA;
                var SceneA = () => {
                    useUnloaded(() => {
                        unloadedA = true;
                    })
                    return <div />;
                };
                sceneA.renderScene = () => <SceneA />;
                var container = document.createElement('div');
                var root = createRoot(container)
                act(() => {
                    root.render(
                        <NavigationHandler stateNavigator={stateNavigator}>
                            {stack}
                        </NavigationHandler>
                    );
                });
                act(() => {
                    unloadedA = false;
                    stateNavigator.navigate('sceneA');
                });
                try {
                    assert.equal(unloadedA, false);
                } finally {
                    act(() => root.unmount());
                }
            });
        }
        describe('Motion', () => {
            test(
                <NavigationMotion>
                    {(_style, scene, key) =>  <div key={key}>{scene}</div>}
                </NavigationMotion>
            );
        });
        describe('Stack', () => {
            test(<NavigationStack />);
        });
    });

    describe('A to B', function () {
        const test = stack => {
            it('should call unloaded hook on A and not on B', function(){
                var stateNavigator = new StateNavigator([
                    { key: 'sceneA' },
                    { key: 'sceneB' }
                ]);
                stateNavigator.navigate('sceneA');
                var {sceneA, sceneB} = stateNavigator.states;
                var unloadedA, unloadedB;
                var SceneA = () => {
                    useUnloaded(() => {
                        unloadedA = true;
                    })
                    return <div />;
                };
                var SceneB = () => {
                    useUnloaded(() => {
                        unloadedB = true;
                    })
                    return <div />;
                };
                sceneA.renderScene = () => <SceneA />;
                sceneB.renderScene = () => <SceneB />;
                var container = document.createElement('div');
                var root = createRoot(container)
                act(() => {
                    root.render(
                        <NavigationHandler stateNavigator={stateNavigator}>
                            {stack}
                        </NavigationHandler>
                    );
                });
                act(() => {
                    unloadedA = unloadedB = false;
                    stateNavigator.navigate('sceneB');
                });
                try {
                    assert.equal(unloadedA, true);
                    assert.equal(unloadedB, false);
                } finally {
                    act(() => root.unmount());
                }
            });
        }
        describe('Motion', () => {
            test(
                <NavigationMotion>
                    {(_style, scene, key) =>  <div key={key}>{scene}</div>}
                </NavigationMotion>
            );
        });
        describe('Stack', () => {
            test(<NavigationStack />);
        });
    });

    describe('A -> B to C -> B', function () {
        const test = stack => {
            it('should not call unloaded hook on A, B or C', function(){
                var stateNavigator = new StateNavigator([
                    { key: 'sceneA' },
                    { key: 'sceneB', trackCrumbTrail: true },
                    { key: 'sceneC' }
                ]);
                stateNavigator.navigate('sceneA');
                var {sceneA, sceneB, sceneC} = stateNavigator.states;
                var unloadedA, unloadedB, unloadedC;
                var SceneA = () => {
                    useUnloaded(() => {
                        unloadedA = true;
                    })
                    return <div />;
                };
                var SceneB = () => {
                    useUnloaded(() => {
                        unloadedB = true;
                    })
                    return <div />;
                };
                var SceneC = () => {
                    useUnloaded(() => {
                        unloadedC = true;
                    })
                    return <div />;
                };
                sceneA.renderScene = () => <SceneA />;
                sceneB.renderScene = () => <SceneB />;
                sceneC.renderScene = () => <SceneC />;
                var container = document.createElement('div');
                var root = createRoot(container)
                act(() => {
                    root.render(
                        <NavigationHandler stateNavigator={stateNavigator}>
                            {stack}
                        </NavigationHandler>
                    );
                });
                act(() => stateNavigator.navigate('sceneB'));
                act(() => {
                    unloadedA = unloadedB = unloadedC = false;
                    var url = stateNavigator.fluent()
                        .navigate('sceneC')
                        .navigate('sceneB').url;
                    stateNavigator.navigateLink(url);
                });
                try {
                    assert.equal(unloadedA, false);
                    assert.equal(unloadedB, false);
                    assert.equal(unloadedC, false);
                } finally {
                    act(() => root.unmount());
                }
            });
        }
        describe('Motion', () => {
            test(
                <NavigationMotion>
                    {(_style, scene, key) =>  <div key={key}>{scene}</div>}
                </NavigationMotion>
            );
        });
        describe('Stack', () => {
            test(<NavigationStack />);
        });
    });

    describe('A -> B to C -> D', function () {
        const test = stack => {
            it('should call unloaded hook on B and not on A, C, or D', function(){
                var stateNavigator = new StateNavigator([
                    { key: 'sceneA' },
                    { key: 'sceneB', trackCrumbTrail: true },
                    { key: 'sceneC' },
                    { key: 'sceneD', trackCrumbTrail: true }
                ]);
                stateNavigator.navigate('sceneA');
                var {sceneA, sceneB, sceneC, sceneD} = stateNavigator.states;
                var unloadedA, unloadedB, unloadedC, unloadedD;
                var SceneA = () => {
                    useUnloaded(() => {
                        unloadedA = true;
                    })
                    return <div />;
                };
                var SceneB = () => {
                    useUnloaded(() => {
                        unloadedB = true;
                    })
                    return <div />;
                };
                var SceneC = () => {
                    useUnloaded(() => {
                        unloadedC = true;
                    })
                    return <div />;
                };
                var SceneD = () => {
                    useUnloaded(() => {
                        unloadedD = true;
                    })
                    return <div />;
                };
                sceneA.renderScene = () => <SceneA />;
                sceneB.renderScene = () => <SceneB />;
                sceneC.renderScene = () => <SceneC />;
                sceneD.renderScene = () => <SceneD />;
                var container = document.createElement('div');
                var root = createRoot(container)
                act(() => {
                    root.render(
                        <NavigationHandler stateNavigator={stateNavigator}>
                            {stack}
                        </NavigationHandler>
                    );
                });
                act(() => stateNavigator.navigate('sceneB'));
                act(() => {
                    unloadedA = unloadedB = unloadedC = unloadedD = false;
                    var url = stateNavigator.fluent()
                        .navigate('sceneC')
                        .navigate('sceneD').url;
                    stateNavigator.navigateLink(url);
                });
                try {
                    assert.equal(unloadedA, false);
                    assert.equal(unloadedB, true);
                    assert.equal(unloadedC, false);
                    assert.equal(unloadedD, false);
                } finally {
                    act(() => root.unmount());
                }
            });
        }
        describe('Motion', () => {
            test(
                <NavigationMotion>
                    {(_style, scene, key) =>  <div key={key}>{scene}</div>}
                </NavigationMotion>
            );
        });
        describe('Stack', () => {
            test(<NavigationStack />);
        });
    });

    describe('A to A --> B -> C', function () {
        const test = stack => {
            it('should call unloaded hook on A and not on B or C', function(){
                var stateNavigator = new StateNavigator([
                    { key: 'sceneA' },
                    { key: 'sceneB', trackCrumbTrail: true },
                    { key: 'sceneC', trackCrumbTrail: true }
                ]);
                stateNavigator.navigate('sceneA');
                var {sceneA, sceneB, sceneC} = stateNavigator.states;
                var unloadedA, unloadedB, unloadedC;
                var SceneA = () => {
                    useUnloaded(() => {
                        unloadedA = true;
                    })
                    return <div />;
                };
                var SceneB = () => {
                    useUnloaded(() => {
                        unloadedB = true;
                    })
                    return <div />;
                };
                var SceneC = () => {
                    useUnloaded(() => {
                        unloadedC = true;
                    })
                    return <div />;
                };
                sceneA.renderScene = () => <SceneA />;
                sceneB.renderScene = () => <SceneB />;
                sceneC.renderScene = () => <SceneC />;
                var container = document.createElement('div');
                var root = createRoot(container)
                act(() => {
                    root.render(
                        <NavigationHandler stateNavigator={stateNavigator}>
                            {stack}
                        </NavigationHandler>
                    );
                });
                act(() => {
                    unloadedA = unloadedB = unloadedC = false;
                    var url = stateNavigator.fluent(true)
                        .navigate('sceneB')
                        .navigate('sceneC').url;
                    stateNavigator.navigateLink(url);
                });
                try {
                    assert.equal(unloadedA, true);
                    assert.equal(unloadedB, false);
                    assert.equal(unloadedC, false);
                } finally {
                    act(() => root.unmount());
                }
            });
        }
        describe('Motion', () => {
            test(
                <NavigationMotion>
                    {(_style, scene, key) =>  <div key={key}>{scene}</div>}
                </NavigationMotion>
            );
        });
        describe('Stack', () => {
            test(<NavigationStack />);
        });
    });

    describe('A to A -> B -> C to A -> B', function () {
        const test = stack => {
            it('should call unloaded hook on C and not A or B', function(){
                var stateNavigator = new StateNavigator([
                    { key: 'sceneA' },
                    { key: 'sceneB', trackCrumbTrail: true },
                    { key: 'sceneC', trackCrumbTrail: true }
                ]);
                stateNavigator.navigate('sceneA');
                var {sceneA, sceneB, sceneC} = stateNavigator.states;
                var unloadedA, unloadedB, unloadedC;
                var SceneA = () => {
                    useUnloaded(() => {
                        unloadedA = true;
                    })
                    return <div />;
                };
                var SceneB = () => {
                    useUnloaded(() => {
                        unloadedB = true;
                    })
                    return <div />;
                };
                var SceneC = () => {
                    useUnloaded(() => {
                        unloadedC = true;
                    })
                    return <div />;
                };
                sceneA.renderScene = () => <SceneA />;
                sceneB.renderScene = () => <SceneB />;
                sceneC.renderScene = () => <SceneC />;
                var container = document.createElement('div');
                var root = createRoot(container)
                act(() => {
                    root.render(
                        <NavigationHandler stateNavigator={stateNavigator}>
                            {stack}
                        </NavigationHandler>
                    );
                });
                act(() => {
                    var url = stateNavigator.fluent(true)
                        .navigate('sceneB')
                        .navigate('sceneC').url;
                    stateNavigator.navigateLink(url);
                });
                act(() => {
                    unloadedA = unloadedB = unloadedC = false;
                    stateNavigator.navigateBack(1);
                });
                try {
                    assert.equal(unloadedA, false);
                    assert.equal(unloadedB, false);
                    assert.equal(unloadedC, true);
                } finally {
                    act(() => root.unmount());
                }
            });
        }
        describe('Motion', () => {
            test(
                <NavigationMotion>
                    {(_style, scene, key) =>  <div key={key}>{scene}</div>}
                </NavigationMotion>
            );
        });
        describe('Stack', () => {
            test(<NavigationStack />);
        });
    });

    describe('A to A -> B to A to A -> B to A', function () {
        const test = stack => {
            it('should call unloaded hook on B and not A', function(){
                var stateNavigator = new StateNavigator([
                    { key: 'sceneA' },
                    { key: 'sceneB', trackCrumbTrail: true }
                ]);
                stateNavigator.navigate('sceneA');
                var {sceneA, sceneB} = stateNavigator.states;
                var unloadedA, unloadedB;
                var SceneA = () => {
                    useUnloaded(() => {
                        unloadedA = true;
                    })
                    return <div />;
                };
                var SceneB = () => {
                    useUnloaded(() => {
                        unloadedB = true;
                    })
                    return <div />;
                };
                sceneA.renderScene = () => <SceneA />;
                sceneB.renderScene = () => <SceneB />;
                var container = document.createElement('div');
                var root = createRoot(container)
                act(() => {
                    root.render(
                        <NavigationHandler stateNavigator={stateNavigator}>
                            {stack}
                        </NavigationHandler>
                    );
                });
                act(() => {
                    stateNavigator.navigate('sceneB');
                    stateNavigator.navigate('sceneA');
                    stateNavigator.navigate('sceneB');
                });
                act(() => {
                    unloadedA = unloadedB = false;
                    stateNavigator.navigate('sceneA');
                });
                try {
                    assert.equal(unloadedA, false);
                    assert.equal(unloadedB, true);
                } finally {
                    act(() => root.unmount());
                }
            });
        }
        describe('Motion', () => {
            test(
                <NavigationMotion>
                    {(_style, scene, key) =>  <div key={key}>{scene}</div>}
                </NavigationMotion>
            );
        });
        describe('Stack', () => {
            test(<NavigationStack />);
        });
    });

    describe('A -> B -> C to A', function () {
        const test = stack => {
            it('should call unloaded hook on C and not on A or B', function(){
                var stateNavigator = new StateNavigator([
                    { key: 'sceneA' },
                    { key: 'sceneB', trackCrumbTrail: true },
                    { key: 'sceneC', trackCrumbTrail: true }
                ]);
                stateNavigator.navigate('sceneA');
                var {sceneA, sceneB, sceneC} = stateNavigator.states;
                var unloadedA, unloadedB, unloadedC;
                var SceneA = () => {
                    useUnloaded(() => {
                        unloadedA = true;
                    })
                    return <div />;
                };
                var SceneB = () => {
                    useUnloaded(() => {
                        unloadedB = true;
                    })
                    return <div />;
                };
                var SceneC = () => {
                    useUnloaded(() => {
                        unloadedC = true;
                    })
                    return <div />;
                };
                sceneA.renderScene = () => <SceneA />;
                sceneB.renderScene = () => <SceneB />;
                sceneC.renderScene = () => <SceneC />;
                var container = document.createElement('div');
                var root = createRoot(container)
                act(() => {
                    root.render(
                        <NavigationHandler stateNavigator={stateNavigator}>
                            {stack}
                        </NavigationHandler>
                    );
                });
                act(() => {
                    stateNavigator.navigate('sceneB');
                    stateNavigator.navigate('sceneC');
                });
                act(() => {
                    unloadedA = unloadedB = unloadedC = false;
                    stateNavigator.navigateBack(2);
                });
                try {
                    assert.equal(unloadedA, false);
                    assert.equal(unloadedB, false);
                    assert.equal(unloadedC, true);
                } finally {
                    act(() => root.unmount());
                }
            });
        }
        describe('Motion', () => {
            test(
                <NavigationMotion>
                    {(_style, scene, key) =>  <div key={key}>{scene}</div>}
                </NavigationMotion>
            );
        });
        describe('Stack', () => {
            test(<NavigationStack />);
        });
    });

    describe('A -> B -> C to B', function () {
        const test = stack => {
            it('should call unloaded hook on C and not on A or B', function(){
                var stateNavigator = new StateNavigator([
                    { key: 'sceneA' },
                    { key: 'sceneB', trackCrumbTrail: true },
                    { key: 'sceneC', trackCrumbTrail: true }
                ]);
                stateNavigator.navigate('sceneA');
                var {sceneA, sceneB, sceneC} = stateNavigator.states;
                var unloadedA, unloadedB, unloadedC;
                var SceneA = () => {
                    useUnloaded(() => {
                        unloadedA = true;
                    })
                    return <div />;
                };
                var SceneB = () => {
                    useUnloaded(() => {
                        unloadedB = true;
                    })
                    return <div />;
                };
                var SceneC = () => {
                    useUnloaded(() => {
                        unloadedC = true;
                    })
                    return <div />;
                };
                sceneA.renderScene = () => <SceneA />;
                sceneB.renderScene = () => <SceneB />;
                sceneC.renderScene = () => <SceneC />;
                var container = document.createElement('div');
                var root = createRoot(container)
                act(() => {
                    root.render(
                        <NavigationHandler stateNavigator={stateNavigator}>
                            {stack}
                        </NavigationHandler>
                    );
                });
                act(() => {
                    stateNavigator.navigate('sceneB');
                    stateNavigator.navigate('sceneC');
                });
                act(() => {
                    unloadedA = unloadedB = unloadedC = false;
                    var url = stateNavigator.fluent()
                        .navigate('sceneB').url;
                    stateNavigator.navigateLink(url);
                });
                try {
                    assert.equal(unloadedA, false);
                    assert.equal(unloadedB, false);
                    assert.equal(unloadedC, true);
                } finally {
                    act(() => root.unmount());
                }
            });
        }
        describe('Motion', () => {
            test(
                <NavigationMotion>
                    {(_style, scene, key) =>  <div key={key}>{scene}</div>}
                </NavigationMotion>
            );
        });
        describe('Stack', () => {
            test(<NavigationStack />);
        });
    });

    describe('Suspend navigation', function () {
        const test = stack => {
            it('should not call unloaded hook', function(){
                var stateNavigator = new StateNavigator([
                    { key: 'sceneA' },
                    { key: 'sceneB', trackCrumbTrail: true }
                ]);
                stateNavigator.navigate('sceneA');
                var {sceneA, sceneB} = stateNavigator.states;
                var unloadedA, unloadedB;
                var SceneA = () => {
                    useUnloaded(() => {
                        unloadedA = true;
                    })
                    return <div />;
                };
                var SceneB = () => {
                    useUnloaded(() => {
                        unloadedB = true;
                    })
                    return <div />;
                };
                sceneA.renderScene = () => <SceneA />;
                sceneB.renderScene = () => <SceneB />;
                var container = document.createElement('div');
                var root = createRoot(container)
                act(() => {
                    root.render(
                        <NavigationHandler stateNavigator={stateNavigator}>
                            {stack}
                        </NavigationHandler>
                    );
                });
                act(() => {
                    unloadedA = unloadedB = false;
                    var url = stateNavigator.getNavigationLink('sceneB');
                    stateNavigator.navigateLink(url, undefined, false, () => {});
                });
                try {
                    assert.equal(unloadedA, false);
                    assert.equal(unloadedB, false);
                } finally {
                    act(() => root.unmount());
                }
            });
        }
        describe('Motion', () => {
            test(
                <NavigationMotion>
                    {(_style, scene, key) =>  <div key={key}>{scene}</div>}
                </NavigationMotion>
            );
        });
        describe('Stack', () => {
            test(<NavigationStack />);
        });
    });

    describe('Set state', function () {
        const test = stack => {
            it('should not call unloaded hook', function(){
                var stateNavigator = new StateNavigator([
                    { key: 'sceneA' }
                ]);
                stateNavigator.navigate('sceneA');
                var {sceneA} = stateNavigator.states;
                var unloadedA;
                var setCountA;
                var SceneA = () => {
                    var [count, setCount]  = useState(0);
                    setCountA = setCount;
                    useUnloaded(() => {
                        unloadedA = true;
                    })
                    return <div />;
                };
                sceneA.renderScene = () => <SceneA />;
                var container = document.createElement('div');
                var root = createRoot(container)
                act(() => {
                    root.render(
                        <NavigationHandler stateNavigator={stateNavigator}>
                            {stack}
                        </NavigationHandler>
                    );
                });
                act(() => {
                    unloadedA = false;
                    setCountA(1);
                });
                try {
                    assert.equal(unloadedA, false);
                } finally {
                    act(() => root.unmount());
                }
            });
        }
        describe('Motion', () => {
            test(
                <NavigationMotion>
                    {(_style, scene, key) =>  <div key={key}>{scene}</div>}
                </NavigationMotion>
            );
        });
        describe('Stack', () => {
            test(<NavigationStack />);
        });
    });

    describe('Unloaded handler state', function () {
        const test = stack => {
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
                    useUnloaded(() => {
                        countA = count;
                    })
                    return <div />;
                };
                var SceneB = () => <div />;
                sceneA.renderScene = () => <SceneA />;
                sceneB.renderScene = () => <SceneB />;
                var container = document.createElement('div');
                var root = createRoot(container)
                act(() => {
                    root.render(
                        <NavigationHandler stateNavigator={stateNavigator}>
                            {stack}
                        </NavigationHandler>
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
            });
        }
        describe('Motion', () => {
            test(
                <NavigationMotion>
                    {(_style, scene, key) =>  <div key={key}>{scene}</div>}
                </NavigationMotion>
            );
        });
        describe('Stack', () => {
            test(<NavigationStack />);
        });
    });

    describe('Unloaded handler context', function () {
        const test = stack => {
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
                    useUnloaded(() => {
                        var {stateContext} = navigationEvent.stateNavigator;
                        stateContextA = stateContext;
                    })
                    return <div />;
                };
                var SceneB = () => <div />;
                sceneA.renderScene = () => <SceneA />;
                sceneB.renderScene = () => <SceneB />;
                var container = document.createElement('div');
                var root = createRoot(container)
                act(() => {
                    root.render(
                        <NavigationHandler stateNavigator={stateNavigator}>
                            {stack}
                        </NavigationHandler>
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
            });
        }
        describe('Motion', () => {
            test(
                <NavigationMotion>
                    {(_style, scene, key) =>  <div key={key}>{scene}</div>}
                </NavigationMotion>
            );
        });
        describe('Stack', () => {
            test(<NavigationStack />);
        });
    });

    describe('Unloaded handler data', function () {
        const test = stack => {
            it('should access data', function(){
                var stateNavigator = new StateNavigator([
                    { key: 'sceneA', defaultTypes: {x: 'number'} },
                    { key: 'sceneB', defaultTypes: {y: 'number'}, trackCrumbTrail: true },
                    { key: 'sceneC', trackCrumbTrail: true }
                ]);
                stateNavigator.navigate('sceneA', {x: 0});
                var {sceneA, sceneB, sceneC} = stateNavigator.states;
                var stateC, dataC, stateContextC;
                var SceneA = () => <div />;
                var SceneB = () => <div />;
                var SceneC = () => {
                    useUnloaded((state, data, stateContext) => {
                        stateC = state;
                        dataC = data;
                        stateContextC = stateContext;
                    })
                    return <div />;
                };
                sceneA.renderScene = () => <SceneA />;
                sceneB.renderScene = () => <SceneB />;
                sceneC.renderScene = () => <SceneC />;
                var container = document.createElement('div');
                var root = createRoot(container)
                act(() => {
                    root.render(
                        <NavigationHandler stateNavigator={stateNavigator}>
                            <NavigationMotion>
                                {(_style, scene, key) =>  <div key={key}>{scene}</div>}
                            </NavigationMotion>
                        </NavigationHandler>
                    );
                });
                act(() => {
                    stateNavigator.navigate('sceneB', {y: 1});
                    stateNavigator.navigate('sceneC');
                });
                act(() => {
                    stateC = dataC = stateContextC = null;
                    stateNavigator.navigateBack(1);
                });
                try {
                    assert.equal(stateC, sceneB);
                    assert.equal(dataC.y, 1);
                    assert.equal(stateContextC.url, '/sceneB?y=1&crumb=%2FsceneA%3Fx%3D0');
                    assert.equal(stateContextC.crumbs.length, 1);
                    assert.equal(stateContextC.crumbs[0].state, sceneA);
                    assert.equal(stateContextC.crumbs[0].data.x, 0);
                    assert.equal(stateContextC.history, false);
                } finally {
                    act(() => root.unmount());
                }
            });
        }
        describe('Motion', () => {
            test(
                <NavigationMotion>
                    {(_style, scene, key) =>  <div key={key}>{scene}</div>}
                </NavigationMotion>
            );
        });
        describe('Stack', () => {
            test(<NavigationStack />);
        });
    });

    describe('Unloaded set state', function () {
        const test = stack => {
            it('should render', function(){
                var stateNavigator = new StateNavigator([
                    { key: 'sceneA' },
                    { key: 'sceneB', trackCrumbTrail: true }
                ]);
                stateNavigator.navigate('sceneA');
                var {sceneA, sceneB} = stateNavigator.states;
                var SceneA = () => {
                    var [unloaded, setUnloaded] = useState(false)
                    useUnloaded(() => {
                        setUnloaded(true);
                    })
                    return <div id='sceneA' data-unloaded={unloaded} />;
                };
                var SceneB = () => <div />;
                sceneA.renderScene = () => <SceneA />;
                sceneB.renderScene = () => <SceneB />;
                var container = document.createElement('div');
                var root = createRoot(container)
                act(() => {
                    root.render(
                        <NavigationHandler stateNavigator={stateNavigator}>
                            {stack}
                        </NavigationHandler>
                    );
                });
                act(() => {
                    stateNavigator.navigate('sceneB');
                });
                try {
                    var scene = container.querySelector<HTMLDivElement>("#sceneA");                
                    assert.strictEqual(scene.dataset.unloaded, 'true');
                } finally {
                    act(() => root.unmount());
                }
            });
        }
        describe('Motion', () => {
            test(
                <NavigationMotion>
                    {(_style, scene, key) =>  <div key={key}>{scene}</div>}
                </NavigationMotion>
            );
        });
        describe('Stack', () => {
            test(<NavigationStack />);
        });
    });
});
