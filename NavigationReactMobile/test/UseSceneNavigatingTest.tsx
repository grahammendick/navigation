import assert from 'assert';
import mocha from 'mocha';
import { StateNavigator } from 'navigation';
import { NavigationHandler } from 'navigation-react';
import { NavigationMotion, useSceneNavigating } from 'navigation-react-mobile';
import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { JSDOM } from 'jsdom';

declare var global: any;
var { window } = new JSDOM('<!doctype html><html><body></body></html>', { pretendToBeVisual: true });
window.addEventListener = () => {};
global.window = window;
global.document = window.document;

describe('UseScene', function () {
    describe('A', function () {
        it('should call navigating hook', function(){
            var stateNavigator = new StateNavigator([
                { key: 'sceneA' }
            ]);
            stateNavigator.navigate('sceneA');
            var {sceneA} = stateNavigator.states;
            var navigatingA = false;
            var SceneA = () => {
                useSceneNavigating(() => {
                    navigatingA = true;
                })
                return <div />;
            };
            sceneA.renderScene = () => <SceneA />;
            var container = document.createElement('div');
            ReactDOM.render(
                <NavigationHandler stateNavigator={stateNavigator}>
                    <NavigationMotion duration={0}>
                        {(_style, scene, key) =>  <div key={key}>{scene}</div>}
                    </NavigationMotion>
                </NavigationHandler>,
                container
            );
            try {
                assert.equal(navigatingA, true);
            } finally {
                ReactDOM.unmountComponentAtNode(container);
            }
        })
    });

    describe('AA', function () {
        it('should not call navigating hook', function(){
            var stateNavigator = new StateNavigator([
                { key: 'sceneA' }
            ]);
            stateNavigator.navigate('sceneA');
            var {sceneA} = stateNavigator.states;
            var navigatingA = false;
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
            ReactDOM.render(
                <NavigationHandler stateNavigator={stateNavigator}>
                    <NavigationMotion duration={0}>
                        {(_style, scene, key) =>  <div key={key}>{scene}</div>}
                    </NavigationMotion>
                </NavigationHandler>,
                container
            );
            navigatingA = false;
            setCountA(1);
            try {
                assert.equal(navigatingA, false);
            } finally {
                ReactDOM.unmountComponentAtNode(container);
            }
        })
    });

    describe('A to A -> B', function () {
        it('should call navigating hook on B and not on A', function(){
            var stateNavigator = new StateNavigator([
                { key: 'sceneA' },
                { key: 'sceneB', trackCrumbTrail: true }
            ]);
            stateNavigator.navigate('sceneA');
            var {sceneA, sceneB} = stateNavigator.states;
            var navigatingA, navigatingB = false;
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
            ReactDOM.render(
                <NavigationHandler stateNavigator={stateNavigator}>
                    <NavigationMotion duration={0}>
                        {(_style, scene, key) =>  <div key={key}>{scene}</div>}
                    </NavigationMotion>
                </NavigationHandler>,
                container
            );
            navigatingA = navigatingB = false;
            stateNavigator.navigate('sceneB');
            try {
                assert.equal(navigatingA, false);
                assert.equal(navigatingB, true);
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
            var navigatingA, navigatingB = false;
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
            ReactDOM.render(
                <NavigationHandler stateNavigator={stateNavigator}>
                    <NavigationMotion duration={0}>
                        {(_style, scene, key) =>  <div key={key}>{scene}</div>}
                    </NavigationMotion>
                </NavigationHandler>,
                container
            );
            stateNavigator.navigate('sceneB');
            navigatingA = navigatingB = false;
            stateNavigator.navigate('sceneA');
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
            var navigatingA = false;
            var SceneA = () => {
                useSceneNavigating(() => {
                    navigatingA = true;
                })
                return <div />;
            };
            sceneA.renderScene = () => <SceneA />;
            var container = document.createElement('div');
            ReactDOM.render(
                <NavigationHandler stateNavigator={stateNavigator}>
                    <NavigationMotion duration={0}>
                        {(_style, scene, key) =>  <div key={key}>{scene}</div>}
                    </NavigationMotion>
                </NavigationHandler>,
                container
            );
            navigatingA = false;
            stateNavigator.navigate('sceneA');
            try {
                assert.equal(navigatingA, true);
            } finally {
                ReactDOM.unmountComponentAtNode(container);
            }
        })
    });
});
