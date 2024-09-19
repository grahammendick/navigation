import assert from 'assert';
import 'mocha';
import { StateNavigator } from 'navigation';
import { NavigationContext, NavigationHandler } from 'navigation-react';
//@ts-ignore
import { NavigationMotion, NavigationStack, useNavigated } from 'navigation-react-mobile';
import React, { useState, useContext } from 'react';
import { createRoot } from 'react-dom/client';
import { act } from 'react-dom/test-utils';
import { JSDOM } from 'jsdom';

declare var global: any;
global.IS_REACT_ACT_ENVIRONMENT = true;
var { window } = new JSDOM('<!doctype html><html><body></body></html>', { pretendToBeVisual: true });
window.addEventListener = () => {};
global.window = window;
global.document = window.document;

describe('NavigatedHook', function () {
    describe('A', function () {
        const test = stack => {
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
                var root = createRoot(container)
                act(() => {
                    navigatedA = false;
                    root.render(
                        <NavigationHandler stateNavigator={stateNavigator}>
                            {stack}
                        </NavigationHandler>
                    );
                });
                try {
                    assert.equal(navigatedA, true);
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
                var root = createRoot(container)
                act(() => {
                    navigatedA = navigatedB = false;
                    root.render(
                        <NavigationHandler stateNavigator={stateNavigator}>
                            {stack}
                        </NavigationHandler>
                    );
                });
                try {
                    assert.equal(navigatedA, false);
                    assert.equal(navigatedB, true);
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
                var root = createRoot(container)
                act(() => {
                    root.render(
                        <NavigationHandler stateNavigator={stateNavigator}>
                            {stack}
                        </NavigationHandler>
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
                    navigatedA = navigatedB = false;
                    stateNavigator.navigateBack(1);
                });
                try {
                    assert.equal(navigatedA, true);
                    assert.equal(navigatedB, false);
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
                var root = createRoot(container)
                act(() => {
                    root.render(
                        <NavigationHandler stateNavigator={stateNavigator}>
                            {stack}
                        </NavigationHandler>
                    );
                });
                act(() => {
                    navigatedA = false;
                    stateNavigator.navigate('sceneA');
                });
                try {
                    assert.equal(navigatedA, true);
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
                var root = createRoot(container)
                act(() => {
                    root.render(
                        <NavigationHandler stateNavigator={stateNavigator}>
                            {stack}
                        </NavigationHandler>
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
                var root = createRoot(container)
                act(() => {
                    root.render(
                        <NavigationHandler stateNavigator={stateNavigator}>
                            {stack}
                        </NavigationHandler>
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
                    navigatedA = navigatedB = navigatedC = false;
                    stateNavigator.navigateBack(1);
                });
                try {
                    assert.equal(navigatedA, false);
                    assert.equal(navigatedB, true);
                    assert.equal(navigatedC, false);
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
                    navigatedA = navigatedB = false;
                    stateNavigator.navigate('sceneA');
                });
                try {
                    assert.equal(navigatedA, true);
                    assert.equal(navigatedB, false);
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
                    navigatedA = navigatedB = navigatedC = false;
                    stateNavigator.navigateBack(2);
                });
                try {
                    assert.equal(navigatedA, true);
                    assert.equal(navigatedB, false);
                    assert.equal(navigatedC, false);
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
                var root = createRoot(container)
                act(() => {
                    root.render(
                        <NavigationHandler stateNavigator={stateNavigator}>
                            {stack}
                        </NavigationHandler>
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
                var root = createRoot(container)
                act(() => {
                    root.render(
                        <NavigationHandler stateNavigator={stateNavigator}>
                            {stack}
                        </NavigationHandler>
                    );
                });
                act(() => {
                    navigatedA = false;
                    setCountA(1);
                });
                try {
                    assert.equal(navigatedA, false);
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

    describe('Navigated handler state', function () {
        const test = stack => {
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
                    stateNavigator.navigate('sceneA');
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

    describe('Navigated handler context', function () {
        const test = stack => {
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
                    stateNavigator.navigate('sceneA', {y: 1});
                });
                try {
                    assert.equal(stateContextA.oldState, sceneA);
                    assert.equal(stateContextA.oldData.x, 0);
                    assert.equal(stateContextA.data.y, 1);
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
