import assert from 'assert';
import 'mocha';
import { StateNavigator } from 'navigation';
import { NavigationContext, NavigationHandler } from 'navigation-react';
import { NavigationMotion, useSceneNavigating } from 'navigation-react-mobile';
import React, { useState, useContext } from 'react';
import ReactDOM from 'react-dom';
import { act } from 'react-dom/test-utils';
import { JSDOM } from 'jsdom';

declare var global: any;
var { window } = new JSDOM('<!doctype html><html><body></body></html>', { pretendToBeVisual: true });
window.addEventListener = () => {};
global.window = window;
global.document = window.document;

describe('UseSceneNavigating', function () {
    describe('A', function () {
        it('should not call navigating hook', function(){
            var stateNavigator = new StateNavigator([
                { key: 'sceneA' }
            ]);
            stateNavigator.navigate('sceneA');
            var {sceneA} = stateNavigator.states;
            var navigatingA;
            var SceneA = () => {
                useSceneNavigating(() => {
                    navigatingA = true;
                })
                return <div />;
            };
            sceneA.renderScene = () => <SceneA />;
            var container = document.createElement('div');
            act(() => {
                navigatingA = false;
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
                assert.equal(navigatingA, false);
            } finally {
                ReactDOM.unmountComponentAtNode(container);
            }
        })
    });

    describe('A -> B', function () {
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
                useSceneNavigating(() => {
                    navigatingA = true;
                })
                return <div />;
            };
            var SceneB = () => {
                useSceneNavigating(() => {
                    navigatingB = true;
                })
                return <div />;
            };
            sceneA.renderScene = () => <SceneA />;
            sceneB.renderScene = () => <SceneB />;
            var container = document.createElement('div');
            act(() => {
                navigatingA = navigatingB = false;
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
                assert.equal(navigatingA, false);
                assert.equal(navigatingB, false);
            } finally {
                ReactDOM.unmountComponentAtNode(container);
            }
        })
    });

    describe('A to A -> B', function () {
        it('should not call navigating hook on A or B', function(){
            var stateNavigator = new StateNavigator([
                { key: 'sceneA' },
                { key: 'sceneB', trackCrumbTrail: true }
            ]);
            stateNavigator.navigate('sceneA');
            var {sceneA, sceneB} = stateNavigator.states;
            var navigatingA, navigatingB;
            var SceneA = () => {
                useSceneNavigating(() => {
                    navigatingA = true;
                })
                return <div />;
            };
            var SceneB = () => {
                useSceneNavigating(() => {
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
            act(() => {
                navigatingA = navigatingB = false;
                stateNavigator.navigate('sceneB');
            });
            try {
                assert.equal(navigatingA, false);
                assert.equal(navigatingB, false);
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
            var navigatingA, navigatingB;
            var SceneA = () => {
                useSceneNavigating(() => {
                    navigatingA = true;
                })
                return <div />;
            };
            var SceneB = () => {
                useSceneNavigating(() => {
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
                stateNavigator.navigate('sceneB');
            });
            act(() => {
                navigatingA = navigatingB = false;
                stateNavigator.navigateBack(1);
            });
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
            var navigatingA;
            var SceneA = () => {
                useSceneNavigating(() => {
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
            act(() => {
                navigatingA = false;
                stateNavigator.navigate('sceneA');
            });
            try {
                assert.equal(navigatingA, true);
            } finally {
                ReactDOM.unmountComponentAtNode(container);
            }
        })
    });

    describe('A to B', function () {
        it('should not call navigating hook on A or B', function(){
            var stateNavigator = new StateNavigator([
                { key: 'sceneA' },
                { key: 'sceneB' }
            ]);
            stateNavigator.navigate('sceneA');
            var {sceneA, sceneB} = stateNavigator.states;
            var navigatingA, navigatingB;
            var SceneA = () => {
                useSceneNavigating(() => {
                    navigatingA = true;
                })
                return <div />;
            };
            var SceneB = () => {
                useSceneNavigating(() => {
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
            act(() => {
                navigatingA = navigatingB = false;
                stateNavigator.navigate('sceneB');
            });
            try {
                assert.equal(navigatingA, false);
                assert.equal(navigatingB, false);
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
            var navigatingA, navigatingB, navigatingC;
            var SceneA = () => {
                useSceneNavigating(() => {
                    navigatingA = true;
                })
                return <div />;
            };
            var SceneB = () => {
                useSceneNavigating(() => {
                    navigatingB = true;
                })
                return <div />;
            };
            var SceneC = () => {
                useSceneNavigating(() => {
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
                stateNavigator.navigate('sceneB');
            });
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
                ReactDOM.unmountComponentAtNode(container);
            }
        })
    });

    describe('A -> B to C -> D', function () {
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
                useSceneNavigating(() => {
                    navigatingA = true;
                })
                return <div />;
            };
            var SceneB = () => {
                useSceneNavigating(() => {
                    navigatingB = true;
                })
                return <div />;
            };
            var SceneC = () => {
                useSceneNavigating(() => {
                    navigatingC = true;
                })
                return <div />;
            };
            var SceneD = () => {
                useSceneNavigating(() => {
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
                stateNavigator.navigate('sceneB');
            });
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
                ReactDOM.unmountComponentAtNode(container);
            }
        })
    });

    describe('A to A --> B -> C', function () {
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
                useSceneNavigating(() => {
                    navigatingA = true;
                })
                return <div />;
            };
            var SceneB = () => {
                useSceneNavigating(() => {
                    navigatingB = true;
                })
                return <div />;
            };
            var SceneC = () => {
                useSceneNavigating(() => {
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
                ReactDOM.unmountComponentAtNode(container);
            }
        })
    });

    describe('A to A -> B -> C to A -> B', function () {
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
                useSceneNavigating(() => {
                    navigatingA = true;
                })
                return <div />;
            };
            var SceneB = () => {
                useSceneNavigating(() => {
                    navigatingB = true;
                })
                return <div />;
            };
            var SceneC = () => {
                useSceneNavigating(() => {
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
                ReactDOM.unmountComponentAtNode(container);
            }
        })
    });

    describe('Suspend navigation', function () {
        it('should call navigating hook', function(){
            var stateNavigator = new StateNavigator([
                { key: 'sceneA' },
                { key: 'sceneB', trackCrumbTrail: true }
            ]);
            stateNavigator.navigate('sceneA');
            var {sceneA, sceneB} = stateNavigator.states;
            var navigatingA, navigatingB;
            var SceneA = () => {
                useSceneNavigating(() => {
                    navigatingA = true;
                })
                return <div />;
            };
            var SceneB = () => {
                useSceneNavigating(() => {
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
                stateNavigator.navigate('sceneB');
            });
            act(() => {
                navigatingA = navigatingB = false;
                var url = stateNavigator.getNavigationBackLink(1);
                stateNavigator.navigateLink(url, undefined, false, () => {});
            });
            try {
                assert.equal(navigatingA, true);
                assert.equal(navigatingB, false);
            } finally {
                ReactDOM.unmountComponentAtNode(container);
            }
        })
    });

    describe('Set state', function () {
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
                useSceneNavigating(() => {
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
            act(() => {
                navigatingA = false;
                setCountA(1);
            });
            try {
                assert.equal(navigatingA, false);
            } finally {
                ReactDOM.unmountComponentAtNode(container);
            }
        })
    });

    describe('Navigating handler state', function () {
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
                useSceneNavigating(() => {
                    countA = count;
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
                setCountA(1);
            });
            act(() => {
                countA = 0;
                stateNavigator.navigate('sceneA');
            });
            try {
                assert.equal(countA, 1);
            } finally {
                ReactDOM.unmountComponentAtNode(container);
            }
        })
    });

    describe('Navigating handler context', function () {
        it('should access current context', function(){
            var stateNavigator = new StateNavigator([
                { key: 'sceneA' }
            ]);
            stateNavigator.navigate('sceneA');
            var {sceneA} = stateNavigator.states;
            var oldState;
            var SceneA = () => {
                var navigationEvent = useContext(NavigationContext);
                useSceneNavigating(() => {
                    var {stateContext} = navigationEvent.stateNavigator;
                    oldState = stateContext.oldState;
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
                stateNavigator.navigate('sceneA');
            });
            try {
                assert.strictEqual(oldState, null);
            } finally {
                ReactDOM.unmountComponentAtNode(container);
            }
        })
    });

    describe('Navigating handler data', function () {
        it('should access data', function(){
            var stateNavigator = new StateNavigator([
                { key: 'sceneA', defaultTypes: {x: 'number', y:'number'} }
            ]);
            stateNavigator.navigate('sceneA', {x: 0});
            var {sceneA} = stateNavigator.states;
            var dataA, urlA, historyA, currentContextA;
            var SceneA = () => {
                useSceneNavigating((data, url, history, currentContext) => {
                    dataA = data;
                    urlA = url;
                    historyA = history;
                    currentContextA = currentContext;
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
                ReactDOM.unmountComponentAtNode(container);
            }
        })
    });
});
