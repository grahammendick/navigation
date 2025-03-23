import * as assert from 'assert';
import * as mocha from 'mocha';
import { StateNavigator } from 'navigation';
import { SceneView, NavigationHandler, useNavigationEvent } from 'navigation-react';
import React, { useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { act, Simulate } from 'react-dom/test-utils';
import { JSDOM } from 'jsdom';

declare var global: any;
global.IS_REACT_ACT_ENVIRONMENT = true;
var { window } = new JSDOM('<!doctype html><html><body></body></html>', { url: 'https://navigation.com' });
window.addEventListener = () => {};
global.window = window;
global.document = window.document;

describe('SceneViewTest', function () {
    describe('Scene View Active', function () {
        it('should render', function(){
            var stateNavigator = new StateNavigator([
                { key: 's' }
            ]);
            stateNavigator.navigate('s');
            var container = document.createElement('div');
            var root = createRoot(container)
            act(() => {
                root.render(
                    <NavigationHandler stateNavigator={stateNavigator}>
                        <SceneView active="s">
                            <div>scene</div>
                        </SceneView>
                    </NavigationHandler>
                );
            });
            assert.equal(container.innerHTML, '<div>scene</div>');
        })
    });

    describe('Scene View Inactive', function () {
        it('should not render', function(){
            var stateNavigator = new StateNavigator([
                { key: 's0'},
                { key: 's1'},
            ]);
            stateNavigator.navigate('s0');
            var container = document.createElement('div');
            var root = createRoot(container)
            act(() => {
                root.render(
                    <NavigationHandler stateNavigator={stateNavigator}>
                        <SceneView active="s1">
                            <div>scene</div>
                        </SceneView>
                    </NavigationHandler>
                );
            });
            assert.equal(container.innerHTML, '');
        })
    });

    describe('Scene View Active and Inactive', function () {
        it('should render and not render', function(){
            var stateNavigator = new StateNavigator([
                { key: 's0'},
                { key: 's1'},
            ]);
            stateNavigator.navigate('s0');
            var container = document.createElement('div');
            var root = createRoot(container)
            act(() => {
                root.render(
                    <NavigationHandler stateNavigator={stateNavigator}>
                        <SceneView active="s0">
                            <div>scene 0</div>
                        </SceneView>
                        <SceneView active="s1">
                            <div>scene 1</div>
                        </SceneView>
                    </NavigationHandler>
                );
            });
            assert.equal(container.innerHTML, '<div>scene 0</div>');
        })
    });

    describe('Scene View Array Active', function () {
        it('should render', function(){
            var stateNavigator = new StateNavigator([
                { key: 's0'},
                { key: 's1'},
                { key: 's2'},
            ]);
            stateNavigator.navigate('s1');
            var container = document.createElement('div');
            var root = createRoot(container)
            act(() => {
                root.render(
                    <NavigationHandler stateNavigator={stateNavigator}>
                        <SceneView active={["s0", "s1"]}>
                            <div>scene</div>
                        </SceneView>
                    </NavigationHandler>
                );
            });
            assert.equal(container.innerHTML, '<div>scene</div>');
        })
    });

    describe('Scene View Array Inactive', function () {
        it('should not render', function(){
            var stateNavigator = new StateNavigator([
                { key: 's0'},
                { key: 's1'},
                { key: 's2'},
            ]);
            stateNavigator.navigate('s1');
            var container = document.createElement('div');
            var root = createRoot(container)
            act(() => {
                root.render(
                    <NavigationHandler stateNavigator={stateNavigator}>
                        <SceneView active={["s0", "s2"]}>
                            <div>scene</div>
                        </SceneView>
                    </NavigationHandler>
                );
            });
            assert.equal(container.innerHTML, '');
        })
    });

    describe('Scene View Array Active and Inactive', function () {
        it('should render and not render', function(){
            var stateNavigator = new StateNavigator([
                { key: 's0'},
                { key: 's1'},
                { key: 's2'},
            ]);
            stateNavigator.navigate('s1');
            var container = document.createElement('div');
            var root = createRoot(container)
            act(() => {
                root.render(
                    <NavigationHandler stateNavigator={stateNavigator}>
                        <SceneView active={["s0", "s1"]}>
                            <div>scene 0</div>
                        </SceneView>
                        <SceneView active={["s0", "s2"]}>
                            <div>scene 1</div>
                        </SceneView>
                    </NavigationHandler>
                );
            });
            assert.equal(container.innerHTML, '<div>scene 0</div>');
        })
    });

    describe('Scene View Medley Active and Inactive', function () {
        it('should render and not render', function(){
            var stateNavigator = new StateNavigator([
                { key: 's0'},
                { key: 's1'},
                { key: 's2'},
            ]);
            stateNavigator.navigate('s1');
            var container = document.createElement('div');
            var root = createRoot(container)
            act(() => {
                root.render(
                    <NavigationHandler stateNavigator={stateNavigator}>
                        <SceneView active="s2">
                            <div>scene 0</div>
                        </SceneView>
                        <SceneView active="s1">
                            <div>scene 1</div>
                        </SceneView>
                        <SceneView active={["s0", "s1"]}>
                            <div>scene 0,1</div>
                        </SceneView>
                        <SceneView active={["s0", "s2"]}>
                            <div>scene 0,2</div>
                        </SceneView>
                    </NavigationHandler>
                );
            });
            assert.equal(container.innerHTML, '<div>scene 1</div><div>scene 0,1</div>');
        })
    });

    describe('Scene View Blank Context', function () {
        it('should not render', function(){
            var stateNavigator = new StateNavigator([
                { key: 's' }
            ]);
            var container = document.createElement('div');
            var root = createRoot(container)
            act(() => {
                root.render(
                    <NavigationHandler stateNavigator={stateNavigator}>
                        <SceneView active="s">
                            <div>scene</div>
                        </SceneView>
                    </NavigationHandler>
                );
            });
            assert.equal(container.innerHTML, '');
        })
    });

    describe('Scene View Array Blank Context', function () {
        it('should not render', function(){
            var stateNavigator = new StateNavigator([
                { key: 's0' },
                { key: 's1' },
            ]);
            var container = document.createElement('div');
            var root = createRoot(container)
            act(() => {
                root.render(
                    <NavigationHandler stateNavigator={stateNavigator}>
                        <SceneView active={['s0', 's1']}>
                            <div>scene</div>
                        </SceneView>
                    </NavigationHandler>
                );
            });
            assert.equal(container.innerHTML, '');
        })
    });

    describe('Scene View Function Active', function () {
        it('should render', function(){
            var stateNavigator = new StateNavigator([
                { key: 's' }
            ]);
            stateNavigator.navigate('s');
            var container = document.createElement('div');
            var root = createRoot(container)
            act(() => {
                root.render(
                    <NavigationHandler stateNavigator={stateNavigator}>
                        <SceneView active={({state}) => state.key == 's'}>
                            <div>scene</div>
                        </SceneView>
                    </NavigationHandler>
                );
            });
            assert.equal(container.innerHTML, '<div>scene</div>');
        })
    });

    describe('Scene View Function Inactive', function () {
        it('should not render', function(){
            var stateNavigator = new StateNavigator([
                { key: 's0'},
                { key: 's1'},
            ]);
            stateNavigator.navigate('s0');
            var container = document.createElement('div');
            var root = createRoot(container)
            act(() => {
                root.render(
                    <NavigationHandler stateNavigator={stateNavigator}>
                        <SceneView active={({state}) => state.key == 's1'}>
                            <div>scene</div>
                        </SceneView>
                    </NavigationHandler>
                );
            });
            assert.equal(container.innerHTML, '');
        })
    });

    describe('Scene View Function Active and Inactive', function () {
        it('should render and not render', function(){
            var stateNavigator = new StateNavigator([
                { key: 's0'},
                { key: 's1'},
            ]);
            stateNavigator.navigate('s0');
            var container = document.createElement('div');
            var root = createRoot(container)
            act(() => {
                root.render(
                    <NavigationHandler stateNavigator={stateNavigator}>
                        <SceneView active={({state}) => state.key == 's0'}>
                            <div>scene 0</div>
                        </SceneView>
                        <SceneView active={({state}) => state.key == 's1'}>
                            <div>scene 1</div>
                        </SceneView>
                    </NavigationHandler>
                );
            });
            assert.equal(container.innerHTML, '<div>scene 0</div>');
        })
    });

    describe('Scene View Data Active', function () {
        it('should render', function(){
            var stateNavigator = new StateNavigator([
                { key: 's' }
            ]);
            stateNavigator.navigate('s', {x: 'a'});
            var container = document.createElement('div');
            var root = createRoot(container)
            act(() => {
                root.render(
                    <NavigationHandler stateNavigator={stateNavigator}>
                        <SceneView active={({data}) => data.x == 'a'}>
                            <div>scene</div>
                        </SceneView>
                    </NavigationHandler>
                );
            });
            assert.equal(container.innerHTML, '<div>scene</div>');
        })
    });

    describe('Scene View Data Inactive', function () {
        it('should render', function(){
            var stateNavigator = new StateNavigator([
                { key: 's' }
            ]);
            stateNavigator.navigate('s', {x: 'b'});
            var container = document.createElement('div');
            var root = createRoot(container)
            act(() => {
                root.render(
                    <NavigationHandler stateNavigator={stateNavigator}>
                        <SceneView active={({data}) => data.x == 'a'}>
                            <div>scene</div>
                        </SceneView>
                    </NavigationHandler>
                );
            });
            assert.equal(container.innerHTML, '');
        })
    });

    describe('Scene View Error', function () {
        it('should render fallback', function(){
            var stateNavigator = new StateNavigator([
                { key: 's' }
            ]);
            stateNavigator.navigate('s');
            var container = document.createElement('div');
            var root = createRoot(container)
            const Scene = () => {
                throw Error();
            }
            const ErrorScene = () => <h1>error</h1>;
            const err = console.error;
            console.error = () => {};
            act(() => {
                root.render(
                    <NavigationHandler stateNavigator={stateNavigator}>
                        <SceneView active="s" errorFallback={<ErrorScene />}>
                            <Scene />
                        </SceneView>
                    </NavigationHandler>
                );
            });
            console.error = err;
            assert.equal(container.innerHTML, '<h1>error</h1>');
        })
    });

    describe('Scene View Error Off', function () {
        it('should hide fallback', function(){
            var stateNavigator = new StateNavigator([
                { key: 's' }
            ]);
            stateNavigator.navigate('s', {x: 'a'});
            var container = document.createElement('div');
            var root = createRoot(container)
            const Scene = () => {
                const {data: {x}} = useNavigationEvent();
                if (x === 'a') throw Error();
                return <div>scene</div>;
            }
            const err = console.error;
            console.error = () => {};
            act(() => {
                root.render(
                    <NavigationHandler stateNavigator={stateNavigator}>
                        <SceneView active="s" errorFallback={<h1>error</h1>}>
                            <Scene />
                        </SceneView>
                    </NavigationHandler>
                );
            });
            console.error = err;
            act(() => {
                stateNavigator.navigate('s', {x: 'b'})
            });
            assert.equal(container.innerHTML, '<div>scene</div>');
        })
    });

    describe('Scene View Click Error', function () {
        it('should render fallback', function(){
            var stateNavigator = new StateNavigator([
                { key: 's' }
            ]);
            stateNavigator.navigate('s');
            var container = document.createElement('div');
            var root = createRoot(container)
            const Scene = () => {
                const {stateNavigator, data: {x}} = useNavigationEvent();
                if (x === 'a') throw Error();
                return (
                    <button onClick={() => {
                        stateNavigator.navigate('s', {x: 'a'})
                    }}>scene</button>
                )
            }
            const ErrorScene = () => <h1>error</h1>;
            act(() => {
                root.render(
                    <NavigationHandler stateNavigator={stateNavigator}>
                        <SceneView active="s" errorFallback={<ErrorScene />}>
                            <Scene />
                        </SceneView>
                    </NavigationHandler>
                );
            });
            var button = container.querySelector<HTMLButtonElement>('button');
            const err = console.error;
            console.error = () => {};
            act(() => Simulate.click(button));
            console.error = err;            
            assert.equal(container.innerHTML, '<h1>error</h1>');
        })
    });

    describe('Scene View Click Error Off', function () {
        it('should hide fallback', function(){
            var stateNavigator = new StateNavigator([
                { key: 's' }
            ]);
            stateNavigator.navigate('s', {x: 'a'});
            var container = document.createElement('div');
            var root = createRoot(container)
            const Scene = () => {
                const {data: {x}} = useNavigationEvent();
                if (x === 'a') throw Error();
                return <div>scene</div>;
            }
            const ErrorScene = () => {
                const {stateNavigator} = useNavigationEvent();
                return (
                    <button onClick={() => {
                        stateNavigator.navigate('s', {x: 'b'})
                    }} />
                )
            }
            const err = console.error;
            console.error = () => {};
            act(() => {
                root.render(
                    <NavigationHandler stateNavigator={stateNavigator}>
                        <SceneView active="s" errorFallback={<ErrorScene />}>
                            <Scene />
                        </SceneView>
                    </NavigationHandler>
                );
            });
            console.error = err;            
            var button = container.querySelector<HTMLButtonElement>('button');
            act(() => Simulate.click(button));
            assert.equal(container.innerHTML, '<div>scene</div>');
        })
    });

    describe('Scene View Error No Fallback', function () {
        it('should throw', function(){
            var stateNavigator = new StateNavigator([
                { key: 's' }
            ]);
            stateNavigator.navigate('s');
            var container = document.createElement('div');
            var root = createRoot(container)
            const Scene = () => {
                throw Error('scene error');
            }
            let message;
            const err = console.error;
            console.error = () => {};
            try {
                act(() => {
                    root.render(
                        <NavigationHandler stateNavigator={stateNavigator}>
                            <SceneView active="s">
                                <Scene />
                            </SceneView>
                        </NavigationHandler>
                    );
                });
            } catch(e) {
                message = e.message;
            }
            finally {
                console.error = err;
            }
            assert.equal(message, 'scene error');
        })
    });

    describe('Scene View Error Error', function () {
        it('should render fallbacks', function(){
            var stateNavigator = new StateNavigator([
                { key: 's0' },
                { key: 's1' }
            ]);
            stateNavigator.navigate('s0');
            var container = document.createElement('div');
            var root = createRoot(container)
            const Scene = () => {
                throw Error();
            }
            const ErrorScene = ({count}) => <h1>{`error ${count}`}</h1>;
            const err = console.error;
            console.error = () => {};
            act(() => {
                root.render(
                    <NavigationHandler stateNavigator={stateNavigator}>
                        <SceneView active="s0" errorFallback={<ErrorScene count={0}/>}>
                            <Scene />
                        </SceneView>
                        <SceneView active="s1" errorFallback={<ErrorScene count={1}/>}>
                            <Scene />
                        </SceneView>
                    </NavigationHandler>
                );
            });
            assert.equal(container.innerHTML, '<h1>error 0</h1>');
            act(() => {
                stateNavigator.navigate('s1')
            });
            console.error = err;
            assert.equal(container.innerHTML, '<h1>error 1</h1>');
        })
    });

    describe('Scene View Error Navigate', function () {
        it('should render', function(){
            var stateNavigator = new StateNavigator([
                { key: 's0' },
                { key: 's1' }
            ]);
            stateNavigator.navigate('s0');
            var container = document.createElement('div');
            var root = createRoot(container)
            const Scene = () => {
                throw Error('s1');
            }
            const ErrorScene = ({error}) => {
                const {stateNavigator} = useNavigationEvent();
                useEffect(() => {
                    if (error?.message === 's1')
                        stateNavigator.navigate('s1');
                });
                return null;
            };
            const err = console.error;
            console.error = () => {};
            act(() => {
                root.render(
                    <NavigationHandler stateNavigator={stateNavigator}>
                        <SceneView active="s0" errorFallback={ErrorScene}>
                            <Scene />
                        </SceneView>
                        <SceneView active="s1" errorFallback={ErrorScene}>
                            <div>scene 1</div>
                        </SceneView>
                    </NavigationHandler>
                );
            });
            console.error = err;
            assert.equal(container.innerHTML, '<div>scene 1</div>');
        })
    });
});

