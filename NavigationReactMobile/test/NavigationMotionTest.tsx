import assert from 'assert';
import 'mocha';
import { StateNavigator } from 'navigation';
import { NavigationHandler } from 'navigation-react';
import { NavigationMotion } from 'navigation-react-mobile';
import React from 'react';
import ReactDOM from 'react-dom';
import { JSDOM } from 'jsdom';

declare var global: any;
var { window } = new JSDOM('<!doctype html><html><body></body></html>');
window.addEventListener = () => {};
global.window = window;
global.document = window.document;
var now = window.performance.now()
window.performance.now = () => now+=500;
window.requestAnimationFrame = callback => {
    callback(window.performance.now())
};
window.cancelAnimationFrame = () => {};

describe('NavigationMotion', function () {
    describe('A', function () {
        it('should render A', function(){
            var stateNavigator = new StateNavigator([
                { key: 'sceneA' }
            ]);
            stateNavigator.navigate('sceneA');
            var {sceneA} = stateNavigator.states;
            var SceneA = () => <div id="sceneA" />;
            sceneA.renderScene = () => <SceneA />;
            var container = document.createElement('div');
            ReactDOM.render(
                <NavigationHandler stateNavigator={stateNavigator}>
                    <NavigationMotion>
                        {(_style, scene, key) =>  (
                            <div className="scene" key={key}>{scene}</div>
                        )}
                    </NavigationMotion>
                </NavigationHandler>,
                container
            );
            try {
                assert.equal(container.querySelectorAll(".scene").length, 1);
                assert.notEqual(container.children[0].querySelector("#sceneA"), null);
            } finally {
                ReactDOM.unmountComponentAtNode(container);
            }
        })
    });

    describe('A -> B', function () {
        it('should render [] + B', function(){
            var stateNavigator = new StateNavigator([
                { key: 'sceneA' },
                { key: 'sceneB', trackCrumbTrail: true },
            ]);
            stateNavigator.navigate('sceneA');
            stateNavigator.navigate('sceneB');
            var {sceneA, sceneB} = stateNavigator.states;
            var SceneA = () => <div id="sceneA" />;
            var SceneB = () => <div id="sceneB" />;
            sceneA.renderScene = () => <SceneA />;
            sceneB.renderScene = () => <SceneB />;
            var container = document.createElement('div');
            ReactDOM.render(
                <NavigationHandler stateNavigator={stateNavigator}>
                    <NavigationMotion>
                        {(_style, scene, key) =>  (
                            <div className="scene" key={key}>{scene}</div>
                        )}
                    </NavigationMotion>
                </NavigationHandler>,
                container
            );
            try {
                assert.equal(container.querySelectorAll(".scene").length, 2);
                assert.equal(container.querySelector("#sceneA"), null);
                assert.notEqual(container.children[1].querySelector("#sceneB"), null);
            } finally {
                ReactDOM.unmountComponentAtNode(container);
            }
        })
    });

    describe('A to A -> B', function () {
        it('should render A + B', function(){
            var stateNavigator = new StateNavigator([
                { key: 'sceneA' },
                { key: 'sceneB', trackCrumbTrail: true },
            ]);
            stateNavigator.navigate('sceneA');
            var {sceneA, sceneB} = stateNavigator.states;
            var SceneA = () => <div id="sceneA" />;
            var SceneB = () => <div id="sceneB" />;
            sceneA.renderScene = () => <SceneA />;
            sceneB.renderScene = () => <SceneB />;
            var container = document.createElement('div');
            ReactDOM.render(
                <NavigationHandler stateNavigator={stateNavigator}>
                    <NavigationMotion>
                        {(_style, scene, key) =>  (
                            <div className="scene" key={key}>{scene}</div>
                        )}
                    </NavigationMotion>
                </NavigationHandler>,
                container
            );
            stateNavigator.navigate('sceneB');
            try {
                assert.equal(container.querySelectorAll(".scene").length, 2);
                assert.notEqual(container.children[0].querySelector("#sceneA"), null);
                assert.notEqual(container.children[1].querySelector("#sceneB"), null);
            } finally {
                ReactDOM.unmountComponentAtNode(container);
            }
        })
    });

    describe('A -> B to A', function () {
        it('should render A', function(){
            var stateNavigator = new StateNavigator([
                { key: 'sceneA' },
                { key: 'sceneB', trackCrumbTrail: true },
            ]);
            stateNavigator.navigate('sceneA');
            var {sceneA, sceneB} = stateNavigator.states;
            var SceneA = () => <div id="sceneA" />;
            var SceneB = () => <div id="sceneB" />;
            sceneA.renderScene = () => <SceneA />;
            sceneB.renderScene = () => <SceneB />;
            var container = document.createElement('div');
            ReactDOM.render(
                <NavigationHandler stateNavigator={stateNavigator}>
                    <NavigationMotion>
                        {(_style, scene, key) =>  (
                            <div className="scene" key={key}>{scene}</div>
                        )}
                    </NavigationMotion>
                </NavigationHandler>,
                container
            );
            stateNavigator.navigate('sceneB');
            stateNavigator.navigateBack(1);
            try {
                assert.equal(container.querySelectorAll(".scene").length, 1);
                assert.notEqual(container.children[0].querySelector("#sceneA"), null);
                assert.equal(container.querySelector("#sceneB"), null);
            } finally {
                ReactDOM.unmountComponentAtNode(container);
            }
        })
    });

    describe('A to A', function () {
        it('should render A', function(){
            var stateNavigator = new StateNavigator([
                { key: 'sceneA' }
            ]);
            stateNavigator.navigate('sceneA');
            var {sceneA} = stateNavigator.states;
            var SceneA = () => <div id="sceneA" />;
            sceneA.renderScene = () => <SceneA />;
            var container = document.createElement('div');
            ReactDOM.render(
                <NavigationHandler stateNavigator={stateNavigator}>
                    <NavigationMotion>
                        {(_style, scene, key) =>  (
                            <div className="scene" key={key}>{scene}</div>
                        )}
                    </NavigationMotion>
                </NavigationHandler>,
                container
            );
            stateNavigator.navigate('sceneA');
            try {
                assert.equal(container.querySelectorAll(".scene").length, 1);
                assert.notEqual(container.children[0].querySelector("#sceneA"), null);
            } finally {
                ReactDOM.unmountComponentAtNode(container);
            }
        })
    });

    describe('A to B', function () {
        it('should render B', function(){
            var stateNavigator = new StateNavigator([
                { key: 'sceneA' },
                { key: 'sceneB' },
            ]);
            stateNavigator.navigate('sceneA');
            var {sceneA, sceneB} = stateNavigator.states;
            var SceneA = () => <div id="sceneA" />;
            var SceneB = () => <div id="sceneB" />;
            sceneA.renderScene = () => <SceneA />;
            sceneB.renderScene = () => <SceneB />;
            var container = document.createElement('div');
            ReactDOM.render(
                <NavigationHandler stateNavigator={stateNavigator}>
                    <NavigationMotion>
                        {(_style, scene, key) =>  (
                            <div className="scene" key={key}>{scene}</div>
                        )}
                    </NavigationMotion>
                </NavigationHandler>,
                container
            );
            stateNavigator.navigate('sceneB');
            try {
                assert.equal(container.querySelectorAll(".scene").length, 1);
                assert.notEqual(container.children[0].querySelector("#sceneB"), null);
                assert.equal(container.querySelector("#sceneA"), null);
            } finally {
                ReactDOM.unmountComponentAtNode(container);
            }
        })
    });

    describe('A -> B to C -> B', function () {
        it('should render A + B', function(){
            var stateNavigator = new StateNavigator([
                { key: 'sceneA' },
                { key: 'sceneB', trackCrumbTrail: true },
                { key: 'sceneC' },
            ]);
            stateNavigator.navigate('sceneA');
            var {sceneA, sceneB, sceneC} = stateNavigator.states;
            var SceneA = () => <div id="sceneA" />;
            var SceneB = () => <div id="sceneB" />;
            var SceneC = () => <div id="sceneC" />;
            sceneA.renderScene = () => <SceneA />;
            sceneB.renderScene = () => <SceneB />;
            sceneC.renderScene = () => <SceneC />;
            var container = document.createElement('div');
            ReactDOM.render(
                <NavigationHandler stateNavigator={stateNavigator}>
                    <NavigationMotion>
                        {(_style, scene, key) =>  (
                            <div className="scene" key={key}>{scene}</div>
                        )}
                    </NavigationMotion>
                </NavigationHandler>,
                container
            );
            stateNavigator.navigate('sceneB');
            var url = stateNavigator.fluent()
                .navigate('sceneC')
                .navigate('sceneB').url;
            stateNavigator.navigateLink(url);
            try {
                assert.equal(container.querySelectorAll(".scene").length, 2);
                assert.notEqual(container.children[0].querySelector("#sceneA"), null);
                assert.notEqual(container.children[1].querySelector("#sceneB"), null);
                assert.equal(container.querySelector("#sceneC"), null);
            } finally {
                ReactDOM.unmountComponentAtNode(container);
            }
        })
    });

    describe('A -> B to C -> B to C', function () {
        it('should render C', function(){
            var stateNavigator = new StateNavigator([
                { key: 'sceneA' },
                { key: 'sceneB', trackCrumbTrail: true },
                { key: 'sceneC' },
            ]);
            stateNavigator.navigate('sceneA');
            var {sceneA, sceneB, sceneC} = stateNavigator.states;
            var SceneA = () => <div id="sceneA" />;
            var SceneB = () => <div id="sceneB" />;
            var SceneC = () => <div id="sceneC" />;
            sceneA.renderScene = () => <SceneA />;
            sceneB.renderScene = () => <SceneB />;
            sceneC.renderScene = () => <SceneC />;
            var container = document.createElement('div');
            ReactDOM.render(
                <NavigationHandler stateNavigator={stateNavigator}>
                    <NavigationMotion>
                        {(_style, scene, key) =>  (
                            <div className="scene" key={key}>{scene}</div>
                        )}
                    </NavigationMotion>
                </NavigationHandler>,
                container
            );
            stateNavigator.navigate('sceneB');
            var url = stateNavigator.fluent()
                .navigate('sceneC')
                .navigate('sceneB').url;
            stateNavigator.navigateLink(url);
            stateNavigator.navigateBack(1);
            try {
                assert.equal(container.querySelectorAll(".scene").length, 1);
                assert.notEqual(container.children[0].querySelector("#sceneC"), null);
                assert.equal(container.querySelector("#sceneA"), null);
                assert.equal(container.querySelector("#sceneB"), null);
            } finally {
                ReactDOM.unmountComponentAtNode(container);
            }
        })
    });
});
