import * as assert from 'assert';
import * as mocha from 'mocha';
import { StateNavigator } from 'navigation';
import { SceneView, NavigationHandler, useNavigationEvent } from 'navigation-react';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { act } from 'react-dom/test-utils';
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
});

