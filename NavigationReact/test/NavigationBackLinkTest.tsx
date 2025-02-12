import * as assert from 'assert';
import * as mocha from 'mocha';
import { StateNavigator } from 'navigation';
import { NavigationBackLink, NavigationHandler, NavigationContext } from 'navigation-react';
import React, { useContext, useState, useEffect, useMemo } from 'react';
import { createRoot } from 'react-dom/client';
import { act, Simulate } from 'react-dom/test-utils';
import { JSDOM } from 'jsdom';

declare var global: any;
global.IS_REACT_ACT_ENVIRONMENT = true;
var { window } = new JSDOM('<!doctype html><html><body></body></html>', { url: 'https://navigation.com' });
window.addEventListener = () => {};
global.window = window;
global.document = window.document;

describe('NavigationBackLinkTest', function () {
    describe('Navigation Back Link', function () {
        it('should render', function(){
            var stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1', trackCrumbTrail: true }
            ]);
            stateNavigator.navigate('s0');
            stateNavigator.navigate('s1');
            var container = document.createElement('div');
            var root = createRoot(container)
            act(() => {
                root.render(
                    <NavigationHandler stateNavigator={stateNavigator}>
                        <NavigationBackLink distance={1}>
                            <span>link text</span>
                        </NavigationBackLink>
                    </NavigationHandler>
                );
            });
            var link = container.querySelector<HTMLAnchorElement>('a');
            assert.equal(link.hash, '#/r0');
            assert.equal(link.innerHTML, '<span>link text</span>');
        })
    });

    describe('Without State Navigator Navigation Back Link', function () {
        it('should render', function(){
            var container = document.createElement('div');
            var root = createRoot(container)
            act(() => {
                root.render(
                    <NavigationBackLink distance={1}>
                        link text
                    </NavigationBackLink>
                );
            });
            var link = container.querySelector<HTMLAnchorElement>('a');
            assert.equal(link.hash, '');
            assert.equal(link.innerHTML, 'link text');
        })
    });

    describe('Invalid Navigation Back Link', function () {
        it('should render', function(){
            var stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1', trackCrumbTrail: true }
            ]);
            stateNavigator.navigate('s0');
            stateNavigator.navigate('s1');
            var container = document.createElement('div');
            var root = createRoot(container)
            act(() => {
                root.render(
                    <NavigationHandler stateNavigator={stateNavigator}>
                        <NavigationBackLink distance={2}>
                            link text
                        </NavigationBackLink>
                    </NavigationHandler>
                );
            });
            var link = container.querySelector<HTMLAnchorElement>('a');
            assert.equal(link.hash, '');
            assert.equal(link.innerHTML, 'link text');
        })
    });

    describe('Attributes Navigation Back Link', function () {
        it('should render', function(){
            var stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1', trackCrumbTrail: true }
            ]);
            stateNavigator.navigate('s0');
            stateNavigator.navigate('s1');
            var container = document.createElement('div');
            var root = createRoot(container)
            act(() => {
                root.render(
                    <NavigationHandler stateNavigator={stateNavigator}>
                        <NavigationBackLink
                            distance={1}
                            historyAction='replace'
                            navigating={() => false}
                            aria-label="z"
                            target="_blank">
                            link text
                        </NavigationBackLink>
                    </NavigationHandler>
                );
            });
            var link = container.querySelector<HTMLAnchorElement>('a');
            assert.equal(link.hash, '#/r0');
            assert.equal(link.innerHTML, 'link text');
            assert.equal(link.getAttribute('aria-label'), 'z');
            assert.equal(link.target, '_blank');
            assert.equal(link.attributes.length, 3);
        })
    });

    describe('Click Navigation Back Link', function () {
        it('should navigate', function(){
            var stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1', trackCrumbTrail: true }
            ]);
            stateNavigator.navigate('s0');
            stateNavigator.navigate('s1');
            var container = document.createElement('div');
            var root = createRoot(container)
            act(() => {
                root.render(
                    <NavigationHandler stateNavigator={stateNavigator}>
                        <NavigationBackLink distance={1}>
                            link text
                        </NavigationBackLink>
                    </NavigationHandler>
                );
            });
            var link = container.querySelector<HTMLAnchorElement>('a');
            act(() => Simulate.click(link));
            assert.equal(stateNavigator.stateContext.state, stateNavigator.states['s0']);
        })
    });

    describe('Ctrl + Click Navigation Back Link', function () {
        it('should not navigate', function(){
            var stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1', trackCrumbTrail: true }
            ]);
            stateNavigator.navigate('s0');
            stateNavigator.navigate('s1');
            var container = document.createElement('div');
            var root = createRoot(container)
            act(() => {
                root.render(
                    <NavigationHandler stateNavigator={stateNavigator}>
                        <NavigationBackLink distance={1}>
                            link text
                        </NavigationBackLink>
                    </NavigationHandler>
                );
            });
            var link = container.querySelector<HTMLAnchorElement>('a');
            act(() => Simulate.click(link, { ctrlKey: true }));
            assert.equal(stateNavigator.stateContext.state, stateNavigator.states['s1']);
        })
    });

    describe('Shift + Click Navigation Back Link', function () {
        it('should not navigate', function(){
            var stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1', trackCrumbTrail: true }
            ]);
            stateNavigator.navigate('s0');
            stateNavigator.navigate('s1');
            var container = document.createElement('div');
            var root = createRoot(container)
            act(() => {
                root.render(
                    <NavigationHandler stateNavigator={stateNavigator}>
                        <NavigationBackLink distance={1}>
                            link text
                        </NavigationBackLink>
                    </NavigationHandler>
                );
            });
            var link = container.querySelector<HTMLAnchorElement>('a');
            act(() => Simulate.click(link, { shiftKey: true }));
            assert.equal(stateNavigator.stateContext.state, stateNavigator.states['s1']);
        })
    });

    describe('Meta + Click Navigation Back Link', function () {
        it('should not navigate', function(){
            var stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1', trackCrumbTrail: true }
            ]);
            stateNavigator.navigate('s0');
            stateNavigator.navigate('s1');
            var container = document.createElement('div');
            var root = createRoot(container)
            act(() => {
                root.render(
                    <NavigationHandler stateNavigator={stateNavigator}>
                        <NavigationBackLink distance={1}>
                            link text
                        </NavigationBackLink>
                    </NavigationHandler>
                );
            });
            var link = container.querySelector<HTMLAnchorElement>('a');
            act(() => Simulate.click(link, { metaKey: true }));
            assert.equal(stateNavigator.stateContext.state, stateNavigator.states['s1']);
        })
    });

    describe('Alt + Click Navigation Back Link', function () {
        it('should not navigate', function(){
            var stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1', trackCrumbTrail: true }
            ]);
            stateNavigator.navigate('s0');
            stateNavigator.navigate('s1');
            var container = document.createElement('div');
            var root = createRoot(container)
            act(() => {
                root.render(
                    <NavigationHandler stateNavigator={stateNavigator}>
                        <NavigationBackLink distance={1}>
                            link text
                        </NavigationBackLink>
                    </NavigationHandler>
                );
            });
            var link = container.querySelector<HTMLAnchorElement>('a');
            act(() => Simulate.click(link, { altKey: true }));
            assert.equal(stateNavigator.stateContext.state, stateNavigator.states['s1']);
        })
    });

    describe('Button + Click Navigation Back Link', function () {
        it('should not navigate', function(){
            var stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1', trackCrumbTrail: true }
            ]);
            stateNavigator.navigate('s0');
            stateNavigator.navigate('s1');
            var container = document.createElement('div');
            var root = createRoot(container)
            act(() => {
                root.render(
                    <NavigationHandler stateNavigator={stateNavigator}>
                        <NavigationBackLink distance={1}>
                            link text
                        </NavigationBackLink>
                    </NavigationHandler>
                );
            });
            var link = container.querySelector<HTMLAnchorElement>('a');
            act(() => Simulate.click(link, { button: 1 }));
            assert.equal(stateNavigator.stateContext.state, stateNavigator.states['s1']);
        })
    });

    describe('Navigating Click Navigation Back Link', function () {
        it('should navigate', function(){
            var stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1', trackCrumbTrail: true }
            ]);
            stateNavigator.navigate('s0');
            stateNavigator.navigate('s1');
            var container = document.createElement('div');
            var root = createRoot(container)
            act(() => {
                root.render(
                    <NavigationHandler stateNavigator={stateNavigator}>
                        <NavigationBackLink
                            distance={1}
                            navigating={() => true}>
                            link text
                        </NavigationBackLink>
                    </NavigationHandler>
                );
            });
            var link = container.querySelector<HTMLAnchorElement>('a');
            act(() => Simulate.click(link));
            assert.equal(stateNavigator.stateContext.state, stateNavigator.states['s0']);
        })
    });

    describe('Not Navigating Click Navigation Back Link', function () {
        it('should not navigate', function(){
            var stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1', trackCrumbTrail: true }
            ]);
            stateNavigator.navigate('s0');
            stateNavigator.navigate('s1');
            var container = document.createElement('div');
            var root = createRoot(container)
            act(() => {
                root.render(
                    <NavigationHandler stateNavigator={stateNavigator}>
                        <NavigationBackLink
                            distance={1}
                            navigating={() => false}>
                            link text
                        </NavigationBackLink>
                    </NavigationHandler>
                );
            });
            var link = container.querySelector<HTMLAnchorElement>('a');
            act(() => Simulate.click(link));
            assert.equal(stateNavigator.stateContext.state, stateNavigator.states['s1']);
        })
    });

    describe('Navigating Params Click Navigation Back Link', function () {
        it('should navigate', function(){
            var stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1', trackCrumbTrail: true }
            ]);
            stateNavigator.navigate('s0');
            stateNavigator.navigate('s1');
            var navigatingEvt, navigatingLink;
            var container = document.createElement('div');
            var root = createRoot(container)
            act(() => {
                root.render(
                    <NavigationHandler stateNavigator={stateNavigator}>
                        <NavigationBackLink
                            distance={1}
                            navigating={(e, link) => {
                                navigatingEvt = e;
                                navigatingLink = link;
                                return true;
                            }}>
                            link text
                        </NavigationBackLink>
                    </NavigationHandler>
                );
            });
            var link = container.querySelector<HTMLAnchorElement>('a');
            act(() => Simulate.click(link, { clientX: 224 }));
            assert.strictEqual(navigatingEvt.clientX, 224);
            assert.equal(navigatingLink, '/r0');
        })
    });

    describe('History Click Navigation Back Link', function () {
        it('should navigate', function(){
            var stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1', trackCrumbTrail: true }
            ]);
            stateNavigator.navigate('s0');
            stateNavigator.navigate('s1');
            var container = document.createElement('div');
            var root = createRoot(container)
            act(() => {
                root.render(
                    <NavigationHandler stateNavigator={stateNavigator}>
                        <NavigationBackLink distance={1}>
                            link text
                        </NavigationBackLink>
                    </NavigationHandler>
                );
            });
            var link = container.querySelector<HTMLAnchorElement>('a');
            var addHistory;
            stateNavigator.historyManager.addHistory = (url, replace) => { addHistory = !replace };
            act(() => Simulate.click(link));
            assert.strictEqual(addHistory, true);
        })
    });

    describe('Replace History Click Navigation Back Link', function () {
        it('should navigate', function(){
            var stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1', trackCrumbTrail: true }
            ]);
            stateNavigator.navigate('s0');
            stateNavigator.navigate('s1');
            var container = document.createElement('div');
            var root = createRoot(container)
            act(() => {
                root.render(
                    <NavigationHandler stateNavigator={stateNavigator}>
                        <NavigationBackLink
                            distance={1}
                            historyAction="replace">
                            link text
                        </NavigationBackLink>
                    </NavigationHandler>
                );
            });
            var link = container.querySelector<HTMLAnchorElement>('a');
            var replaceHistory;
            stateNavigator.historyManager.addHistory = (url, replace) => { replaceHistory = replace };
            act(() => Simulate.click(link));
            assert.strictEqual(replaceHistory, true);
        })
    });

    describe('None History Click Navigation Back Link', function () {
        it('should navigate', function(){
            var stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1', trackCrumbTrail: true }
            ]);
            stateNavigator.navigate('s0');
            stateNavigator.navigate('s1');
            var container = document.createElement('div');
            var root = createRoot(container)
            act(() => {
                root.render(
                    <NavigationHandler stateNavigator={stateNavigator}>
                        <NavigationBackLink
                            distance={1}
                            historyAction="none">
                            link text
                        </NavigationBackLink>
                    </NavigationHandler>
                );
            });
            var link = container.querySelector<HTMLAnchorElement>('a');
            var noneHistory = true;
            stateNavigator.historyManager.addHistory = () => { noneHistory = false };
            act(() => Simulate.click(link));
            assert.strictEqual(noneHistory, true);
        })
    });

    describe('Crumb Trail Navigate Navigation Back Link', function () {
        it('should update', function(){
            var stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1', trackCrumbTrail: true }
            ]);
            stateNavigator.navigate('s0');
            stateNavigator.navigate('s1');
            var container = document.createElement('div');
            var root = createRoot(container)
            act(() => {
                root.render(
                    <NavigationHandler stateNavigator={stateNavigator}>
                        <NavigationBackLink distance={1}>
                            link text
                        </NavigationBackLink>
                    </NavigationHandler>
                );
            });
            var link = container.querySelector<HTMLAnchorElement>('a');
            assert.equal(link.hash, '#/r0');
            act(() => stateNavigator.navigate('s1'));
            assert.equal(link.hash, '#/r1?crumb=%2Fr0');
        })
    });

    describe('Rewrite Navigation Back Link', function () {
        it('should render', function(){
            var stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1', trackCrumbTrail: true }
            ]);
            const {s0} = stateNavigator.states;
            s0.rewriteNavigation = () => ({
                stateKey: 's1',
            });
            stateNavigator.navigate('s0');
            stateNavigator.navigate('s1');
            var container = document.createElement('div');
            var root = createRoot(container)
            act(() => {
                root.render(
                    <NavigationHandler stateNavigator={stateNavigator}>
                        <NavigationBackLink distance={1}>
                            link text
                        </NavigationBackLink>
                    </NavigationHandler>
                );
            });
            var link = container.querySelector<HTMLAnchorElement>('a');
            assert.equal(link.hash, '#/r1');
            act(() => Simulate.click(link));
            assert.equal(stateNavigator.stateContext.state, s0);
        });
    });


    describe('Rewrite Navigation Back Link Data', function () {
        it('should render', function(){
            var stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0/{x}' },
                { key: 's1', route: 'r1', trackCrumbTrail: true }
            ]);
            const {s0} = stateNavigator.states;
            s0.rewriteNavigation = ({x}) => (
                x === 'y' ? {
                    stateKey: 's0',
                    navigationData: {
                        x: 'z'
                    }
                } : null
            );
            stateNavigator.navigate('s0', {x: 'y'});
            stateNavigator.navigate('s1');
            var container = document.createElement('div');
            var root = createRoot(container)
            act(() => {
                root.render(
                    <NavigationHandler stateNavigator={stateNavigator}>
                        <NavigationBackLink distance={1}>
                            link text
                        </NavigationBackLink>
                    </NavigationHandler>
                );
            });
            var links = container.querySelectorAll<HTMLAnchorElement>('a');
            assert.equal(links[0].hash, '#/r0/z');
            act(() => Simulate.click(links[0]));
            assert.equal(stateNavigator.stateContext.data.x, 'y');
        });
    });

    describe('Rewrite Click Navigation Back Link', function () {
        it('should render', function(){
            var stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1', trackCrumbTrail: true }
            ]);
            const {s0} = stateNavigator.states;
            s0.rewriteNavigation = () => ({
                stateKey: 's1',
            });
            var navigatingLink;
            stateNavigator.navigate('s0');
            stateNavigator.navigate('s1');
            var container = document.createElement('div');
            var root = createRoot(container)
            act(() => {
                root.render(
                    <NavigationHandler stateNavigator={stateNavigator}>
                        <NavigationBackLink
                            distance={1}
                            navigating={(_, link) => {
                                navigatingLink = link;
                                return true;
                            }}>
                            link text
                        </NavigationBackLink>
                    </NavigationHandler>
                );
            });
            var link = container.querySelector<HTMLAnchorElement>('a');
            assert.equal(link.hash, '#/r1');
            act(() => Simulate.click(link));
            assert.equal(navigatingLink, '/r0');
        });
    });

    describe('Modal/Details Navigation Back Link', function () {
        it('should render', function(){
            var stateNavigator = new StateNavigator([
                { key: 'list', route: 'list', trackCrumbTrail: true },
                { key: 'details', route: 'details/{id}', defaultTypes: {id: 'number'}, trackCrumbTrail: true }
            ]);
            var {list, details} = stateNavigator.states;
            var List = ({ id }) => (
                <>
                    <NavigationBackLink
                        distance={1}>
                        Item 1
                    </NavigationBackLink>
                    {id && <dialog>Modal {id}</dialog>}
                </>
            );
            list.renderScene = ({ id }) => <List id={id} />;
            details.renderScene = ({ id }) => <div>Details {id}</div>;
            list.rewriteNavigation = ({ id }) => (
                id ? {
                    stateKey: 'details',
                    navigationData: { id },
                } : null);
            stateNavigator.navigate('list', {id: 1});
            stateNavigator.navigate('list');
            var container = document.createElement('div');
            var root = createRoot(container);
            act(() => {
                root.render(
                    <NavigationHandler stateNavigator={stateNavigator}>
                        <NavigationContext.Consumer>
                            {({state, data}) => state.renderScene(data)}
                        </NavigationContext.Consumer>
                    </NavigationHandler>
                );
            });
            var link = container.querySelector<HTMLAnchorElement>('a');
            var dialog = container.querySelector<HTMLDialogElement>('dialog');
            assert.equal(link.hash, '#/details/1');
            assert.equal(dialog, null);
            act(() => Simulate.click(link));
            var dialog = container.querySelector<HTMLDialogElement>('dialog');
            var div = container.querySelector<HTMLDivElement>('div');
            assert.equal(dialog.innerHTML, 'Modal 1');
            assert.equal(div, null);
        })
    });

    describe('Rewrite Navigation Back Link Navigate Outside', function () {
        it('should render', function(){
            var stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1', trackCrumbTrail: true }
            ]);
            const {s0} = stateNavigator.states;
            s0.rewriteNavigation = () => ({stateKey: 's1'});
            stateNavigator.navigate('s0');
            stateNavigator.navigate('s1');
            var container = document.createElement('div');
            var root = createRoot(container)
            act(() => {
                root.render(
                    <NavigationHandler stateNavigator={stateNavigator}>
                        <div />
                    </NavigationHandler>
                );
            });
            var url = stateNavigator.getNavigationBackLink(1);
            var href = stateNavigator.historyManager.getHref(url);
            assert.equal(href, '#/r1');
        });
    });

    describe('Rewrite Navigation Back Link Missing Route Param', function () {
        it('should render', function(){
            var stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1/{x}', trackCrumbTrail: true }
            ]);
            const {s0} = stateNavigator.states;
            s0.rewriteNavigation = () => ({
                stateKey: 's1',
            });
            stateNavigator.navigate('s0');
            stateNavigator.navigate('s1', {x: '1'});
            var container = document.createElement('div');
            var root = createRoot(container)
            act(() => {
                root.render(
                    <NavigationHandler stateNavigator={stateNavigator}>
                        <NavigationBackLink distance={1}>
                            link text
                        </NavigationBackLink>
                    </NavigationHandler>
                );
            });
            var link = container.querySelector<HTMLAnchorElement>('a');
            assert.equal(link.hash, '#/r0');
        });
    });

    describe('Rewrite Navigation Back Link Invalid', function () {
        it('should render', function(){
            var stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1', trackCrumbTrail: true }
            ]);
            const {s0} = stateNavigator.states;
            stateNavigator.navigate('s0');
            stateNavigator.navigate('s1');
            s0.rewriteNavigation = () => ({
                stateKey: 'x',
            });
            var container = document.createElement('div');
            var root = createRoot(container)
            act(() => {
                root.render(
                    <NavigationHandler stateNavigator={stateNavigator}>
                        <NavigationBackLink distance={1}>
                            link text
                        </NavigationBackLink>
                    </NavigationHandler>
                );
            });
            var link = container.querySelector<HTMLAnchorElement>('a');
            assert.equal(link.hash, '#/r0');
        });
    });

    describe('Click Custom Href Navigation Back Link', function () {
        it('should navigate', function(){
            var stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1', trackCrumbTrail: true }
            ]);
            stateNavigator.navigate('s0');
            stateNavigator.navigate('s1');
            stateNavigator.historyManager.getHref = () => '#/hello/world';
            var container = document.createElement('div');
            var root = createRoot(container)
            act(() => {
                root.render(
                    <NavigationHandler stateNavigator={stateNavigator}>
                        <NavigationBackLink distance={1}>
                            link text
                        </NavigationBackLink>
                    </NavigationHandler>
                );
            });
            var link = container.querySelector<HTMLAnchorElement>('a');
            assert.equal(link.hash, '#/hello/world');
            act(() => Simulate.click(link));
            assert.equal(stateNavigator.stateContext.state, stateNavigator.states['s0']);
        })
    });

    describe('Consumer Navigation Back Link', function () {
        it('should update', function(){
            var stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1', trackCrumbTrail: true }
            ]);
            var {s0, s1} = stateNavigator.states;
            s0.renderScene = ({hello}) => <h1>{hello}</h1>
            s1.renderScene = () => (
                <NavigationBackLink distance={1}>
                    link text
                </NavigationBackLink>
            );
            stateNavigator.navigate('s0', {hello: 'world'});
            stateNavigator.navigate('s1');
            var container = document.createElement('div');
            var root = createRoot(container)
            act(() => {
                root.render(
                    <NavigationHandler stateNavigator={stateNavigator}>
                        <NavigationContext.Consumer>
                            {({state, data}) => state.renderScene(data)}
                        </NavigationContext.Consumer>
                    </NavigationHandler>
                );
            });
            var link = container.querySelector<HTMLAnchorElement>('a');
            act(() => Simulate.click(link));
            var header = container.querySelector<HTMLHeadingElement>('h1');
            assert.equal(header.innerHTML, 'world');
        })
    });

    describe('On Before Cancel Navigation Back Link', function () {
        it('should not navigate', function(){
            var stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1', trackCrumbTrail: true },
                { key: 's2', route: 'r2', trackCrumbTrail: true },
            ]);
            stateNavigator.navigate('s0');
            stateNavigator.navigate('s1');
            stateNavigator.navigate('s2');
            var container = document.createElement('div');
            var root = createRoot(container)
            act(() => {
                root.render(
                    <NavigationHandler stateNavigator={stateNavigator}>
                        <NavigationBackLink distance={1}>
                            link text
                        </NavigationBackLink>
                    </NavigationHandler>
                );
            });
            var link = container.querySelectorAll<HTMLAnchorElement>('a')[0];
            act(() => Simulate.click(link));
            assert.equal(stateNavigator.stateContext.state.key, 's1');
            stateNavigator.onBeforeNavigate(() => false);
            act(() => Simulate.click(link));
            assert.equal(stateNavigator.stateContext.state.key, 's1');
        })
    });

    describe('On Before Component Cancel Navigation Back', function () {
        it('should not navigate', function(){
            var stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1', trackCrumbTrail: true }
            ]);
            class Blocker extends React.Component<{ stateNavigator: StateNavigator }> {
                componentDidMount() {
                    this.props.stateNavigator.onBeforeNavigate(() => false);
                }
                render() {
                    return null;
                }
            }
            stateNavigator.navigate('s0');
            stateNavigator.navigate('s1');
            var container = document.createElement('div');
            var root = createRoot(container)
            act(() => {
                root.render(
                    <NavigationHandler stateNavigator={stateNavigator}>
                        <NavigationContext.Consumer>
                            {({ stateNavigator }) => <Blocker stateNavigator={stateNavigator} />}
                        </NavigationContext.Consumer>
                    </NavigationHandler>
                );
            });
            assert.equal(stateNavigator.stateContext.state.key, 's1');
            act(() => stateNavigator.navigateBack(1));
            assert.equal(stateNavigator.stateContext.state.key, 's1');
        })
    });

    describe('Click Navigate Back', function () {
        it('should navigate', function(){
            var stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1', trackCrumbTrail: true }
            ]);
            stateNavigator.navigate('s0');
            stateNavigator.navigate('s1');
            var container = document.createElement('div');
            var root = createRoot(container)
            act(() => {
                root.render(
                    <NavigationHandler stateNavigator={stateNavigator}>
                        <NavigationContext.Consumer>
                            {({stateNavigator}) => (
                                <div onClick={() => stateNavigator.navigateBack(1, undefined)} />
                            )}
                        </NavigationContext.Consumer>
                    </NavigationHandler>
                );
            });
            var div = container.querySelector<HTMLDivElement>('div');
            act(() => Simulate.click(div));
            assert.equal(stateNavigator.stateContext.state, stateNavigator.states['s0']);
        })
    });

    describe('Old Context Navigation Back Link', function () {
        it('should update', function(){
            var stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1', trackCrumbTrail: true },
                { key: 's2', route: 'r2', trackCrumbTrail: true },
            ]);
            const FirstContext = ({children}: any) => {
                const context = useContext(NavigationContext);
                const mountContext = useMemo(() => context, []);
                return (
                    <NavigationContext.Provider value={mountContext}>
                        {children}
                    </NavigationContext.Provider>
                );
            }
            stateNavigator.navigate('s0', {x: 'a'});
            stateNavigator.navigate('s1', {y: 'b'});
            var container = document.createElement('div');
            var root = createRoot(container)
            act(() => {
                root.render(
                    <NavigationHandler stateNavigator={stateNavigator}>
                        <FirstContext>
                            <NavigationBackLink
                                distance={1}>
                                link text
                            </NavigationBackLink>
                        </FirstContext>
                    </NavigationHandler>
                );
            });
            act(() => stateNavigator.navigate('s2', {z: 'c'}));
            var link = container.querySelector<HTMLAnchorElement>('a');
            act(() => Simulate.click(link));
            assert.equal(stateNavigator.stateContext.url, '/r0?x=a');
            assert.equal(stateNavigator.stateContext.state, stateNavigator.states['s0']);
            assert.equal(stateNavigator.stateContext.data.x, 'a');
            assert.equal(stateNavigator.stateContext.oldUrl, '/r1?y=b&crumb=%2Fr0%3Fx%3Da');
            assert.equal(stateNavigator.stateContext.oldState, stateNavigator.states['s1']);
            assert.equal(stateNavigator.stateContext.oldData.y, 'b');
            assert.equal(stateNavigator.stateContext.previousUrl, undefined);
            assert.equal(stateNavigator.stateContext.previousState, undefined);
            assert.equal(Object.keys(stateNavigator.stateContext.previousData).length, 0);
            assert.equal(stateNavigator.stateContext.crumbs.length, 0);
        })
    });

    describe('Batch Back Navigation', function () {
        it('should update once', function(){
            var stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1', trackCrumbTrail: true },
                { key: 's2', route: 'r2', trackCrumbTrail: true },
            ]);
            var {s0, s1, s2} = stateNavigator.states;
            var Scene = () => {
                var { data } = useContext(NavigationContext);
                return <div>{data.x}</div>
            }
            var Scene2 = () => {
                var { stateNavigator } = useContext(NavigationContext);
                return (
                    <button onClick={() => {
                        stateNavigator.navigateBack(1);
                        stateNavigator.navigateBack(1);
                    }} />
                );
            }
            s0.renderScene = () => <Scene />;
            s1.renderScene = () => <Scene />;
            s2.renderScene = () => <Scene2 />;
            stateNavigator.navigate('s0');
            stateNavigator.navigate('s1', {x: 'a'});
            stateNavigator.navigate('s2', {x: 'b'});
            var container = document.createElement('div');
            var root = createRoot(container)
            act(() => {
                root.render(
                    <NavigationHandler stateNavigator={stateNavigator}>
                        <NavigationContext.Consumer>
                            {({state, data}) => state.renderScene(data)}
                        </NavigationContext.Consumer>
                    </NavigationHandler>
                );
            });
            var button = container.querySelector<HTMLButtonElement>('button');
            act(() => Simulate.click(button));
            var div = container.querySelector<HTMLDivElement>('div');
            assert.equal(div.innerHTML, 'a');
            assert.equal(stateNavigator.stateContext.oldData.x, 'b');
            assert.equal(stateNavigator.stateContext.oldState, s2);
            assert.equal(stateNavigator.stateContext.data.x, 'a');
            assert.equal(stateNavigator.stateContext.state, s1);
        })
    });

    describe('Start Transition Back Navigation Link', function () {
        it('should delay update', function(done: MochaDone){
            var stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1', trackCrumbTrail: true }
            ]);
            var {s0, s1} = stateNavigator.states;
            var yVal = undefined;
            var stateContextVal;
            var Scene = () => {
                var [ y, setY ] = useState(null);
                useEffect(() => {
                    if (y) {
                        yVal = y;
                        stateContextVal = stateNavigator.stateContext;
                    }
                })
                return (
                    <NavigationBackLink
                        distance={1}
                        startTransition={(React as any).startTransition}
                        navigating={() => {
                            setY('a')
                            return true;
                        }}
                    />
                );
            }
            s0.renderScene = () => <div>b</div>;
            s1.renderScene = () => <Scene />;
            stateNavigator.navigate('s0', {x: 1});
            stateNavigator.navigate('s1');
            var container = document.createElement('div');
            var root = createRoot(container)
            act(() => {
                root.render(
                    <NavigationHandler stateNavigator={stateNavigator}>
                        <NavigationContext.Consumer>
                            {({state, data}) => state.renderScene(data)}
                        </NavigationContext.Consumer>
                    </NavigationHandler>
                );
            });
            var link = container.querySelector<HTMLAnchorElement>('a');
            var error = console.error;
            console.error = () => {};
            try {
                Simulate.click(link);
            } finally {
                console.error = error;
            }
            stateNavigator.onNavigate(() => {
                var div = container.querySelector<HTMLDivElement>('div');
                assert.equal(yVal, 'a');
                assert.equal(div.innerHTML, 'b');
                assert.equal(stateContextVal.state, s1)
                assert.equal(stateContextVal.data.x, undefined)
                assert.equal(stateNavigator.stateContext.state, s0);
                assert.equal(stateNavigator.stateContext.data.x, 1);
                done()
            })
        })
    });
});
