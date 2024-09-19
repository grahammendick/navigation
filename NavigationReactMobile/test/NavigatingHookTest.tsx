import assert from 'assert';
import 'mocha';
import { StateNavigator } from 'navigation';
import { NavigationContext, NavigationHandler } from 'navigation-react';
//@ts-ignore
import { NavigationMotion, NavigationStack, useNavigating } from 'navigation-react-mobile';
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

describe('NavigatingHook', function () {
    describe('A', function () {
        const test = stack => {
            it('should not call navigating hook', function(){
                var stateNavigator = new StateNavigator([
                    { key: 'sceneA' }
                ]);
                stateNavigator.navigate('sceneA');
                var {sceneA} = stateNavigator.states;
                var navigatingA;
                var SceneA = () => {
                    useNavigating(() => {
                        navigatingA = true;
                    })
                    return <div />;
                };
                sceneA.renderScene = () => <SceneA />;
                var container = document.createElement('div');
                var root = createRoot(container)
                act(() => {
                    navigatingA = false;
                    root.render(
                        <NavigationHandler stateNavigator={stateNavigator}>
                            {stack}
                        </NavigationHandler>
                    );
                });
                try {
                    assert.equal(navigatingA, false);
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
            it('should not call navigating hook on on A or B', function(){
                var stateNavigator = new StateNavigator([
                    { key: 'sceneA' },
                    { key: 'sceneB', trackCrumbTrail: true }
                ]);
                stateNavigator.navigate('sceneA');
                stateNavigator.navigate('sceneB');
                var {sceneA, sceneB} = stateNavigator.states;
                var navigatingA, navigatingB;
                var SceneA = () => {
                    useNavigating(() => {
                        navigatingA = true;
                    })
                    return <div />;
                };
                var SceneB = () => {
                    useNavigating(() => {
                        navigatingB = true;
                    })
                    return <div />;
                };
                sceneA.renderScene = () => <SceneA />;
                sceneB.renderScene = () => <SceneB />;
                var container = document.createElement('div');
                var root = createRoot(container)
                act(() => {
                    navigatingA = navigatingB = false;
                    root.render(
                        <NavigationHandler stateNavigator={stateNavigator}>
                            {stack}
                        </NavigationHandler>
                    );
                });
                try {
                    assert.equal(navigatingA, false);
                    assert.equal(navigatingB, false);
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
            it('should not call navigating hook on A or B', function(){
                var stateNavigator = new StateNavigator([
                    { key: 'sceneA' },
                    { key: 'sceneB', trackCrumbTrail: true }
                ]);
                stateNavigator.navigate('sceneA');
                var {sceneA, sceneB} = stateNavigator.states;
                var navigatingA, navigatingB;
                var SceneA = () => {
                    useNavigating(() => {
                        navigatingA = true;
                    })
                    return <div />;
                };
                var SceneB = () => {
                    useNavigating(() => {
                        navigatingB = true;
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
                    navigatingA = navigatingB = false;
                    stateNavigator.navigate('sceneB');
                });
                try {
                    assert.equal(navigatingA, false);
                    assert.equal(navigatingB, false);
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
            it('should call navigating hook on A and not on B', function(){
                var stateNavigator = new StateNavigator([
                    { key: 'sceneA' },
                    { key: 'sceneB', trackCrumbTrail: true }
                ]);
                stateNavigator.navigate('sceneA');
                var {sceneA, sceneB} = stateNavigator.states;
                var navigatingA, navigatingB;
                var SceneA = () => {
                    useNavigating(() => {
                        navigatingA = true;
                    })
                    return <div />;
                };
                var SceneB = () => {
                    useNavigating(() => {
                        navigatingB = true;
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
                    navigatingA = navigatingB = false;
                    stateNavigator.navigateBack(1);
                });
                try {
                    assert.equal(navigatingA, true);
                    assert.equal(navigatingB, false);
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
            it('should call navigating hook', function(){
                var stateNavigator = new StateNavigator([
                    { key: 'sceneA' }
                ]);
                stateNavigator.navigate('sceneA');
                var {sceneA} = stateNavigator.states;
                var navigatingA;
                var SceneA = () => {
                    useNavigating(() => {
                        navigatingA = true;
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
                    navigatingA = false;
                    stateNavigator.navigate('sceneA');
                });
                try {
                    assert.equal(navigatingA, true);
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
            it('should not call navigating hook on A or B', function(){
                var stateNavigator = new StateNavigator([
                    { key: 'sceneA' },
                    { key: 'sceneB' }
                ]);
                stateNavigator.navigate('sceneA');
                var {sceneA, sceneB} = stateNavigator.states;
                var navigatingA, navigatingB;
                var SceneA = () => {
                    useNavigating(() => {
                        navigatingA = true;
                    })
                    return <div />;
                };
                var SceneB = () => {
                    useNavigating(() => {
                        navigatingB = true;
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
                    navigatingA = navigatingB = false;
                    stateNavigator.navigate('sceneB');
                });
                try {
                    assert.equal(navigatingA, false);
                    assert.equal(navigatingB, false);
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
            it('should call navigating hook on B and not on A or C', function(){
                var stateNavigator = new StateNavigator([
                    { key: 'sceneA' },
                    { key: 'sceneB', trackCrumbTrail: true },
                    { key: 'sceneC' }
                ]);
                stateNavigator.navigate('sceneA');
                var {sceneA, sceneB, sceneC} = stateNavigator.states;
                var navigatingA, navigatingB, navigatingC;
                var SceneA = () => {
                    useNavigating(() => {
                        navigatingA = true;
                    })
                    return <div />;
                };
                var SceneB = () => {
                    useNavigating(() => {
                        navigatingB = true;
                    })
                    return <div />;
                };
                var SceneC = () => {
                    useNavigating(() => {
                        navigatingC = true;
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
                    navigatingA = navigatingB = navigatingC = false;
                    var url = stateNavigator.fluent()
                        .navigate('sceneC')
                        .navigate('sceneB').url;
                    stateNavigator.navigateLink(url);
                });
                try {
                    assert.equal(navigatingA, false);
                    assert.equal(navigatingB, true);
                    assert.equal(navigatingC, false);
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
            it('should not call navigating hook on A, B, C or D', function(){
                var stateNavigator = new StateNavigator([
                    { key: 'sceneA' },
                    { key: 'sceneB', trackCrumbTrail: true },
                    { key: 'sceneC' },
                    { key: 'sceneD', trackCrumbTrail: true }
                ]);
                stateNavigator.navigate('sceneA');
                var {sceneA, sceneB, sceneC, sceneD} = stateNavigator.states;
                var navigatingA, navigatingB, navigatingC, navigatingD;
                var SceneA = () => {
                    useNavigating(() => {
                        navigatingA = true;
                    })
                    return <div />;
                };
                var SceneB = () => {
                    useNavigating(() => {
                        navigatingB = true;
                    })
                    return <div />;
                };
                var SceneC = () => {
                    useNavigating(() => {
                        navigatingC = true;
                    })
                    return <div />;
                };
                var SceneD = () => {
                    useNavigating(() => {
                        navigatingD = true;
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
                    navigatingA = navigatingB = navigatingC = navigatingD = false;
                    var url = stateNavigator.fluent()
                        .navigate('sceneC')
                        .navigate('sceneD').url;
                    stateNavigator.navigateLink(url);
                });
                try {
                    assert.equal(navigatingA, false);
                    assert.equal(navigatingB, false);
                    assert.equal(navigatingC, false);
                    assert.equal(navigatingD, false);
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
            it('should not call navigating hook on A, B or C', function(){
                var stateNavigator = new StateNavigator([
                    { key: 'sceneA' },
                    { key: 'sceneB', trackCrumbTrail: true },
                    { key: 'sceneC', trackCrumbTrail: true }
                ]);
                stateNavigator.navigate('sceneA');
                var {sceneA, sceneB, sceneC} = stateNavigator.states;
                var navigatingA, navigatingB, navigatingC;
                var SceneA = () => {
                    useNavigating(() => {
                        navigatingA = true;
                    })
                    return <div />;
                };
                var SceneB = () => {
                    useNavigating(() => {
                        navigatingB = true;
                    })
                    return <div />;
                };
                var SceneC = () => {
                    useNavigating(() => {
                        navigatingC = true;
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
                    navigatingA = navigatingB = navigatingC = false;
                    var url = stateNavigator.fluent(true)
                        .navigate('sceneB')
                        .navigate('sceneC').url;
                    stateNavigator.navigateLink(url);
                });
                try {
                    assert.equal(navigatingA, false);
                    assert.equal(navigatingB, false);
                    assert.equal(navigatingC, false);
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
            it('should not call navigating hook on A, B or C', function(){
                var stateNavigator = new StateNavigator([
                    { key: 'sceneA' },
                    { key: 'sceneB', trackCrumbTrail: true },
                    { key: 'sceneC', trackCrumbTrail: true }
                ]);
                stateNavigator.navigate('sceneA');
                var {sceneA, sceneB, sceneC} = stateNavigator.states;
                var navigatingA, navigatingB, navigatingC;
                var SceneA = () => {
                    useNavigating(() => {
                        navigatingA = true;
                    })
                    return <div />;
                };
                var SceneB = () => {
                    useNavigating(() => {
                        navigatingB = true;
                    })
                    return <div />;
                };
                var SceneC = () => {
                    useNavigating(() => {
                        navigatingC = true;
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
                    navigatingA = navigatingB = navigatingC = false;
                    stateNavigator.navigateBack(1);
                });
                try {
                    assert.equal(navigatingA, false);
                    assert.equal(navigatingB, false);
                    assert.equal(navigatingC, false);
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
            it('should call navigating hook on A and not B', function(){
                var stateNavigator = new StateNavigator([
                    { key: 'sceneA' },
                    { key: 'sceneB', trackCrumbTrail: true }
                ]);
                stateNavigator.navigate('sceneA');
                var {sceneA, sceneB} = stateNavigator.states;
                var navigatingA, navigatingB;
                var SceneA = () => {
                    useNavigating(() => {
                        navigatingA = true;
                    })
                    return <div />;
                };
                var SceneB = () => {
                    useNavigating(() => {
                        navigatingB = true;
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
                })
                act(() => {
                    navigatingA = navigatingB = false;
                    stateNavigator.navigate('sceneA');
                });
                try {
                    assert.equal(navigatingA, true);
                    assert.equal(navigatingB, false);
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
            it('should call navigating hook on A and not on B or C', function(){
                var stateNavigator = new StateNavigator([
                    { key: 'sceneA' },
                    { key: 'sceneB', trackCrumbTrail: true },
                    { key: 'sceneC', trackCrumbTrail: true }
                ]);
                stateNavigator.navigate('sceneA');
                var {sceneA, sceneB, sceneC} = stateNavigator.states;
                var navigatingA, navigatingB, navigatingC;
                var SceneA = () => {
                    useNavigating(() => {
                        navigatingA = true;
                    })
                    return <div />;
                };
                var SceneB = () => {
                    useNavigating(() => {
                        navigatingB = true;
                    })
                    return <div />;
                };
                var SceneC = () => {
                    useNavigating(() => {
                        navigatingC = true;
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
                    navigatingA = navigatingB = navigatingC = false;
                    stateNavigator.navigateBack(2);
                });
                try {
                    assert.equal(navigatingA, true);
                    assert.equal(navigatingB, false);
                    assert.equal(navigatingC, false);
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
            it('should not call navigating hook on A, B or C', function(){
                var stateNavigator = new StateNavigator([
                    { key: 'sceneA' },
                    { key: 'sceneB', trackCrumbTrail: true },
                    { key: 'sceneC', trackCrumbTrail: true }
                ]);
                stateNavigator.navigate('sceneA');
                var {sceneA, sceneB, sceneC} = stateNavigator.states;
                var navigatingA, navigatingB, navigatingC;
                var SceneA = () => {
                    useNavigating(() => {
                        navigatingA = true;
                    })
                    return <div />;
                };
                var SceneB = () => {
                    useNavigating(() => {
                        navigatingB = true;
                    })
                    return <div />;
                };
                var SceneC = () => {
                    useNavigating(() => {
                        navigatingC = true;
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
                    navigatingA = navigatingB = navigatingC = false;
                    var url = stateNavigator.fluent()
                        .navigate('sceneB').url;
                    stateNavigator.navigateLink(url);
                });
                try {
                    assert.equal(navigatingA, false);
                    assert.equal(navigatingB, false);
                    assert.equal(navigatingC, false);
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
            it('should call navigating hook', function(){
                var stateNavigator = new StateNavigator([
                    { key: 'sceneA' },
                    { key: 'sceneB', trackCrumbTrail: true }
                ]);
                stateNavigator.navigate('sceneA');
                var {sceneA, sceneB} = stateNavigator.states;
                var navigatingA, navigatingB;
                var SceneA = () => {
                    useNavigating(() => {
                        navigatingA = true;
                    })
                    return <div />;
                };
                var SceneB = () => {
                    useNavigating(() => {
                        navigatingB = true;
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
                    navigatingA = navigatingB = false;
                    var url = stateNavigator.getNavigationBackLink(1);
                    stateNavigator.navigateLink(url, undefined, false, () => {});
                });
                try {
                    assert.equal(navigatingA, true);
                    assert.equal(navigatingB, false);
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
            it('should not call navigating hook', function(){
                var stateNavigator = new StateNavigator([
                    { key: 'sceneA' }
                ]);
                stateNavigator.navigate('sceneA');
                var {sceneA} = stateNavigator.states;
                var navigatingA;
                var setCountA;
                var SceneA = () => {
                    var [count, setCount]  = useState(0);
                    setCountA = setCount;
                    useNavigating(() => {
                        navigatingA = true;
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
                    navigatingA = false;
                    setCountA(1);
                });
                try {
                    assert.equal(navigatingA, false);
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

    describe('Navigating handler state', function () {
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
                    useNavigating(() => {
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

    describe('Navigating handler context', function () {
        const test = stack => {
            it('should access current context', function(){
                var stateNavigator = new StateNavigator([
                    { key: 'sceneA' }
                ]);
                stateNavigator.navigate('sceneA', {x: 0});
                var {sceneA} = stateNavigator.states;
                var stateContextA;
                var SceneA = () => {
                    var navigationEvent = useContext(NavigationContext);
                    useNavigating(() => {
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
                    assert.equal(stateContextA.oldState, null);
                    assert.equal(stateContextA.oldData.x, undefined);
                    assert.equal(stateContextA.data.x, 0);
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

    describe('Navigating handler data', function () {
        const test = stack => {
            it('should access data', function(){
                var stateNavigator = new StateNavigator([
                    { key: 'sceneA', defaultTypes: {x: 'number', y:'number'} }
                ]);
                stateNavigator.navigate('sceneA', {x: 0});
                var {sceneA} = stateNavigator.states;
                var dataA, urlA, historyA, currentContextA;
                var SceneA = () => {
                    useNavigating((data, url, history, currentContext) => {
                        dataA = data;
                        urlA = url;
                        historyA = history;
                        currentContextA = currentContext;
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
                    dataA = urlA = historyA = currentContextA = null;
                    stateNavigator.navigate('sceneA', {y: 1});
                });
                try {
                    assert.equal(dataA.y, 1);
                    assert.equal(urlA, '/sceneA?y=1');
                    assert.equal(historyA, false);
                    assert.equal(currentContextA.data.x, 0);
                    assert.equal(currentContextA.url, '/sceneA?x=0');
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
