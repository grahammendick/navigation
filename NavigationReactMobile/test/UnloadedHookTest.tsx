import assert from 'assert';
import 'mocha';
import { StateNavigator } from 'navigation';
import { NavigationContext, NavigationHandler } from 'navigation-react';
import { NavigationMotion, useUnloaded } from 'navigation-react-mobile';
import React, { useState, useContext } from 'react';
import ReactDOM from 'react-dom';
import { act } from 'react-dom/test-utils';
import { JSDOM } from 'jsdom';

declare var global: any;
var { window } = new JSDOM('<!doctype html><html><body></body></html>', { pretendToBeVisual: true });
window.addEventListener = () => {};
global.window = window;
global.document = window.document;

describe('UnloadedHook', function () {
    describe('A', function () {
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
            act(() => {
                unloadedA = false;
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
                assert.equal(unloadedA, false);
            } finally {
                ReactDOM.unmountComponentAtNode(container);
            }
        })
    });

    describe('A -> B', function () {
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
            act(() => {
                unloadedA = unloadedB = false;
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
                assert.equal(unloadedA, false);
                assert.equal(unloadedB, false);
            } finally {
                ReactDOM.unmountComponentAtNode(container);
            }
        })
    });

    describe('A to A -> B', function () {
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
                unloadedA = unloadedB = false;
                stateNavigator.navigate('sceneB');
            });
            try {
                assert.equal(unloadedA, true);
                assert.equal(unloadedB, false);
            } finally {
                ReactDOM.unmountComponentAtNode(container);
            }
        })
    });

    describe('A -> B to A', function () {
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
                unloadedA = unloadedB = false;
                stateNavigator.navigateBack(1);
            });
            try {
                assert.equal(unloadedA, false);
                assert.equal(unloadedB, true);
            } finally {
                ReactDOM.unmountComponentAtNode(container);
            }
        })
    });

    describe('A to A', function () {
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
                unloadedA = false;
                stateNavigator.navigate('sceneA');
            });
            try {
                assert.equal(unloadedA, false);
            } finally {
                ReactDOM.unmountComponentAtNode(container);
            }
        })
    });

    describe('A to B', function () {
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
                unloadedA = unloadedB = false;
                stateNavigator.navigate('sceneB');
            });
            try {
                assert.equal(unloadedA, true);
                assert.equal(unloadedB, false);
            } finally {
                ReactDOM.unmountComponentAtNode(container);
            }
        })
    });

    describe('A -> B to C -> B', function () {
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
                ReactDOM.unmountComponentAtNode(container);
            }
        })
    });

    describe('A -> B to C -> D', function () {
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
                ReactDOM.unmountComponentAtNode(container);
            }
        })
    });

    describe('A to A --> B -> C', function () {
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
                ReactDOM.unmountComponentAtNode(container);
            }
        })
    });

    describe('A to A -> B -> C to A -> B', function () {
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
                unloadedA = unloadedB = unloadedC = false;
                stateNavigator.navigateBack(1);
            });
            try {
                assert.equal(unloadedA, false);
                assert.equal(unloadedB, false);
                assert.equal(unloadedC, true);
            } finally {
                ReactDOM.unmountComponentAtNode(container);
            }
        })
    });

    describe('A to A -> B to A to A -> B to A', function () {
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
                ReactDOM.unmountComponentAtNode(container);
            }
        })
    });

    describe('A -> B -> C to A', function () {
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
                ReactDOM.unmountComponentAtNode(container);
            }
        })
    });

    describe('A -> B -> C to B', function () {
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
                ReactDOM.unmountComponentAtNode(container);
            }
        })
    });

    describe('Suspend navigation', function () {
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
                unloadedA = unloadedB = false;
                var url = stateNavigator.getNavigationLink('sceneB');
                stateNavigator.navigateLink(url, undefined, false, () => {});
            });
            try {
                assert.equal(unloadedA, false);
                assert.equal(unloadedB, false);
            } finally {
                ReactDOM.unmountComponentAtNode(container);
            }
        })
    });

    describe('Set state', function () {
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
                unloadedA = false;
                setCountA(1);
            });
            try {
                assert.equal(unloadedA, false);
            } finally {
                ReactDOM.unmountComponentAtNode(container);
            }
        })
    });

    describe('Unloaded handler state', function () {
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
            act(() => {
                ReactDOM.render(
                    <NavigationHandler stateNavigator={stateNavigator}>
                        <NavigationMotion>
                            {(_style, scene, key) =>  <div key={key}>{scene}</div>}
                        </NavigationMotion>
                    </NavigationHandler>,
                    container
                );
                setCountA(1);
            });
            act(() => {
                countA = 0;
                stateNavigator.navigate('sceneB');
            });
            try {
                assert.equal(countA, 1);
            } finally {
                ReactDOM.unmountComponentAtNode(container);
            }
        })
    });
});
